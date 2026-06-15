const sharp = require('./node_modules/sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const INPUT_DIR = path.resolve(__dirname, '../pages/warsh_muthamma_png');
const OUTPUT_DIR = path.resolve(__dirname, '../pages/warsh_muthamma_png_q70');
const INDEX_PATH = path.resolve(__dirname, '../pages/warsh_muthamma_png_q70_index.json');
const QUALITY = 70;
const CONCURRENCY = 8; 

function sha256File(filePath) {
    const hash = crypto.createHash('sha256');
    const data = fs.readFileSync(filePath);
    hash.update(data);
    return hash.digest('hex').toUpperCase();
}

async function run() {
    if (!fs.existsSync(INPUT_DIR)) {
        console.error("Input directory not found:", INPUT_DIR);
        process.exit(1);
    }
    
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    
    const files = fs.readdirSync(INPUT_DIR)
        .filter(f => f.startsWith('page') && f.endsWith('.png'))
        .sort();
        
    console.log(`Input: ${INPUT_DIR}`);
    console.log(`Output: ${OUTPUT_DIR}`);
    console.log(`Files count: ${files.length}`);
    console.log(`Quality: ${QUALITY}`);
    
    const pages = [];
    let processedCount = 0;
    let totalOriginalBytes = 0;
    let totalOutputBytes = 0;
    
    for (let i = 0; i < files.length; i += CONCURRENCY) {
        const batch = files.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async (fileName) => {
            const srcPath = path.join(INPUT_DIR, fileName);
            const dstPath = path.join(OUTPUT_DIR, fileName);
            
            const origBytes = fs.statSync(srcPath).size;
            totalOriginalBytes += origBytes;
            
            const info = await sharp(srcPath)
                .png({ palette: true, quality: QUALITY, compressionLevel: 9 })
                .toFile(dstPath);
                
            totalOutputBytes += info.size;
            processedCount++;
            
            const pageNumber = parseInt(fileName.replace('page', '').replace('.png', ''), 10);
            pages.push({
                page: pageNumber,
                file: `warsh_muthamma_png_q70/${fileName}`,
                bytes: info.size,
                width: info.width,
                height: info.height,
                sha256: sha256File(dstPath)
            });
            
            if (processedCount % 50 === 0 || processedCount === files.length) {
                console.log(`Processed ${processedCount}/${files.length} pages...`);
            }
        }));
    }
    
    pages.sort((a, b) => a.page - b.page);
    
    const index = {
        stage: "warsh_muthamma_png_q70",
        format: "png",
        pageCount: pages.length,
        totalBytes: totalOutputBytes,
        generatedAt: new Date().toISOString(),
        pages: pages
    };
    
    fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n', 'utf8');
    console.log(`Wrote index to ${INDEX_PATH}`);
    
    const totalSavings = (totalOriginalBytes - totalOutputBytes) * 100 / totalOriginalBytes;
    console.log(`Done! Original size: ${totalOriginalBytes} bytes`);
    console.log(`Optimized size: ${totalOutputBytes} bytes (${totalSavings.toFixed(2)}% saved)`);
}

run().catch(err => {
    console.error("Execution failed:", err);
    process.exit(1);
});
