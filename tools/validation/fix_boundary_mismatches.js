const fs = require('fs');
const path = require('path');

// Hafs (Kufi) ayah counts per surah
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

const baseDir = path.resolve(__dirname, '../../databases/ayahinfo/warsh_muthamman');
const pagesJsonDir = path.join(baseDir, 'pages_json');
const MARKER_MATCH_TOLERANCE = 0.025;

function main() {
    console.log('Starting marker boundary mismatch auto-fixer...');
    let totalAdjustments = 0;

    for (let pageVal = 1; pageVal <= 485; pageVal++) {
        const pageStr = String(pageVal).padStart(3, '0');
        const pageFile = `page_${pageStr}.json`;
        const pageJsonPath = path.join(pagesJsonDir, pageFile);

        if (!fs.existsSync(pageJsonPath)) {
            continue;
        }

        let pageData;
        try {
            pageData = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
        } catch (e) {
            console.error(`Failed to parse page ${pageVal}: ${e.message}`);
            continue;
        }

        let modified = false;

        if (Array.isArray(pageData.ayah_markers) && Array.isArray(pageData.ayah_highlights)) {
            pageData.ayah_markers.forEach(m => {
                const lineHls = pageData.ayah_highlights.filter(h => h.sura === m.sura && h.ayah === m.ayah && h.line === m.line);
                if (lineHls.length > 0) {
                    const closestHl = lineHls.sort((a, b) => Math.abs(a.left - m.center_x) - Math.abs(b.left - m.center_x))[0];
                    const isFullLine = (closestHl.left <= 0.04 && closestHl.right >= 0.96);
                    let shouldCheckCurrent = true;
                    if (isFullLine && m.center_x <= 0.09) {
                        shouldCheckCurrent = false;
                    }

                    if (shouldCheckCurrent) {
                        const delta = Math.abs(closestHl.left - m.center_x);
                        if (delta > MARKER_MATCH_TOLERANCE) {
                            closestHl.left = m.center_x;
                            modified = true;
                            totalAdjustments++;
                        }
                    }
                }

                if (m.center_x > 0.09) {
                    let nextSura = m.sura;
                    let nextAyah = m.ayah + 1;
                    const maxAyah = hafs_counts[m.sura - 1];
                    if (nextAyah > maxAyah) {
                        nextSura = m.sura + 1;
                        nextAyah = 1;
                    }

                    if (nextSura <= 114) {
                        const nextCandidates = pageData.ayah_highlights.filter(h => h.sura === nextSura && h.ayah === nextAyah && h.line === m.line);
                        if (nextCandidates.length > 0) {
                            const closestNext = nextCandidates.sort((a, b) => Math.abs(a.right - m.center_x) - Math.abs(b.right - m.center_x))[0];
                            const deltaNext = Math.abs(closestNext.right - m.center_x);
                            if (deltaNext > MARKER_MATCH_TOLERANCE) {
                                closestNext.right = m.center_x;
                                modified = true;
                                totalAdjustments++;
                            }
                        }
                    }
                }
            });
        }

        if (modified) {
            fs.writeFileSync(pageJsonPath, JSON.stringify(pageData, null, 2), 'utf8');
        }
    }

    console.log(`Auto-fix complete! Total boundary coordinates adjusted: ${totalAdjustments}`);
}

main();
