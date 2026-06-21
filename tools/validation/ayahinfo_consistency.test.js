const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Configurations
// 'hafs_tolerant' (default app-facing mode) or 'warsh_diagnostic' (pure Warsh numbering test)
const NUMBERING_MODE = process.env.NUMBERING_MODE || 'hafs_tolerant';

// Constants
const DEFAULT_LEFT_MARGIN = 0.03;
const DEFAULT_RIGHT_MARGIN = 0.97;

// Tolerances
const GEOM_OVERLAP_TOLERANCE = 0.01;
const GEOM_GAP_TOLERANCE = 0.025;
const MARKER_MATCH_TOLERANCE = 0.025;

// Warsh ayah counts per surah (1-based index maps to sura - 1)
const warsh_counts = [
    7, 285, 200, 175, 122, 167, 206, 76, 130, 109, 121, 111, 44, 54,
    99, 128, 110, 105, 99, 134, 111, 76, 119, 62, 77, 226, 95, 88,
    69, 59, 33, 30, 73, 54, 46, 82, 182, 86, 72, 84, 53, 50,
    89, 56, 36, 34, 39, 29, 18, 45, 60, 47, 61, 55, 77, 99,
    28, 21, 24, 13, 14, 11, 11, 18, 12, 12, 31, 52, 52, 44,
    30, 28, 18, 55, 39, 31, 50, 40, 45, 42, 29, 19, 36, 25,
    22, 17, 19, 26, 32, 20, 15, 21, 11, 8, 8, 20, 5, 8,
    9, 11, 10, 8, 3, 9, 5, 5, 6, 3, 6, 3, 5, 4, 5, 6
];

// Hafs (Kufi) ayah counts per surah (1-based index maps to sura - 1)
const hafs_counts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52,
    99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88,
    69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53,
    89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96,
    29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25,
    22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8,
    8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

const suraCounts = NUMBERING_MODE === 'warsh_diagnostic' ? warsh_counts : hafs_counts;

// Setup directories
const baseDir = path.resolve(__dirname, '../../databases/ayahinfo/warsh_muthamman');
const pagesJsonDir = path.join(baseDir, 'pages_json');
const layoutJsonDir = path.join(baseDir, 'page_layout_json');
const reportDir = __dirname; // warsh-muthamman-assets/tools/validation/

function compareHighlightsReadingOrder(a, b) {
    if (a.line !== b.line) return a.line - b.line;
    const rightA = Math.max(a.left, a.right);
    const rightB = Math.max(b.left, b.right);
    if (Math.abs(rightA - rightB) > 0.000001) return rightB - rightA; // larger right is first (RTL)
    return Math.min(a.left, a.right) - Math.min(b.left, b.right); // smaller left is second
}

function compareMarkersReadingOrder(a, b) {
    if (a.line !== b.line) return a.line - b.line;
    return b.center_x - a.center_x; // larger center_x is first (RTL)
}

function getCategory(code) {
    const mappings = {
        'FILE_MISSING': 'structural',
        'JSON_PARSE_ERROR': 'structural',
        'PAGE_FIELD_MISMATCH': 'structural',
        'SCHEMA_ERROR': 'structural',
        'SCHEMA_MISMATCH': 'structural',
        'HEADER_PAGE_MISMATCH': 'structural',
        'HEADER_SURA_OUT_OF_RANGE': 'numbering',
        'HEADER_COORDS_OUT_OF_RANGE': 'structural',
        'HIGHLIGHT_PAGE_MISMATCH': 'structural',
        'HIGHLIGHT_LINE_OUT_OF_RANGE': 'structural',
        'HIGHLIGHT_SURA_OUT_OF_RANGE': 'numbering',
        'HIGHLIGHT_AYAH_OUT_OF_RANGE': 'numbering',
        'HIGHLIGHT_COORDS_OUT_OF_RANGE': 'structural',
        'HIGHLIGHT_MARGIN_DEVIATION': 'geometry',
        'MARKER_PAGE_MISMATCH': 'structural',
        'MARKER_LINE_OUT_OF_RANGE': 'structural',
        'MARKER_SURA_OUT_OF_RANGE': 'numbering',
        'MARKER_AYAH_OUT_OF_RANGE': 'numbering',
        'MARKER_COORDS_OUT_OF_RANGE': 'structural',
        'MARKER_Y_OUT_OF_MARGINS': 'geometry',
        'DUPLICATE_HIGHLIGHT': 'structural',
        'DUPLICATE_MARKER': 'structural',
        'HIGHLIGHT_ORDER_OSCILLATION': 'ordering',
        'HIGHLIGHT_ORDER_REGRESSION': 'ordering',
        'HIGHLIGHT_ORDER_JUMP': 'ordering',
        'SAME_LINE_OVERLAP': 'geometry',
        'SAME_LINE_GAP': 'geometry',
        'MARKER_Y_CLOSE_TO_EDGE': 'geometry',
        'MARKER_NO_HIGHLIGHT': 'geometry',
        'MARKER_NOT_ON_HIGHLIGHT_LINE': 'geometry',
        'MARKER_BOUNDARY_MISMATCH': 'geometry',
        'DUPLICATE_MARKER_AYAH': 'ordering',
        'MARKER_ORDER_REGRESSION': 'ordering',
        'ORPHAN_HIGHLIGHT_NO_MARKER': 'geometry',
        'LINE_COUNT_MISMATCH': 'layout',
        'LAYOUT_LINE_MISMATCH': 'layout',
        'LAYOUT_NON_FINITE': 'layout',
        'LAYOUT_ORDER_INVALID': 'layout',
        'LAYOUT_VERTICAL_OVERLAP': 'layout'
    };
    return mappings[code] || 'other';
}

test('Warsh Muthamman Ayahinfo Consistency Validation', () => {
    const issues = [];
    let pagesChecked = 0;

    // Helper to log issue and return the object
    function logIssue(page, severity, line, suraAyah, code, message, details) {
        const category = getCategory(code);
        
        // Adjust severity for numbering errors under hafs_tolerant mode
        let finalSeverity = severity;
        if (NUMBERING_MODE === 'hafs_tolerant' && category === 'numbering') {
            if (severity === 'fatal') {
                finalSeverity = 'warning';
            }
        }

        const issue = {
            page,
            severity: finalSeverity,
            category,
            line,
            suraAyah,
            code,
            message,
            details: details || {}
        };
        issues.push(issue);
        return issue;
    }

    for (let pageVal = 1; pageVal <= 485; pageVal++) {
        const pageStr = String(pageVal).padStart(3, '0');
        const pageFile = `page_${pageStr}.json`;
        const pageJsonPath = path.join(pagesJsonDir, pageFile);
        const layoutJsonPath = path.join(layoutJsonDir, pageFile);

        // 1. File existence checks
        if (!fs.existsSync(pageJsonPath)) {
            logIssue(pageVal, 'fatal', null, null, 'FILE_MISSING', `Page file ${pageFile} not found in pages_json`, { path: pageJsonPath });
            continue;
        }
        if (!fs.existsSync(layoutJsonPath)) {
            logIssue(pageVal, 'fatal', null, null, 'FILE_MISSING', `Page layout file ${pageFile} not found in page_layout_json`, { path: layoutJsonPath });
            continue;
        }

        pagesChecked++;

        // Read and parse
        let pageData, layoutData;
        try {
            pageData = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
        } catch (e) {
            logIssue(pageVal, 'fatal', null, null, 'JSON_PARSE_ERROR', `Failed to parse data JSON: ${e.message}`, { path: pageJsonPath });
            continue;
        }

        try {
            layoutData = JSON.parse(fs.readFileSync(layoutJsonPath, 'utf8'));
        } catch (e) {
            logIssue(pageVal, 'fatal', null, null, 'JSON_PARSE_ERROR', `Failed to parse layout JSON: ${e.message}`, { path: layoutJsonPath });
            continue;
        }

        // Schema structure checks
        let pageHasPageMismatch = false;
        let suppressedDerivedCount = 0;
        let pageMismatchIssue = null;

        if (pageData.page !== pageVal || layoutData.page !== pageVal) {
            pageHasPageMismatch = true;
            pageMismatchIssue = logIssue(pageVal, 'fatal', null, null, 'PAGE_FIELD_MISMATCH', 
                `Page field mismatch: data page is ${pageData.page}, layout page is ${layoutData.page}, but file is page_${pageStr}.json`,
                { dataPage: pageData.page, layoutPage: layoutData.page, file: pageFile }
            );
        }

        if (!Array.isArray(pageData.ayah_highlights)) {
            logIssue(pageVal, 'fatal', null, null, 'SCHEMA_ERROR', 'ayah_highlights field is not an array', { file: pageFile });
            pageData.ayah_highlights = [];
        }
        if (!Array.isArray(pageData.ayah_markers)) {
            logIssue(pageVal, 'fatal', null, null, 'SCHEMA_ERROR', 'ayah_markers field is not an array', { file: pageFile });
            pageData.ayah_markers = [];
        }
        if (pageData.sura_headers && !Array.isArray(pageData.sura_headers)) {
            logIssue(pageVal, 'fatal', null, null, 'SCHEMA_ERROR', 'sura_headers field is present but not an array', { file: pageFile });
            pageData.sura_headers = [];
        }

        if (!Array.isArray(layoutData.lineBands)) {
            logIssue(pageVal, 'fatal', null, null, 'SCHEMA_ERROR', 'lineBands in layout is not an array', { file: pageFile });
            layoutData.lineBands = [];
        }

        const lineBandsCount = layoutData.lineBands.length;

        // Verify detectedLineCount
        if (layoutData.detectedLineCount !== undefined && layoutData.detectedLineCount !== lineBandsCount) {
            logIssue(pageVal, 'warning', null, null, 'LINE_COUNT_MISMATCH', `detectedLineCount (${layoutData.detectedLineCount}) does not match lineBands count (${lineBandsCount})`, { detected: layoutData.detectedLineCount, bands: lineBandsCount });
        }

        // 2. Layout Sanity
        for (let i = 0; i < lineBandsCount; i++) {
            const b = layoutData.lineBands[i];
            const lineNum = i + 1;
            if (b.line !== lineNum) {
                logIssue(pageVal, 'fatal', lineNum, null, 'LAYOUT_LINE_MISMATCH', `Line index in layout ${b.line} does not match expected sequence ${lineNum}`, { line: b.line });
            }
            if (!Number.isFinite(b.top) || !Number.isFinite(b.center) || !Number.isFinite(b.bottom)) {
                logIssue(pageVal, 'fatal', lineNum, null, 'LAYOUT_NON_FINITE', 'Line band coordinates are not finite numbers', { top: b.top, center: b.center, bottom: b.bottom });
            } else {
                if (b.center <= b.top || b.center >= b.bottom) {
                    const errorAmount = b.center <= b.top ? b.top - b.center : b.center - b.bottom;
                    if (errorAmount > 5) {
                        logIssue(pageVal, 'fatal', lineNum, null, 'LAYOUT_ORDER_INVALID', `Line vertical bounds invalid: center (${b.center}) is outside top-bottom (${b.top}-${b.bottom}) by ${errorAmount}px`, { top: b.top, center: b.center, bottom: b.bottom, errorAmount });
                    } else {
                        logIssue(pageVal, 'warning', lineNum, null, 'LAYOUT_ORDER_INVALID', `Line vertical bounds slightly off: center (${b.center}) is outside top-bottom (${b.top}-${b.bottom}) by ${errorAmount}px`, { top: b.top, center: b.center, bottom: b.bottom, errorAmount });
                    }
                }
            }

            // Check vertical overlap (with tolerances to avoid false-positives on rounding)
            if (i > 0) {
                const prevB = layoutData.lineBands[i - 1];
                const overlap = prevB.bottom - b.top;
                if (overlap > 12) {
                    logIssue(pageVal, 'fatal', lineNum, null, 'LAYOUT_VERTICAL_OVERLAP', `Large vertical overlap with previous line band by ${overlap}px`, { prevBottom: prevB.bottom, currTop: b.top, overlap });
                } else if (overlap > 2) {
                    logIssue(pageVal, 'suspicious', lineNum, null, 'LAYOUT_VERTICAL_OVERLAP', `Minor vertical overlap with previous line band by ${overlap}px`, { prevBottom: prevB.bottom, currTop: b.top, overlap });
                }
            }
        }

        // 3. Schema & Ranges on highlights, markers and headers
        const validHighlights = [];
        const validMarkers = [];

        // Sura Headers Check
        if (Array.isArray(pageData.sura_headers)) {
            for (let idx = 0; idx < pageData.sura_headers.length; idx++) {
                const sh = pageData.sura_headers[idx];
                let isValidHeader = true;

                if (sh.page !== pageVal) {
                    isValidHeader = false;
                    if (pageHasPageMismatch) {
                        suppressedDerivedCount++;
                    } else {
                        logIssue(pageVal, 'fatal', null, `Sura ${sh.sura}`, 'HEADER_PAGE_MISMATCH', `Header page (${sh.page}) does not match actual page (${pageVal})`, { header: sh });
                    }
                }
                if (!Number.isInteger(sh.sura) || sh.sura < 1 || sh.sura > 114) {
                    isValidHeader = false;
                    logIssue(pageVal, 'fatal', null, `Sura ${sh.sura}`, 'HEADER_SURA_OUT_OF_RANGE', `Header sura number (${sh.sura}) is out of range 1..114`, { header: sh });
                }
                if (!Number.isFinite(sh.center_x) || sh.center_x < 0 || sh.center_x > 1 ||
                    !Number.isFinite(sh.center_y) || sh.center_y < 0 || sh.center_y > 1) {
                    isValidHeader = false;
                    logIssue(pageVal, 'fatal', null, `Sura ${sh.sura}`, 'HEADER_COORDS_OUT_OF_RANGE', 'Header coordinates are not finite or outside 0..1 range', { header: sh });
                }
            }
        }

        // Validate Highlights and build validHighlights
        pageData.ayah_highlights.forEach((h, idx) => {
            const ayahKey = `${h.sura}:${h.ayah}`;
            let isValid = true;

            if (h.page !== pageVal) {
                isValid = false;
                if (pageHasPageMismatch) {
                    suppressedDerivedCount++;
                } else {
                    logIssue(pageVal, 'fatal', h.line, ayahKey, 'HIGHLIGHT_PAGE_MISMATCH', `Highlight page (${h.page}) does not match actual page (${pageVal})`, { highlight: h });
                }
            }
            if (!Number.isInteger(h.line) || h.line < 1 || h.line > lineBandsCount) {
                isValid = false;
                logIssue(pageVal, 'fatal', h.line, ayahKey, 'HIGHLIGHT_LINE_OUT_OF_RANGE', `Highlight line (${h.line}) is outside layout bands (1..${lineBandsCount})`, { highlight: h });
            }
            if (!Number.isInteger(h.sura) || h.sura < 1 || h.sura > 114) {
                isValid = false;
                logIssue(pageVal, 'fatal', h.line, ayahKey, 'HIGHLIGHT_SURA_OUT_OF_RANGE', `Highlight sura number (${h.sura}) is out of range 1..114`, { highlight: h });
            } else {
                const maxAyah = suraCounts[h.sura - 1];
                if (!Number.isInteger(h.ayah) || h.ayah < 1 || h.ayah > maxAyah) {
                    isValid = false;
                    logIssue(pageVal, 'fatal', h.line, ayahKey, 'HIGHLIGHT_AYAH_OUT_OF_RANGE', `Highlight ayah (${h.ayah}) is out of range for sura (max ${maxAyah})`, { highlight: h });
                }
            }
            if (!Number.isFinite(h.left) || h.left < 0 || h.left > 1 ||
                !Number.isFinite(h.right) || h.right < 0 || h.right > 1) {
                isValid = false;
                logIssue(pageVal, 'fatal', h.line, ayahKey, 'HIGHLIGHT_COORDS_OUT_OF_RANGE', 'Highlight boundaries are not finite or outside 0..1 range', { highlight: h });
            } else {
                // Warning if highlight borders are too far from typical margins (0.03 .. 0.97)
                if (h.left < 0.02 || h.left > 0.98) {
                    logIssue(pageVal, 'warning', h.line, ayahKey, 'HIGHLIGHT_MARGIN_DEVIATION', `Highlight left boundary (${h.left.toFixed(3)}) deviates from typical margin 0.03`, { left: h.left, right: h.right });
                }
                if (h.right < 0.02 || h.right > 0.98) {
                    logIssue(pageVal, 'warning', h.line, ayahKey, 'HIGHLIGHT_MARGIN_DEVIATION', `Highlight right boundary (${h.right.toFixed(3)}) deviates from typical margin 0.97`, { left: h.left, right: h.right });
                }
            }

            if (isValid) {
                validHighlights.push(h);
            }
        });

        // Validate Markers and build validMarkers
        pageData.ayah_markers.forEach((m, idx) => {
            const ayahKey = `${m.sura}:${m.ayah}`;
            let isValid = true;

            if (m.page !== pageVal) {
                isValid = false;
                if (pageHasPageMismatch) {
                    suppressedDerivedCount++;
                } else {
                    logIssue(pageVal, 'fatal', m.line, ayahKey, 'MARKER_PAGE_MISMATCH', `Marker page (${m.page}) does not match actual page (${pageVal})`, { marker: m });
                }
            }
            if (!Number.isInteger(m.line) || m.line < 1 || m.line > lineBandsCount) {
                isValid = false;
                logIssue(pageVal, 'fatal', m.line, ayahKey, 'MARKER_LINE_OUT_OF_RANGE', `Marker line (${m.line}) is outside layout bands (1..${lineBandsCount})`, { marker: m });
            }
            if (!Number.isInteger(m.sura) || m.sura < 1 || m.sura > 114) {
                isValid = false;
                logIssue(pageVal, 'fatal', m.line, ayahKey, 'MARKER_SURA_OUT_OF_RANGE', `Marker sura number (${m.sura}) is out of range 1..114`, { marker: m });
            } else {
                const maxAyah = suraCounts[m.sura - 1];
                if (!Number.isInteger(m.ayah) || m.ayah < 1 || m.ayah > maxAyah) {
                    isValid = false;
                    logIssue(pageVal, 'fatal', m.line, ayahKey, 'MARKER_AYAH_OUT_OF_RANGE', `Marker ayah (${m.ayah}) is out of range for sura (max ${maxAyah})`, { marker: m });
                }
            }
            if (!Number.isFinite(m.center_x) || m.center_x < 0 || m.center_x > 1 ||
                !Number.isFinite(m.center_y) || m.center_y < 0 || m.center_y > 1) {
                isValid = false;
                logIssue(pageVal, 'fatal', m.line, ayahKey, 'MARKER_COORDS_OUT_OF_RANGE', 'Marker coordinates are not finite or outside 0..1 range', { marker: m });
            } else {
                // Warning if center_y is outside 0.02..0.98
                if (m.center_y < 0.02 || m.center_y > 0.98) {
                    logIssue(pageVal, 'warning', m.line, ayahKey, 'MARKER_Y_OUT_OF_MARGINS', `Marker center_y (${m.center_y.toFixed(3)}) is outside safe margins 0.02..0.98`, { center_x: m.center_x, center_y: m.center_y });
                }
            }

            if (isValid) {
                validMarkers.push(m);
            }
        });

        // Update pageMismatchIssue if present and we suppressed derived issues
        if (pageMismatchIssue && suppressedDerivedCount > 0) {
            pageMismatchIssue.details.suppressedDerivedCount = suppressedDerivedCount;
            pageMismatchIssue.message += ` (Suppressed ${suppressedDerivedCount} derived highlights/markers errors due to page mismatch)`;
        }

        // 4. Duplicate checks
        // Exact duplicate highlights
        const seenHls = new Set();
        pageData.ayah_highlights.forEach(h => {
            const key = `${h.line}-${h.sura}-${h.ayah}-${h.left}-${h.right}`;
            if (seenHls.has(key)) {
                logIssue(pageVal, 'fatal', h.line, `${h.sura}:${h.ayah}`, 'DUPLICATE_HIGHLIGHT', 'Exact duplicate highlight segment detected', { highlight: h });
            } else {
                seenHls.add(key);
            }
        });

        // Exact duplicate markers
        const seenMks = new Set();
        pageData.ayah_markers.forEach(m => {
            const key = `${m.line}-${m.sura}-${m.ayah}-${m.center_x}-${m.center_y}`;
            if (seenMks.has(key)) {
                logIssue(pageVal, 'fatal', m.line, `${m.sura}:${m.ayah}`, 'DUPLICATE_MARKER', 'Exact duplicate marker circle detected', { marker: m });
            } else {
                seenMks.add(key);
            }
        });

        // 5. Visual Reading Order (run only on valid records to prevent derived spam)
        const sortedHighlights = [...validHighlights].sort(compareHighlightsReadingOrder);

        const seenAyahTransitions = new Set();
        let prevKey = null;
        let prevSura = null;
        let prevAyah = null;

        sortedHighlights.forEach(h => {
            const currKey = `${h.sura}:${h.ayah}`;
            if (currKey !== prevKey) {
                if (seenAyahTransitions.has(currKey)) {
                    logIssue(pageVal, 'fatal', h.line, currKey, 'HIGHLIGHT_ORDER_OSCILLATION', 'Ayah reappeared in reading order after transitioning to other ayahs', { current: currKey, previous: prevKey });
                }
                seenAyahTransitions.add(currKey);

                if (prevSura !== null) {
                    if (h.sura === prevSura) {
                        if (h.ayah < prevAyah) {
                            logIssue(pageVal, 'fatal', h.line, currKey, 'HIGHLIGHT_ORDER_REGRESSION', `Ayah regression inside sura: from ${prevSura}:${prevAyah} back to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey });
                        } else if (h.ayah > prevAyah + 1) {
                            logIssue(pageVal, 'suspicious', h.line, currKey, 'HIGHLIGHT_ORDER_JUMP', `Ayah forward jump: from ${prevSura}:${prevAyah} to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey });
                        }
                    } else if (h.sura === prevSura + 1) {
                        if (h.ayah !== 1) {
                            logIssue(pageVal, 'suspicious', h.line, currKey, 'HIGHLIGHT_ORDER_JUMP', `Sura transition started with ayah ${h.ayah} instead of 1 (from ${prevSura}:${prevAyah} to ${h.sura}:${h.ayah})`, { prev: `${prevSura}:${prevAyah}`, curr: currKey });
                        }
                    } else if (h.sura > prevSura + 1) {
                        logIssue(pageVal, 'suspicious', h.line, currKey, 'HIGHLIGHT_ORDER_JUMP', `Sura forward jump: from ${prevSura}:${prevAyah} to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey });
                    } else if (h.sura < prevSura) {
                        logIssue(pageVal, 'fatal', h.line, currKey, 'HIGHLIGHT_ORDER_REGRESSION', `Sura regression: from ${prevSura}:${prevAyah} back to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey });
                    }
                }

                prevKey = currKey;
                prevSura = h.sura;
                prevAyah = h.ayah;
            }
        });

        // 6. Same-line Geometry Checks (run on sorted valid highlights)
        for (let lineNum = 1; lineNum <= lineBandsCount; lineNum++) {
            const lineHls = sortedHighlights.filter(h => h.line === lineNum);
            if (lineHls.length > 1) {
                for (let i = 0; i < lineHls.length - 1; i++) {
                    const previous = lineHls[i]; // visually right
                    const next = lineHls[i + 1];     // visually left
                    const boundaryDelta = previous.left - next.right;

                    const prevKey = `${previous.sura}:${previous.ayah}`;
                    const nextKey = `${next.sura}:${next.ayah}`;

                    if (boundaryDelta > GEOM_GAP_TOLERANCE) {
                        // Gap: previous ends before next starts (large visual gap)
                        logIssue(pageVal, 'suspicious', lineNum, `${prevKey} -> ${nextKey}`, 'SAME_LINE_GAP', `Horizontal gap on same line by ${boundaryDelta.toFixed(4)}`, { prev: previous, next, boundaryDelta, tolerance: GEOM_GAP_TOLERANCE });
                    } else if (boundaryDelta < -GEOM_OVERLAP_TOLERANCE) {
                        // Overlap: previous extends leftwards past next's start (visual overlap)
                        logIssue(pageVal, 'suspicious', lineNum, `${prevKey} -> ${nextKey}`, 'SAME_LINE_OVERLAP', `Horizontal overlap on same line by ${(-boundaryDelta).toFixed(4)}`, { prev: previous, next, boundaryDelta, tolerance: GEOM_OVERLAP_TOLERANCE });
                    }
                }
            }
        }

        // 7. Marker Binding and Alignment (on valid markers & highlights)
        validMarkers.forEach(m => {
            const mKey = `${m.sura}:${m.ayah}`;
            const pageHls = validHighlights.filter(h => h.sura === m.sura && h.ayah === m.ayah);

            // absolute Y calculations and checks
            const band = layoutData.lineBands.find(b => b.line === m.line);
            if (band) {
                const absoluteY = band.top + m.center_y * (band.bottom - band.top);
                // Warning if the marker is very close to line boundaries (< 0.1 or > 0.9)
                if (m.center_y < 0.1 || m.center_y > 0.9) {
                    logIssue(pageVal, 'warning', m.line, mKey, 'MARKER_Y_CLOSE_TO_EDGE', 
                        `Marker Y center (${m.center_y.toFixed(3)}) is very close to line bounds. Absolute Y = ${absoluteY.toFixed(1)}px (band: ${band.top} - ${band.bottom}). Note: Flutter might use band center.`, 
                        { marker: m, band, absoluteY });
                }
            }

            if (pageHls.length === 0) {
                logIssue(pageVal, 'fatal', m.line, mKey, 'MARKER_NO_HIGHLIGHT', `Marker exists for ${mKey} but no highlight found on page`, { marker: m });
            } else {
                const lineHls = pageHls.filter(h => h.line === m.line);
                if (lineHls.length === 0) {
                    logIssue(pageVal, 'suspicious', m.line, mKey, 'MARKER_NOT_ON_HIGHLIGHT_LINE', `Marker exists on line ${m.line} for ${mKey} but highlight is on different line(s)`, { marker: m, pageHighlightsLines: pageHls.map(h => h.line) });
                } else {
                    // Check matches for current ayah highlight on same line
                    // The end of this ayah highlight should line up with the marker's center_x
                    const closestHl = lineHls.sort((a, b) => Math.abs(a.left - m.center_x) - Math.abs(b.left - m.center_x))[0];
                    
                    const isFullLine = (closestHl.left <= 0.04 && closestHl.right >= 0.96);
                    let shouldCheckCurrent = true;
                    if (isFullLine) {
                        // Skip checking current boundary if it is full line and marker is close to left margin
                        if (m.center_x <= 0.09) {
                            shouldCheckCurrent = false;
                        }
                    }

                    if (shouldCheckCurrent) {
                        const delta = Math.abs(closestHl.left - m.center_x);
                        if (delta > MARKER_MATCH_TOLERANCE) {
                            logIssue(pageVal, 'suspicious', m.line, mKey, 'MARKER_BOUNDARY_MISMATCH', 
                                `Marker center (${m.center_x.toFixed(4)}) is misaligned with highlight left (${closestHl.left.toFixed(4)}) by ${delta.toFixed(4)}`, 
                                { expectedBoundary: closestHl.left, actualBoundary: m.center_x, delta, tolerance: MARKER_MATCH_TOLERANCE, marker: m, highlight: closestHl });
                        }
                    }
                }

                // Skip next boundary check if marker is close to left margin
                if (m.center_x > 0.09) {
                    let nextSura = m.sura;
                    let nextAyah = m.ayah + 1;
                    if (nextAyah > suraCounts[m.sura - 1]) {
                        nextSura = m.sura + 1;
                        nextAyah = 1;
                    }

                    if (nextSura <= 114) {
                        const nextCandidates = validHighlights.filter(h => h.sura === nextSura && h.ayah === nextAyah && h.line === m.line);
                        if (nextCandidates.length > 0) {
                            // Pick the closest highlight for the next ayah
                            const closestNext = nextCandidates.sort((a, b) => Math.abs(a.right - m.center_x) - Math.abs(b.right - m.center_x))[0];
                            const deltaNext = Math.abs(closestNext.right - m.center_x);
                            if (deltaNext > MARKER_MATCH_TOLERANCE) {
                                logIssue(pageVal, 'suspicious', m.line, `${nextSura}:${nextAyah}`, 'MARKER_BOUNDARY_MISMATCH', 
                                    `Marker center (${m.center_x.toFixed(4)}) is misaligned with next ayah right (${closestNext.right.toFixed(4)}) by ${deltaNext.toFixed(4)}`, 
                                    { expectedBoundary: closestNext.right, actualBoundary: m.center_x, delta: deltaNext, tolerance: MARKER_MATCH_TOLERANCE, marker: m, highlight: closestNext });
                            }
                        }
                    }
                }
            }
        });

        // 8. Marker Order Progression (on valid markers)
        const sortedMarkers = [...validMarkers].sort(compareMarkersReadingOrder);
        const seenMarkersCount = new Map();
        let prevMkrSura = null;
        let prevMkrAyah = null;

        sortedMarkers.forEach(m => {
            const mKey = `${m.sura}:${m.ayah}`;
            const count = (seenMarkersCount.get(mKey) || 0) + 1;
            seenMarkersCount.set(mKey, count);

            if (count > 1) {
                logIssue(pageVal, 'warning', m.line, mKey, 'DUPLICATE_MARKER_AYAH', `Multiple markers (${count} times) found on page for same ayah ${mKey}`, { marker: m });
            }

            if (prevMkrSura !== null) {
                if (m.sura === prevMkrSura) {
                    if (m.ayah < prevMkrAyah) {
                        logIssue(pageVal, 'fatal', m.line, mKey, 'MARKER_ORDER_REGRESSION', `Marker order regression: from ${prevMkrSura}:${prevMkrAyah} back to ${m.sura}:${m.ayah}`, { prev: `${prevMkrSura}:${prevMkrAyah}`, curr: mKey });
                    }
                } else if (m.sura < prevMkrSura) {
                    logIssue(pageVal, 'fatal', m.line, mKey, 'MARKER_ORDER_REGRESSION', `Marker sura regression: from ${prevMkrSura}:${prevMkrAyah} back to ${m.sura}:${m.ayah}`, { prev: `${prevMkrSura}:${prevMkrAyah}`, curr: mKey });
                }
            }

            prevMkrSura = m.sura;
            prevMkrAyah = m.ayah;
        });

        // 9. Orphan Highlights (Highlights without a marker on the page)
        const highlightAyahs = new Set(validHighlights.map(h => `${h.sura}:${h.ayah}`));
        highlightAyahs.forEach(ayahKey => {
            const hasMarker = validMarkers.some(m => `${m.sura}:${m.ayah}` === ayahKey);
            if (!hasMarker) {
                const ayahHls = validHighlights.filter(h => `${h.sura}:${h.ayah}` === ayahKey);
                const lastHl = ayahHls.sort(compareHighlightsReadingOrder)[ayahHls.length - 1];
                if (lastHl) {
                    // Check if it ends clearly before the left margin (e.g. left > 0.08)
                    if (lastHl.left > 0.08) {
                        logIssue(pageVal, 'warning', lastHl.line, ayahKey, 'ORPHAN_HIGHLIGHT_NO_MARKER', `Highlight ends before left margin (${lastHl.left.toFixed(3)}) but no marker circle found on page`, { lastHighlight: lastHl });
                    }
                }
            }
        });
    }

    // 10. Write Reports & Summaries
    const fatalCount = issues.filter(x => x.severity === 'fatal').length;
    const warningCount = issues.filter(x => x.severity === 'warning').length;
    const suspiciousCount = issues.filter(x => x.severity === 'suspicious').length;

    // Counts by category + severity
    const statsByCategory = {
        structural: { fatal: 0, warning: 0, suspicious: 0 },
        numbering: { fatal: 0, warning: 0, suspicious: 0 },
        layout: { fatal: 0, warning: 0, suspicious: 0 },
        geometry: { fatal: 0, warning: 0, suspicious: 0 },
        ordering: { fatal: 0, warning: 0, suspicious: 0 },
        other: { fatal: 0, warning: 0, suspicious: 0 }
    };

    let fatalNoNumbering = 0;
    let fatalNumberingOnly = 0;

    issues.forEach(x => {
        const cat = x.category;
        const sev = x.severity;
        if (statsByCategory[cat]) {
            statsByCategory[cat][sev]++;
        } else {
            statsByCategory.other[sev]++;
        }

        if (sev === 'fatal') {
            if (cat === 'numbering') {
                fatalNumberingOnly++;
            } else {
                fatalNoNumbering++;
            }
        }
    });

    const statsByCode = {};
    const statsByPage = {};

    issues.forEach(x => {
        statsByCode[x.code] = (statsByCode[x.code] || 0) + 1;
        statsByPage[x.page] = (statsByPage[x.page] || 0) + 1;
    });

    const severityOrder = { 'fatal': 0, 'warning': 1, 'suspicious': 2 };

    // Separate MARKER_BOUNDARY_MISMATCH from other issues for normal worst/root causes
    const markerMismatches = issues.filter(x => x.code === 'MARKER_BOUNDARY_MISMATCH');
    const nonMismatchIssues = issues.filter(x => x.code !== 'MARKER_BOUNDARY_MISMATCH');

    // Deduplicate non-mismatch issues by (page, code)
    const groupedIssues = {};
    nonMismatchIssues.forEach(x => {
        const key = `${x.page}-${x.code}`;
        if (!groupedIssues[key]) {
            groupedIssues[key] = {
                page: x.page,
                code: x.code,
                category: x.category,
                severity: x.severity,
                suraAyah: x.suraAyah,
                line: x.line,
                message: x.message,
                count: 1
            };
        } else {
            groupedIssues[key].count++;
        }
    });

    const dedupedIssues = Object.values(groupedIssues).sort((a, b) => {
        if (a.severity !== b.severity) {
            return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return a.page - b.page;
    });

    // Top 50 marker boundary mismatches by delta descending
    const markerBoundaryDiagnostics = [...markerMismatches]
        .sort((a, b) => b.details.delta - a.details.delta)
        .slice(0, 50);

    // Top 25 pages by issue count
    const topPages = Object.entries(statsByPage)
        .map(([page, count]) => ({ page: parseInt(page), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 25);

    // Sort full issues for structured report listing
    issues.sort((a, b) => {
        if (a.severity !== b.severity) {
            return severityOrder[a.severity] - severityOrder[b.severity];
        }
        if (a.page !== b.page) return a.page - b.page;
        return (a.line || 0) - (b.line || 0);
    });

    const reportJsonPath = path.join(reportDir, 'ayahinfo_validation_report.json');
    const reportMdPath = path.join(reportDir, 'ayahinfo_validation_report.md');

    // JSON report
    const jsonReport = {
        metadata: {
            timestamp: new Date().toISOString(),
            pagesChecked,
            numberingMode: NUMBERING_MODE,
            stats: {
                totalIssues: issues.length,
                fatal: fatalCount,
                warning: warningCount,
                suspicious: suspiciousCount,
                fatalNoNumbering,
                fatalNumberingOnly
            },
            statsByCategory,
            statsByCode,
            topPages
        },
        issues
    };

    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(reportJsonPath, JSON.stringify(jsonReport, null, 2), 'utf8');

    // Markdown report
    let mdContent = `# Quran Ayahinfo Validation Report (Warsh Muthamman)\n\n`;
    mdContent += `**Date:** ${new Date().toISOString()}  \n`;
    mdContent += `**Pages Checked:** ${pagesChecked} / 485  \n`;
    mdContent += `**Numbering Mode:** \`${NUMBERING_MODE}\`  \n`;
    if (NUMBERING_MODE === 'hafs_tolerant') {
        mdContent += `> **Note:** Numbering validation is app-facing Hafs/Kufi tolerant.  \n\n`;
    } else if (NUMBERING_MODE === 'warsh_diagnostic') {
        mdContent += `> **Note:** Numbering validation is strict Warsh diagnostic and may report app-facing Hafs keys. The current app-facing ayah keys are validated with Hafs/Kufi counts by default; Warsh strict counts are available as diagnostics.  \n\n`;
    } else {
        mdContent += `\n`;
    }

    mdContent += `## Summary Stats\n`;
    mdContent += `| Severity | Count |\n`;
    mdContent += `|---|---|\n`;
    mdContent += `| <span style="color:red">🔴 Fatal</span> | **${fatalCount}** |\n`;
    mdContent += `| <span style="color:orange">🟡 Warning</span> | **${warningCount}** |\n`;
    mdContent += `| <span style="color:blue">🔵 Suspicious</span> | **${suspiciousCount}** |\n`;
    mdContent += `| **Total Issues** | **${issues.length}** |\n\n`;

    mdContent += `### Stats by Category & Severity\n`;
    mdContent += `| Category | Fatal | Warning | Suspicious | Total |\n`;
    mdContent += `|---|---|---|---|---|\n`;
    Object.entries(statsByCategory).forEach(([cat, s]) => {
        const total = s.fatal + s.warning + s.suspicious;
        mdContent += `| \`${cat}\` | ${s.fatal} | ${s.warning} | ${s.suspicious} | **${total}** |\n`;
    });
    mdContent += `\n`;

    mdContent += `### Fatal Breakdown\n`;
    mdContent += `- Fatal Issues (Excluding Numbering): **${fatalNoNumbering}**  \n`;
    mdContent += `- Fatal Numbering Issues Only: **${fatalNumberingOnly}**  \n\n`;

    mdContent += `## Stats by Issue Code\n`;
    mdContent += `| Code | Category | Severity | Count |\n`;
    mdContent += `|---|---|---|---|\n`;
    Object.entries(statsByCode)
        .map(([code, count]) => {
            const first = issues.find(x => x.code === code);
            const sev = first ? first.severity : 'unknown';
            const cat = first ? first.category : 'unknown';
            return { code, sev, cat, count };
        })
        .sort((a, b) => severityOrder[a.sev] - severityOrder[b.sev] || b.count - a.count)
        .forEach(x => {
            let color = 'blue';
            if (x.sev === 'fatal') color = 'red';
            if (x.sev === 'warning') color = 'orange';
            mdContent += `| \`${x.code}\` | \`${x.cat}\` | <span style="color:${color}">${x.sev}</span> | ${x.count} |\n`;
        });
    mdContent += `\n`;

    mdContent += `## Top 25 Pages with Most Issues\n`;
    mdContent += `| Page | Issues Count |\n`;
    mdContent += `|---|---|\n`;
    topPages.forEach(x => {
        mdContent += `| Page ${x.page} | ${x.count} |\n`;
    });
    mdContent += `\n`;

    // Normal Root Causes Section (excluding MARKER_BOUNDARY_MISMATCH)
    mdContent += `## Major Root Causes (Deduplicated, Excluding Mismatch Geometry)\n`;
    mdContent += `| Page | Category | Code | Severity | Ayah | Line | Count | Description |\n`;
    mdContent += `|---|---|---|---|---|---|---|---|\n`;
    dedupedIssues.forEach(x => {
        let color = 'blue';
        if (x.severity === 'fatal') color = 'red';
        if (x.severity === 'warning') color = 'orange';
        const lineVal = x.line !== null ? x.line : '-';
        const ayahVal = x.suraAyah !== null ? x.suraAyah : '-';
        mdContent += `| Page ${x.page} | \`${x.category}\` | \`${x.code}\` | <span style="color:${color}">${x.severity}</span> | ${ayahVal} | ${lineVal} | ${x.count} | ${x.message} |\n`;
    });
    mdContent += `\n`;

    // Structural Section
    mdContent += `## Section 1: Structural Issues\n`;
    mdContent += `| Page | Line | Ayah | Severity | Code | Message |\n`;
    mdContent += `|---|---|---|---|---|---|\n`;
    issues.filter(x => x.category === 'structural').forEach(x => {
        let color = 'red';
        const lineVal = x.line !== null ? x.line : '-';
        const ayahVal = x.suraAyah !== null ? x.suraAyah : '-';
        mdContent += `| Page ${x.page} | ${lineVal} | ${ayahVal} | <span style="color:${color}">${x.severity}</span> | \`${x.code}\` | ${x.message} |\n`;
    });
    mdContent += `\n`;

    // Numbering Section
    mdContent += `## Section 2: Numbering Issues\n`;
    mdContent += `| Page | Line | Ayah | Severity | Code | Message |\n`;
    mdContent += `|---|---|---|---|---|---|\n`;
    issues.filter(x => x.category === 'numbering').forEach(x => {
        let color = x.severity === 'fatal' ? 'red' : 'orange';
        const lineVal = x.line !== null ? x.line : '-';
        const ayahVal = x.suraAyah !== null ? x.suraAyah : '-';
        mdContent += `| Page ${x.page} | ${lineVal} | ${ayahVal} | <span style="color:${color}">${x.severity}</span> | \`${x.code}\` | ${x.message} |\n`;
    });
    mdContent += `\n`;

    // Layout Section
    mdContent += `## Section 3: Layout Issues\n`;
    mdContent += `| Page | Line | Ayah | Severity | Code | Message |\n`;
    mdContent += `|---|---|---|---|---|---|\n`;
    issues.filter(x => x.category === 'layout').forEach(x => {
        let color = x.severity === 'fatal' ? 'red' : (x.severity === 'warning' ? 'orange' : 'blue');
        const lineVal = x.line !== null ? x.line : '-';
        const ayahVal = x.suraAyah !== null ? x.suraAyah : '-';
        mdContent += `| Page ${x.page} | ${lineVal} | ${ayahVal} | <span style="color:${color}">${x.severity}</span> | \`${x.code}\` | ${x.message} |\n`;
    });
    mdContent += `\n`;

    // Ordering Section
    mdContent += `## Section 4: Ordering Issues\n`;
    mdContent += `| Page | Line | Ayah | Severity | Code | Message |\n`;
    mdContent += `|---|---|---|---|---|---|\n`;
    issues.filter(x => x.category === 'ordering').forEach(x => {
        let color = x.severity === 'fatal' ? 'red' : 'orange';
        const lineVal = x.line !== null ? x.line : '-';
        const ayahVal = x.suraAyah !== null ? x.suraAyah : '-';
        mdContent += `| Page ${x.page} | ${lineVal} | ${ayahVal} | <span style="color:${color}">${x.severity}</span> | \`${x.code}\` | ${x.message} |\n`;
    });
    mdContent += `\n`;

    // Geometry & Marker Boundary Section
    mdContent += `## Section 5: Geometry Issues & Diagnostics\n`;
    mdContent += `### Same-Line Gaps, Overlaps and Bindings (Excluding Boundary Mismatch)\n`;
    mdContent += `| Page | Line | Ayah | Severity | Code | Message |\n`;
    mdContent += `|---|---|---|---|---|---|\n`;
    issues.filter(x => x.category === 'geometry' && x.code !== 'MARKER_BOUNDARY_MISMATCH').forEach(x => {
        let color = x.severity === 'fatal' ? 'red' : (x.severity === 'warning' ? 'orange' : 'blue');
        const lineVal = x.line !== null ? x.line : '-';
        const ayahVal = x.suraAyah !== null ? x.suraAyah : '-';
        mdContent += `| Page ${x.page} | ${lineVal} | ${ayahVal} | <span style="color:${color}">${x.severity}</span> | \`${x.code}\` | ${x.message} |\n`;
    });
    mdContent += `\n`;

    mdContent += `### Marker Boundary Diagnostics (Top 50 Worst Mismatches by Delta)\n`;
    mdContent += `| Page | Line | Ayah | Severity | Expected Boundary | Actual Marker X | Delta | Tolerance |\n`;
    mdContent += `|---|---|---|---|---|---|---|---|\n`;
    markerBoundaryDiagnostics.forEach(x => {
        const expected = x.details.expectedBoundary !== undefined ? x.details.expectedBoundary.toFixed(4) : '-';
        const actual = x.details.actualBoundary !== undefined ? x.details.actualBoundary.toFixed(4) : '-';
        const deltaVal = x.details.delta !== undefined ? x.details.delta.toFixed(4) : '-';
        const tol = x.details.tolerance !== undefined ? x.details.tolerance.toFixed(4) : '-';
        mdContent += `| Page ${x.page} | ${x.line} | ${x.suraAyah} | <span style="color:blue">suspicious</span> | ${expected} | ${actual} | **${deltaVal}** | ${tol} |\n`;
    });

    fs.writeFileSync(reportMdPath, mdContent, 'utf8');

    // Print summary to console
    console.log(`\n======================================`);
    console.log(`📊 Quran Ayahinfo Validation Summary:`);
    console.log(`- Pages Checked: ${pagesChecked}`);
    console.log(`- Fatal Issues: ${fatalCount}`);
    console.log(`  * Structural/Layout/Order Fatal: ${fatalNoNumbering}`);
    console.log(`  * Numbering (Warsh Range) Fatal: ${fatalNumberingOnly}`);
    console.log(`- Warning Issues: ${warningCount}`);
    console.log(`- Suspicious Issues: ${suspiciousCount}`);
    console.log(`  * Filtered Boundary Mismatches: ${markerMismatches.length}`);
    console.log(`--------------------------------------`);
    console.log(`📁 Reports Written:`);
    console.log(`- JSON: ${reportJsonPath}`);
    console.log(`- Markdown: ${reportMdPath}`);
    console.log(`======================================\n`);

    if (issues.length > 0) {
        console.log(`Top 20 Deduplicated Root Issues (Excluding Mismatches):`);
        dedupedIssues.slice(0, 20).forEach((x, i) => {
            console.log(`[${i+1}] Page ${x.page}, [${x.severity.toUpperCase()}] ${x.code} (x${x.count} occurrences): ${x.message}`);
        });
        console.log(`======================================\n`);
    }

    // Fail the test ONLY if there are fatal errors
    assert.strictEqual(fatalCount, 0, `Validation failed with ${fatalCount} fatal data errors. Check MD report for details.`);
});
