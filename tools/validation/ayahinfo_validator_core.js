const DEFAULT_LEFT_MARGIN = 0.03;
const DEFAULT_RIGHT_MARGIN = 0.97;
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

function validatePage({ pageData, layoutData, pageNumber, numberingMode = 'hafs_tolerant' }) {
    const issues = [];
    const diagnostics = [];
    const suraCounts = numberingMode === 'warsh_diagnostic' ? warsh_counts : hafs_counts;

    function logIssue(severity, line, suraAyah, code, message, details = {}, target = null) {
        const category = getCategory(code);
        let finalSeverity = severity;
        if (numberingMode === 'hafs_tolerant' && category === 'numbering') {
            if (severity === 'fatal') {
                finalSeverity = 'warning';
            }
        }
        
        const fallbackTarget = { kind: 'page', sura: null, ayah: null, line: line };
        if (suraAyah && typeof suraAyah === 'string' && suraAyah.includes(':')) {
            const parts = suraAyah.split(':');
            fallbackTarget.sura = parseInt(parts[0]) || null;
            fallbackTarget.ayah = parseInt(parts[1]) || null;
        }

        issues.push({
            page: pageNumber,
            severity: finalSeverity,
            category,
            line,
            suraAyah,
            code,
            message,
            details,
            target: target || fallbackTarget
        });
    }

    function logDiagnostic(line, suraAyah, code, message, details = {}, target = null) {
        const fallbackTarget = { kind: 'page', sura: null, ayah: null, line: line };
        if (suraAyah && typeof suraAyah === 'string' && suraAyah.includes(':')) {
            const parts = suraAyah.split(':');
            fallbackTarget.sura = parseInt(parts[0]) || null;
            fallbackTarget.ayah = parseInt(parts[1]) || null;
        }

        diagnostics.push({
            page: pageNumber,
            category: getCategory(code),
            line,
            suraAyah,
            code,
            message,
            details,
            target: target || fallbackTarget
        });
    }

    if (!pageData) {
        logIssue('fatal', null, null, 'SCHEMA_ERROR', 'Page data JSON is empty or missing', {}, { kind: 'page', sura: null, ayah: null, line: null });
        return { issues, diagnostics };
    }
    if (!layoutData) {
        logIssue('fatal', null, null, 'SCHEMA_ERROR', 'Page layout JSON is empty or missing', {}, { kind: 'page', sura: null, ayah: null, line: null });
        return { issues, diagnostics };
    }

    // Schema structure checks
    let pageHasPageMismatch = false;
    let suppressedDerivedCount = 0;
    let pageMismatchIssue = null;

    if (pageData.page !== pageNumber || layoutData.page !== pageNumber) {
        pageHasPageMismatch = true;
        const target = { kind: 'page', sura: null, ayah: null, line: null };
        logIssue('fatal', null, null, 'PAGE_FIELD_MISMATCH', 
            `Page field mismatch: data page is ${pageData.page}, layout page is ${layoutData.page}, but expected page is ${pageNumber}`,
            { dataPage: pageData.page, layoutPage: layoutData.page },
            target
        );
        pageMismatchIssue = issues[issues.length - 1];
    }

    let rawHighlights = pageData.ayah_highlights;
    if (!Array.isArray(rawHighlights)) {
        logIssue('fatal', null, null, 'SCHEMA_ERROR', 'ayah_highlights field is not an array', {}, { kind: 'page', sura: null, ayah: null, line: null });
        rawHighlights = [];
    }
    let rawMarkers = pageData.ayah_markers;
    if (!Array.isArray(rawMarkers)) {
        logIssue('fatal', null, null, 'SCHEMA_ERROR', 'ayah_markers field is not an array', {}, { kind: 'page', sura: null, ayah: null, line: null });
        rawMarkers = [];
    }
    let rawHeaders = pageData.sura_headers;
    if (rawHeaders && !Array.isArray(rawHeaders)) {
        logIssue('fatal', null, null, 'SCHEMA_ERROR', 'sura_headers field is present but not an array', {}, { kind: 'page', sura: null, ayah: null, line: null });
        rawHeaders = [];
    }

    let rawBands = layoutData.lineBands;
    if (!Array.isArray(rawBands)) {
        logIssue('fatal', null, null, 'SCHEMA_ERROR', 'lineBands in layout is not an array', {}, { kind: 'page', sura: null, ayah: null, line: null });
        rawBands = [];
    }

    const lineBandsCount = rawBands.length;

    // Verify detectedLineCount
    if (layoutData.detectedLineCount !== undefined && layoutData.detectedLineCount !== lineBandsCount) {
        logIssue('warning', null, null, 'LINE_COUNT_MISMATCH', `detectedLineCount (${layoutData.detectedLineCount}) does not match lineBands count (${lineBandsCount})`, { detected: layoutData.detectedLineCount, bands: lineBandsCount }, { kind: 'page', sura: null, ayah: null, line: null });
    }

    // 2. Layout Sanity
    rawBands.forEach((b, i) => {
        const lineNum = i + 1;
        const target = { kind: 'line', sura: null, ayah: null, line: lineNum };
        if (b.line !== lineNum) {
            logIssue('fatal', lineNum, null, 'LAYOUT_LINE_MISMATCH', `Line index in layout ${b.line} does not match expected sequence ${lineNum}`, { line: b.line }, target);
        }
        if (!Number.isFinite(b.top) || !Number.isFinite(b.center) || !Number.isFinite(b.bottom)) {
            logIssue('fatal', lineNum, null, 'LAYOUT_NON_FINITE', 'Line band coordinates are not finite numbers', { top: b.top, center: b.center, bottom: b.bottom }, target);
        } else {
            if (b.center <= b.top || b.center >= b.bottom) {
                const errorAmount = b.center <= b.top ? b.top - b.center : b.center - b.bottom;
                if (errorAmount > 5) {
                    logIssue('fatal', lineNum, null, 'LAYOUT_ORDER_INVALID', `Line vertical bounds invalid: center (${b.center}) is outside top-bottom (${b.top}-${b.bottom}) by ${errorAmount}px`, { top: b.top, center: b.center, bottom: b.bottom, errorAmount }, target);
                } else {
                    logIssue('warning', lineNum, null, 'LAYOUT_ORDER_INVALID', `Line vertical bounds slightly off: center (${b.center}) is outside top-bottom (${b.top}-${b.bottom}) by ${errorAmount}px`, { top: b.top, center: b.center, bottom: b.bottom, errorAmount }, target);
                }
            }
        }

        // Check vertical overlap (with tolerances to avoid false-positives on rounding)
        if (i > 0) {
            const prevB = rawBands[i - 1];
            const overlap = prevB.bottom - b.top;
            if (overlap > 12) {
                logIssue('fatal', lineNum, null, 'LAYOUT_VERTICAL_OVERLAP', `Large vertical overlap with previous line band by ${overlap}px`, { prevBottom: prevB.bottom, currTop: b.top, overlap }, target);
            } else if (overlap > 2) {
                logIssue('suspicious', lineNum, null, 'LAYOUT_VERTICAL_OVERLAP', `Minor vertical overlap with previous line band by ${overlap}px`, { prevBottom: prevB.bottom, currTop: b.top, overlap }, target);
            }
        }
    });

    // 3. Schema & Ranges on highlights, markers and headers
    const validHighlights = [];
    const validMarkers = [];

    // Sura Headers Check
    if (Array.isArray(rawHeaders)) {
        rawHeaders.forEach((sh, idx) => {
            let isValidHeader = true;
            const target = { kind: 'page', sura: sh.sura, ayah: null, line: null };

            if (sh.page !== pageNumber) {
                isValidHeader = false;
                if (pageHasPageMismatch) {
                    suppressedDerivedCount++;
                } else {
                    logIssue('fatal', null, `Sura ${sh.sura}`, 'HEADER_PAGE_MISMATCH', `Header page (${sh.page}) does not match actual page (${pageNumber})`, { header: sh }, target);
                }
            }
            if (!Number.isInteger(sh.sura) || sh.sura < 1 || sh.sura > 114) {
                isValidHeader = false;
                logIssue('fatal', null, `Sura ${sh.sura}`, 'HEADER_SURA_OUT_OF_RANGE', `Header sura number (${sh.sura}) is out of range 1..114`, { header: sh }, target);
            }
            if (!Number.isFinite(sh.center_x) || sh.center_x < 0 || sh.center_x > 1 ||
                !Number.isFinite(sh.center_y) || sh.center_y < 0 || sh.center_y > 1) {
                isValidHeader = false;
                logIssue('fatal', null, `Sura ${sh.sura}`, 'HEADER_COORDS_OUT_OF_RANGE', 'Header coordinates are not finite or outside 0..1 range', { header: sh }, target);
            }
        });
    }

    // Validate Highlights and build validHighlights
    rawHighlights.forEach((h, idx) => {
        const ayahKey = `${h.sura}:${h.ayah}`;
        let isValid = true;
        const target = { kind: 'highlight', sura: h.sura, ayah: h.ayah, line: h.line, highlightIndex: idx };

        if (h.page !== pageNumber) {
            isValid = false;
            if (pageHasPageMismatch) {
                suppressedDerivedCount++;
            } else {
                logIssue('fatal', h.line, ayahKey, 'HIGHLIGHT_PAGE_MISMATCH', `Highlight page (${h.page}) does not match actual page (${pageNumber})`, { highlight: h }, target);
            }
        }
        if (!Number.isInteger(h.line) || h.line < 1 || h.line > lineBandsCount) {
            isValid = false;
            logIssue('fatal', h.line, ayahKey, 'HIGHLIGHT_LINE_OUT_OF_RANGE', `Highlight line (${h.line}) is outside layout bands (1..${lineBandsCount})`, { highlight: h }, target);
        }
        if (!Number.isInteger(h.sura) || h.sura < 1 || h.sura > 114) {
            isValid = false;
            logIssue('fatal', h.line, ayahKey, 'HIGHLIGHT_SURA_OUT_OF_RANGE', `Highlight sura number (${h.sura}) is out of range 1..114`, { highlight: h }, target);
        } else {
            const maxAyah = suraCounts[h.sura - 1];
            if (!Number.isInteger(h.ayah) || h.ayah < 1 || h.ayah > maxAyah) {
                isValid = false;
                logIssue('fatal', h.line, ayahKey, 'HIGHLIGHT_AYAH_OUT_OF_RANGE', `Highlight ayah (${h.ayah}) is out of range for sura (max ${maxAyah})`, { highlight: h }, target);
            }
        }
        if (!Number.isFinite(h.left) || h.left < 0 || h.left > 1 ||
            !Number.isFinite(h.right) || h.right < 0 || h.right > 1) {
            isValid = false;
            logIssue('fatal', h.line, ayahKey, 'HIGHLIGHT_COORDS_OUT_OF_RANGE', 'Highlight boundaries are not finite or outside 0..1 range', { highlight: h }, target);
        } else {
            // Warning if highlight borders are too far from typical margins (0.03 .. 0.97)
            if (h.left < 0.02 || h.left > 0.98) {
                logIssue('warning', h.line, ayahKey, 'HIGHLIGHT_MARGIN_DEVIATION', `Highlight left boundary (${h.left.toFixed(3)}) deviates from typical margin 0.03`, { left: h.left, right: h.right }, target);
            }
            if (h.right < 0.02 || h.right > 0.98) {
                logIssue('warning', h.line, ayahKey, 'HIGHLIGHT_MARGIN_DEVIATION', `Highlight right boundary (${h.right.toFixed(3)}) deviates from typical margin 0.97`, { left: h.left, right: h.right }, target);
            }
        }

        if (isValid) {
            // Keep reference to its original index in pageData.ayah_highlights
            validHighlights.push({ ...h, originalIndex: idx });
        }
    });

    // Validate Markers and build validMarkers
    rawMarkers.forEach((m, idx) => {
        const ayahKey = `${m.sura}:${m.ayah}`;
        let isValid = true;
        const target = { kind: 'marker', sura: m.sura, ayah: m.ayah, line: m.line, markerIndex: idx };

        if (m.page !== pageNumber) {
            isValid = false;
            if (pageHasPageMismatch) {
                suppressedDerivedCount++;
            } else {
                logIssue('fatal', m.line, ayahKey, 'MARKER_PAGE_MISMATCH', `Marker page (${m.page}) does not match actual page (${pageNumber})`, { marker: m }, target);
            }
        }
        if (!Number.isInteger(m.line) || m.line < 1 || m.line > lineBandsCount) {
            isValid = false;
            logIssue('fatal', m.line, ayahKey, 'MARKER_LINE_OUT_OF_RANGE', `Marker line (${m.line}) is outside layout bands (1..${lineBandsCount})`, { marker: m }, target);
        }
        if (!Number.isInteger(m.sura) || m.sura < 1 || m.sura > 114) {
            isValid = false;
            logIssue('fatal', m.line, ayahKey, 'MARKER_SURA_OUT_OF_RANGE', `Marker sura number (${m.sura}) is out of range 1..114`, { marker: m }, target);
        } else {
            const maxAyah = suraCounts[m.sura - 1];
            if (!Number.isInteger(m.ayah) || m.ayah < 1 || m.ayah > maxAyah) {
                isValid = false;
                logIssue('fatal', m.line, ayahKey, 'MARKER_AYAH_OUT_OF_RANGE', `Marker ayah (${m.ayah}) is out of range for sura (max ${maxAyah})`, { marker: m }, target);
            }
        }
        if (!Number.isFinite(m.center_x) || m.center_x < 0 || m.center_x > 1 ||
            !Number.isFinite(m.center_y) || m.center_y < 0 || m.center_y > 1) {
            isValid = false;
            logIssue('fatal', m.line, ayahKey, 'MARKER_COORDS_OUT_OF_RANGE', 'Marker coordinates are not finite or outside 0..1 range', { marker: m }, target);
        } else {
            // Warning if center_y is outside 0.02..0.98
            if (m.center_y < 0.02 || m.center_y > 0.98) {
                logIssue('warning', m.line, ayahKey, 'MARKER_Y_OUT_OF_MARGINS', `Marker center_y (${m.center_y.toFixed(3)}) is outside safe margins 0.02..0.98`, { center_x: m.center_x, center_y: m.center_y }, target);
            }
        }

        if (isValid) {
            // Keep reference to its original index in pageData.ayah_markers
            validMarkers.push({ ...m, originalIndex: idx });
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
    rawHighlights.forEach((h, idx) => {
        const key = `${h.line}-${h.sura}-${h.ayah}-${h.left}-${h.right}`;
        const target = { kind: 'highlight', sura: h.sura, ayah: h.ayah, line: h.line, highlightIndex: idx };
        if (seenHls.has(key)) {
            logIssue('fatal', h.line, `${h.sura}:${h.ayah}`, 'DUPLICATE_HIGHLIGHT', 'Exact duplicate highlight segment detected', { highlight: h }, target);
        } else {
            seenHls.add(key);
        }
    });

    // Exact duplicate markers
    const seenMks = new Set();
    rawMarkers.forEach((m, idx) => {
        const key = `${m.line}-${m.sura}-${m.ayah}-${m.center_x}-${m.center_y}`;
        const target = { kind: 'marker', sura: m.sura, ayah: m.ayah, line: m.line, markerIndex: idx };
        if (seenMks.has(key)) {
            logIssue('fatal', m.line, `${m.sura}:${m.ayah}`, 'DUPLICATE_MARKER', 'Exact duplicate marker circle detected', { marker: m }, target);
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
        const target = { kind: 'highlight', sura: h.sura, ayah: h.ayah, line: h.line, highlightIndex: h.originalIndex };
        if (currKey !== prevKey) {
            if (seenAyahTransitions.has(currKey)) {
                logIssue('fatal', h.line, currKey, 'HIGHLIGHT_ORDER_OSCILLATION', 'Ayah reappeared in reading order after transitioning to other ayahs', { current: currKey, previous: prevKey }, target);
            }
            seenAyahTransitions.add(currKey);

            if (prevSura !== null) {
                if (h.sura === prevSura) {
                    if (h.ayah < prevAyah) {
                        logIssue('fatal', h.line, currKey, 'HIGHLIGHT_ORDER_REGRESSION', `Ayah regression inside sura: from ${prevSura}:${prevAyah} back to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey }, target);
                    } else if (h.ayah > prevAyah + 1) {
                        logIssue('suspicious', h.line, currKey, 'HIGHLIGHT_ORDER_JUMP', `Ayah forward jump: from ${prevSura}:${prevAyah} to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey }, target);
                    }
                } else if (h.sura === prevSura + 1) {
                    if (h.ayah !== 1) {
                        logIssue('suspicious', h.line, currKey, 'HIGHLIGHT_ORDER_JUMP', `Sura transition started with ayah ${h.ayah} instead of 1 (from ${prevSura}:${prevAyah} to ${h.sura}:${h.ayah})`, { prev: `${prevSura}:${prevAyah}`, curr: currKey }, target);
                    }
                } else if (h.sura > prevSura + 1) {
                    logIssue('suspicious', h.line, currKey, 'HIGHLIGHT_ORDER_JUMP', `Sura forward jump: from ${prevSura}:${prevAyah} to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey }, target);
                } else if (h.sura < prevSura) {
                    logIssue('fatal', h.line, currKey, 'HIGHLIGHT_ORDER_REGRESSION', `Sura regression: from ${prevSura}:${prevAyah} back to ${h.sura}:${h.ayah}`, { prev: `${prevSura}:${prevAyah}`, curr: currKey }, target);
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
                const target = {
                    kind: 'line',
                    sura: previous.sura,
                    ayah: previous.ayah,
                    line: lineNum,
                    prevHighlightIndex: previous.originalIndex,
                    nextHighlightIndex: next.originalIndex
                };

                if (boundaryDelta > GEOM_GAP_TOLERANCE) {
                    // Gap: previous ends before next starts (large visual gap)
                    logIssue('suspicious', lineNum, `${prevKey} -> ${nextKey}`, 'SAME_LINE_GAP', `Horizontal gap on same line by ${boundaryDelta.toFixed(4)}`, { prev: previous, next, boundaryDelta, tolerance: GEOM_GAP_TOLERANCE }, target);
                } else if (boundaryDelta < -GEOM_OVERLAP_TOLERANCE) {
                    // Overlap: previous extends leftwards past next's start (visual overlap)
                    logIssue('suspicious', lineNum, `${prevKey} -> ${nextKey}`, 'SAME_LINE_OVERLAP', `Horizontal overlap on same line by ${(-boundaryDelta).toFixed(4)}`, { prev: previous, next, boundaryDelta, tolerance: GEOM_OVERLAP_TOLERANCE }, target);
                }
            }
        }
    }

    // 7. Marker Binding and Alignment (on valid markers & highlights)
    validMarkers.forEach(m => {
        const mKey = `${m.sura}:${m.ayah}`;
        const pageHls = validHighlights.filter(h => h.sura === m.sura && h.ayah === m.ayah);
        const target = { kind: 'marker', sura: m.sura, ayah: m.ayah, line: m.line, markerIndex: m.originalIndex };

        // absolute Y calculations and checks
        const band = rawBands.find(b => b.line === m.line);
        if (band) {
            const absoluteY = band.top + m.center_y * (band.bottom - band.top);
            // Warning if the marker is very close to line boundaries (< 0.1 or > 0.9)
            if (m.center_y < 0.1 || m.center_y > 0.9) {
                logIssue('warning', m.line, mKey, 'MARKER_Y_CLOSE_TO_EDGE', 
                    `Marker Y center (${m.center_y.toFixed(3)}) is very close to line bounds. Absolute Y = ${absoluteY.toFixed(1)}px (band: ${band.top} - ${band.bottom}). Note: Flutter might use band center.`, 
                    { marker: m, band, absoluteY }, target);
            }
        }

        if (pageHls.length === 0) {
            logIssue('fatal', m.line, mKey, 'MARKER_NO_HIGHLIGHT', `Marker exists for ${mKey} but no highlight found on page`, { marker: m }, target);
        } else {
            const lineHls = pageHls.filter(h => h.line === m.line);
            if (lineHls.length === 0) {
                logIssue('suspicious', m.line, mKey, 'MARKER_NOT_ON_HIGHLIGHT_LINE', `Marker exists on line ${m.line} for ${mKey} but highlight is on different line(s)`, { marker: m, pageHighlightsLines: pageHls.map(h => h.line) }, target);
            } else {
                // Diagnostic only: marker center_x is not a reliable boundary contract.
                // Some valid full-line/end-of-line highlights intentionally extend to the page margin.
                const closestHl = lineHls.sort((a, b) => Math.abs(a.left - m.center_x) - Math.abs(b.left - m.center_x))[0];
                const delta = Math.abs(closestHl.left - m.center_x);
                if (delta > MARKER_MATCH_TOLERANCE) {
                    const diagnosticTarget = {
                        kind: 'marker',
                        sura: m.sura,
                        ayah: m.ayah,
                        line: m.line,
                        markerIndex: m.originalIndex,
                        highlightIndex: closestHl.originalIndex
                    };
                    logDiagnostic(m.line, mKey, 'MARKER_BOUNDARY_MISMATCH',
                        `Marker center (${m.center_x.toFixed(4)}) differs from highlight left (${closestHl.left.toFixed(4)}) by ${delta.toFixed(4)}. This is diagnostic only; do not auto-fix JSON from it.`,
                        { expectedBoundary: closestHl.left, actualBoundary: m.center_x, delta, tolerance: MARKER_MATCH_TOLERANCE, marker: m, highlight: closestHl },
                        diagnosticTarget
                    );
                }
            }

            let nextSura = m.sura;
            let nextAyah = m.ayah + 1;
            if (nextAyah > suraCounts[m.sura - 1]) {
                nextSura = m.sura + 1;
                nextAyah = 1;
            }

            if (nextSura <= 114) {
                const nextCandidates = validHighlights.filter(h => h.sura === nextSura && h.ayah === nextAyah && h.line === m.line);
                if (nextCandidates.length > 0) {
                    const closestNext = nextCandidates.sort((a, b) => Math.abs(a.right - m.center_x) - Math.abs(b.right - m.center_x))[0];
                    const deltaNext = Math.abs(closestNext.right - m.center_x);
                    if (deltaNext > MARKER_MATCH_TOLERANCE) {
                        const diagnosticTarget = {
                            kind: 'marker',
                            sura: nextSura,
                            ayah: nextAyah,
                            line: m.line,
                            markerIndex: m.originalIndex,
                            highlightIndex: closestNext.originalIndex
                        };
                        logDiagnostic(m.line, `${nextSura}:${nextAyah}`, 'MARKER_BOUNDARY_MISMATCH',
                            `Marker center (${m.center_x.toFixed(4)}) differs from next ayah right (${closestNext.right.toFixed(4)}) by ${deltaNext.toFixed(4)}. This is diagnostic only; do not auto-fix JSON from it.`,
                            { expectedBoundary: closestNext.right, actualBoundary: m.center_x, delta: deltaNext, tolerance: MARKER_MATCH_TOLERANCE, marker: m, highlight: closestNext },
                            diagnosticTarget
                        );
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
        const target = { kind: 'marker', sura: m.sura, ayah: m.ayah, line: m.line, markerIndex: m.originalIndex };

        if (count > 1) {
            logIssue('warning', m.line, mKey, 'DUPLICATE_MARKER_AYAH', `Multiple markers (${count} times) found on page for same ayah ${mKey}`, { marker: m }, target);
        }

        if (prevMkrSura !== null) {
            if (m.sura === prevMkrSura) {
                if (m.ayah < prevMkrAyah) {
                    logIssue('fatal', m.line, mKey, 'MARKER_ORDER_REGRESSION', `Marker order regression: from ${prevMkrSura}:${prevMkrAyah} back to ${m.sura}:${m.ayah}`, { prev: `${prevMkrSura}:${prevMkrAyah}`, curr: mKey }, target);
                }
            } else if (m.sura < prevMkrSura) {
                logIssue('fatal', m.line, mKey, 'MARKER_ORDER_REGRESSION', `Marker sura regression: from ${prevMkrSura}:${prevMkrAyah} back to ${m.sura}:${m.ayah}`, { prev: `${prevMkrSura}:${prevMkrAyah}`, curr: mKey }, target);
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
                    const target = { kind: 'highlight', sura: lastHl.sura, ayah: lastHl.ayah, line: lastHl.line, highlightIndex: lastHl.originalIndex };
                    logIssue('warning', lastHl.line, ayahKey, 'ORPHAN_HIGHLIGHT_NO_MARKER', `Highlight ends before left margin (${lastHl.left.toFixed(3)}) but no marker circle found on page`, { lastHighlight: lastHl }, target);
                }
            }
        }
    });

    return { issues, diagnostics };
}

module.exports = {
    validatePage,
    warsh_counts,
    hafs_counts,
    compareHighlightsReadingOrder,
    compareMarkersReadingOrder,
    getCategory,
    DEFAULT_LEFT_MARGIN,
    DEFAULT_RIGHT_MARGIN,
    GEOM_OVERLAP_TOLERANCE,
    GEOM_GAP_TOLERANCE,
    MARKER_MATCH_TOLERANCE
};
