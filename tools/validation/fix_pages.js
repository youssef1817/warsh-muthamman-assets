const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../../databases/ayahinfo/warsh_muthamman');
const pagesJsonDir = path.join(baseDir, 'pages_json');
const layoutJsonDir = path.join(baseDir, 'page_layout_json');

// Helper to fix layout file page number
function fixLayoutPage(pageVal) {
    const pageStr = String(pageVal).padStart(3, '0');
    const layoutPath = path.join(layoutJsonDir, `page_${pageStr}.json`);
    if (fs.existsSync(layoutPath)) {
        const layout = JSON.parse(fs.readFileSync(layoutPath, 'utf8'));
        if (layout.page !== pageVal) {
            console.log(`Fixing layout page number for page ${pageVal}: ${layout.page} -> ${pageVal}`);
            layout.page = pageVal;
            fs.writeFileSync(layoutPath, JSON.stringify(layout, null, 2), 'utf8');
        }
    }
}

// Fix page_438.json
function fixPage438() {
    const filePath = path.join(pagesJsonDir, 'page_438.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let modified = false;
    if (data.page !== 438) {
        data.page = 438;
        modified = true;
    }
    data.ayah_markers.forEach(m => {
        if (m.page !== 438) {
            m.page = 438;
            modified = true;
        }
    });
    data.sura_headers.forEach(sh => {
        if (sh.page !== 438) {
            sh.page = 438;
            modified = true;
        }
    });
    
    if (modified) {
        console.log("Fixing page_438.json...");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(438);
}

// Fix page_299.json
function fixPage299() {
    const filePath = path.join(pagesJsonDir, 'page_299.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let modified = false;
    if (data.page !== 299) {
        data.page = 299;
        modified = true;
    }
    data.ayah_markers.forEach(m => {
        if (m.page !== 299) {
            m.page = 299;
            modified = true;
        }
    });
    
    if (modified) {
        console.log("Fixing page_299.json...");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(299);
}

// Fix page_291.json
function fixPage291() {
    const filePath = path.join(pagesJsonDir, 'page_291.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let modified = false;
    if (data.page !== 291) {
        data.page = 291;
        modified = true;
    }
    data.ayah_markers.forEach(m => {
        if (m.page !== 291) {
            m.page = 291;
            modified = true;
        }
    });
    
    if (modified) {
        console.log("Fixing page_291.json...");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(291);
}

// Fix page_289.json
function fixPage289() {
    const filePath = path.join(pagesJsonDir, 'page_289.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove highlights with sura = 23 (Al-Mu'minun template garbage at the end)
    const initialHlCount = data.ayah_highlights.length;
    data.ayah_highlights = data.ayah_highlights.filter(h => h.sura !== 23);
    const finalHlCount = data.ayah_highlights.length;
    
    // Remove markers with sura = 23
    const initialMkCount = data.ayah_markers.length;
    data.ayah_markers = data.ayah_markers.filter(m => m.sura !== 23);
    const finalMkCount = data.ayah_markers.length;
    
    let modified = (initialHlCount !== finalHlCount) || (initialMkCount !== finalMkCount);
    
    if (data.page !== 289) {
        data.page = 289;
        modified = true;
    }
    
    data.ayah_markers.forEach(m => {
        if (m.page !== 289) {
            m.page = 289;
            modified = true;
        }
    });
    
    if (modified) {
        console.log(`Fixing page_289.json (Removed ${initialHlCount - finalHlCount} template highlights, ${initialMkCount - finalMkCount} template markers)...`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(289);
}

// Fix page_287.json
function fixPage287() {
    const filePath = path.join(pagesJsonDir, 'page_287.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove highlights of 113, 114
    const initialHlCount = data.ayah_highlights.length;
    data.ayah_highlights = data.ayah_highlights.filter(h => h.ayah !== 113 && h.ayah !== 114);
    const finalHlCount = data.ayah_highlights.length;
    
    // Remove markers of 113, 114
    const initialMkCount = data.ayah_markers.length;
    data.ayah_markers = data.ayah_markers.filter(m => m.ayah !== 113 && m.ayah !== 114);
    const finalMkCount = data.ayah_markers.length;
    
    let modified = (initialHlCount !== finalHlCount) || (initialMkCount !== finalMkCount);
    
    if (data.page !== 287) {
        data.page = 287;
        modified = true;
    }
    
    // Change sura from 23 to 24 for the remaining highlights/markers
    data.ayah_highlights.forEach(h => {
        if (h.sura === 23) {
            h.sura = 24;
            modified = true;
        }
    });
    
    data.ayah_markers.forEach(m => {
        if (m.sura === 23) {
            m.sura = 24;
            modified = true;
        }
        if (m.page !== 287) {
            m.page = 287;
            modified = true;
        }
    });
    
    if (modified) {
        console.log(`Fixing page_287.json (sura 23->24, Removed ${initialHlCount - finalHlCount} highlights, ${initialMkCount - finalMkCount} markers)...`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(287);
}

// Fix page_285.json
function fixPage285() {
    const filePath = path.join(pagesJsonDir, 'page_285.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove highlights of 112, 113, 114
    const initialHlCount = data.ayah_highlights.length;
    data.ayah_highlights = data.ayah_highlights.filter(h => h.ayah !== 112 && h.ayah !== 113 && h.ayah !== 114);
    const finalHlCount = data.ayah_highlights.length;
    
    // Remove markers of 112, 113, 114
    const initialMkCount = data.ayah_markers.length;
    data.ayah_markers = data.ayah_markers.filter(m => m.ayah !== 112 && m.ayah !== 113 && m.ayah !== 114);
    const finalMkCount = data.ayah_markers.length;
    
    let modified = (initialHlCount !== finalHlCount) || (initialMkCount !== finalMkCount);
    
    if (data.page !== 285) {
        data.page = 285;
        modified = true;
    }
    
    // Change sura from 23 to 24 for the remaining highlights/markers
    data.ayah_highlights.forEach(h => {
        if (h.sura === 23) {
            h.sura = 24;
            modified = true;
        }
    });
    
    data.ayah_markers.forEach(m => {
        if (m.sura === 23) {
            m.sura = 24;
            modified = true;
        }
        if (m.page !== 285) {
            m.page = 285;
            modified = true;
        }
    });
    
    if (modified) {
        console.log(`Fixing page_285.json (sura 23->24, Removed ${initialHlCount - finalHlCount} highlights, ${initialMkCount - finalMkCount} markers)...`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(285);
}

// Fix page_282.json
function fixPage282() {
    const filePath = path.join(pagesJsonDir, 'page_282.json');
    if (!fs.existsSync(filePath)) return;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove highlights of 112, 113, 114
    const initialHlCount = data.ayah_highlights.length;
    data.ayah_highlights = data.ayah_highlights.filter(h => h.ayah !== 112 && h.ayah !== 113 && h.ayah !== 114);
    const finalHlCount = data.ayah_highlights.length;
    
    // Remove markers of 112, 113, 114
    const initialMkCount = data.ayah_markers.length;
    data.ayah_markers = data.ayah_markers.filter(m => m.ayah !== 112 && m.ayah !== 113 && m.ayah !== 114);
    const finalMkCount = data.ayah_markers.length;
    
    let modified = (initialHlCount !== finalHlCount) || (initialMkCount !== finalMkCount);
    
    if (data.page !== 282) {
        data.page = 282;
        modified = true;
    }
    
    // Change sura from 23 to 24 for the remaining highlights/markers
    data.ayah_highlights.forEach(h => {
        if (h.sura === 23) {
            h.sura = 24;
            modified = true;
        }
    });
    
    data.ayah_markers.forEach(m => {
        if (m.sura === 23) {
            m.sura = 24;
            modified = true;
        }
        if (m.page !== 282) {
            m.page = 282;
            modified = true;
        }
    });
    
    if (modified) {
        console.log(`Fixing page_282.json (sura 23->24, Removed ${initialHlCount - finalHlCount} highlights, ${initialMkCount - finalMkCount} markers)...`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    fixLayoutPage(282);
}

// Run all fixes
fixPage282();
fixPage285();
fixPage287();
fixPage289();
fixPage291();
fixPage299();
fixPage438();
console.log("All page fixes completed successfully!");
