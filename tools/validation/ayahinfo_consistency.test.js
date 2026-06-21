const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { validatePage, getCategory } = require('./ayahinfo_validator_core');

// Configurations
// 'hafs_tolerant' (default app-facing mode) or 'warsh_diagnostic' (pure Warsh numbering test)
const NUMBERING_MODE = process.env.NUMBERING_MODE || 'hafs_tolerant';

// Setup directories
const baseDir = path.resolve(__dirname, '../../databases/ayahinfo/warsh_muthamman');
const pagesJsonDir = path.join(baseDir, 'pages_json');
const layoutJsonDir = path.join(baseDir, 'page_layout_json');
const reportDir = __dirname; // warsh-muthamman-assets/tools/validation/

test('Warsh Muthamman Ayahinfo Consistency Validation', () => {
    const issues = [];
    const diagnostics = [];
    let pagesChecked = 0;

    for (let pageVal = 1; pageVal <= 485; pageVal++) {
        const pageStr = String(pageVal).padStart(3, '0');
        const pageFile = `page_${pageStr}.json`;
        const pageJsonPath = path.join(pagesJsonDir, pageFile);
        const layoutJsonPath = path.join(layoutJsonDir, pageFile);

        // 1. File existence checks
        if (!fs.existsSync(pageJsonPath)) {
            issues.push({
                page: pageVal,
                severity: 'fatal',
                category: 'structural',
                line: null,
                suraAyah: null,
                code: 'FILE_MISSING',
                message: `Page file ${pageFile} not found in pages_json`,
                details: { path: pageJsonPath },
                target: { kind: 'page', sura: null, ayah: null, line: null }
            });
            continue;
        }
        if (!fs.existsSync(layoutJsonPath)) {
            issues.push({
                page: pageVal,
                severity: 'fatal',
                category: 'structural',
                line: null,
                suraAyah: null,
                code: 'FILE_MISSING',
                message: `Page layout file ${pageFile} not found in page_layout_json`,
                details: { path: layoutJsonPath },
                target: { kind: 'page', sura: null, ayah: null, line: null }
            });
            continue;
        }

        pagesChecked++;

        // Read and parse
        let pageData, layoutData;
        try {
            pageData = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
        } catch (e) {
            issues.push({
                page: pageVal,
                severity: 'fatal',
                category: 'structural',
                line: null,
                suraAyah: null,
                code: 'JSON_PARSE_ERROR',
                message: `Failed to parse data JSON: ${e.message}`,
                details: { path: pageJsonPath },
                target: { kind: 'page', sura: null, ayah: null, line: null }
            });
            continue;
        }

        try {
            layoutData = JSON.parse(fs.readFileSync(layoutJsonPath, 'utf8'));
        } catch (e) {
            issues.push({
                page: pageVal,
                severity: 'fatal',
                category: 'structural',
                line: null,
                suraAyah: null,
                code: 'JSON_PARSE_ERROR',
                message: `Failed to parse layout JSON: ${e.message}`,
                details: { path: layoutJsonPath },
                target: { kind: 'page', sura: null, ayah: null, line: null }
            });
            continue;
        }

        // Call the core validation logic
        const result = validatePage({
            pageData,
            layoutData,
            pageNumber: pageVal,
            numberingMode: NUMBERING_MODE
        });

        issues.push(...result.issues);
        diagnostics.push(...result.diagnostics);
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

    const markerMismatches = diagnostics.filter(x => x.code === 'MARKER_BOUNDARY_MISMATCH');
    const nonMismatchIssues = issues;

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
            topPages,
            diagnostics: {
                markerBoundaryMismatch: markerMismatches.length
            }
        },
        issues,
        diagnostics
    };

    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(reportJsonPath, JSON.stringify(jsonReport, null, 2), 'utf8');

    // Markdown report
    let mdContent = `# Quran Ayahinfo Validation Report (Warsh Muthamman)\n\n`;
    mdContent += `**Date:** ${new Date().toISOString()}  \n`;
    mdContent += `**Pages Checked:** ${pagesChecked} / 485  \n`;
    mdContent += `**Note:** This validation is powered by \`ayahinfo_validator_core.js\`.\n`;
    mdContent += `**Numbering Mode:** \`${NUMBERING_MODE}\`  \n`;
    mdContent += `**Marker Boundary Diagnostics:** ${markerMismatches.length} (not counted as issues)  \n`;
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

    mdContent += `### Marker Boundary Diagnostics (Top 50, Not Counted as Issues)\n`;
    mdContent += `These rows compare marker centers against nearby highlight boundaries for visual review only. They are not safe inputs for automatic JSON edits because valid highlights may intentionally extend to line margins.\n\n`;
    mdContent += `| Page | Line | Ayah | Type | Reference Boundary | Marker X | Delta | Tolerance |\n`;
    mdContent += `|---|---|---|---|---|---|---|---|\n`;
    markerBoundaryDiagnostics.forEach(x => {
        const expected = x.details.expectedBoundary !== undefined ? x.details.expectedBoundary.toFixed(4) : '-';
        const actual = x.details.actualBoundary !== undefined ? x.details.actualBoundary.toFixed(4) : '-';
        const deltaVal = x.details.delta !== undefined ? x.details.delta.toFixed(4) : '-';
        const tol = x.details.tolerance !== undefined ? x.details.tolerance.toFixed(4) : '-';
        mdContent += `| Page ${x.page} | ${x.line} | ${x.suraAyah} | Diagnostic | ${expected} | ${actual} | **${deltaVal}** | ${tol} |\n`;
    });

    fs.writeFileSync(reportMdPath, mdContent, 'utf8');

    // Print summary to console
    console.log(`\n======================================`);
    console.log(`📊 Quran Ayahinfo Validation Summary (Refactored):`);
    console.log(`- Pages Checked: ${pagesChecked}`);
    console.log(`- Fatal Issues: ${fatalCount}`);
    console.log(`  * Structural/Layout/Order Fatal: ${fatalNoNumbering}`);
    console.log(`  * Numbering (Warsh Range) Fatal: ${fatalNumberingOnly}`);
    console.log(`- Warning Issues: ${warningCount}`);
    console.log(`- Suspicious Issues: ${suspiciousCount}`);
    console.log(`- Marker Boundary Diagnostics (not issues): ${markerMismatches.length}`);
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
