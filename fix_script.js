const fs = require('fs');
let content = fs.readFileSync('viewer/app.js', 'utf8');

// Normalize line endings for replacement
content = content.replace(/\r\n/g, '\n');

// Fix 1
const t1 = `// رسم الصورة الحالية في الكانفاس
function setupDrawingCanvasForCurrentImage() {
    if (!drawingCanvas || !DOM.img) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });

    if (e.shiftKey && hasLastPoint && committedImageData) {
        ctx.putImageData(committedImageData, 0, 0);
    }

    // ضبط حجم الكانفاس الحقيقي ليطابق أبعاد الصورة الفعلية`;

const r1 = `// رسم الصورة الحالية في الكانفاس
function setupDrawingCanvasForCurrentImage() {
    if (!drawingCanvas || !DOM.img) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });

    // ضبط حجم الكانفاس الحقيقي ليطابق أبعاد الصورة الفعلية`;

content = content.replace(t1, r1);

// Fix 2
const t2 = `function startDrawing(e) {
    if (!isDrawingMode || e.button !== 0 || e.altKey) return; // رسم باليسار فقط وبشرط عدم ضغط Alt (للسحب والتحريك)
    const pos = getCanvasMousePos(e);
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    
    // حفظ اللقطة الحالية قبل الرسم الجديد للتراجع
    if (drawingHistory.length >= 25) {
        drawingHistory.shift(); // حد أقصى للذاكرة
    }
    drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));

    if (e.shiftKey && hasLastPoint) {`;

const r2 = `function startDrawing(e) {
    if (!isDrawingMode || e.button !== 0 || e.altKey) return; // رسم باليسار فقط وبشرط عدم ضغط Alt (للسحب والتحريك)
    const pos = getCanvasMousePos(e);
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    
    // استعادة النسخة النظيفة أولاً لإزالة خط المعاينة الوهمي قبل الحفظ في السجل وقبل الرسم
    if (committedImageData) {
        ctx.putImageData(committedImageData, 0, 0);
    }

    // حفظ اللقطة الحالية قبل الرسم الجديد للتراجع
    if (drawingHistory.length >= 25) {
        drawingHistory.shift(); // حد أقصى للذاكرة
    }
    drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));

    if (e.shiftKey && hasLastPoint) {`;

content = content.replace(t2, r2);

// Fix 3: The SVG rendering
const t3 = `    let svgContent = '';
    customCursorDiv.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}">\${svgContent}</svg>\`;`;

const r3 = `    const outlineWidth = 1.5;
    const dashWidth = 1;
    let svgContent = '';
    
    svgContent += \`<circle cx="\${center}" cy="\${center}" r="\${radius}" fill="none" stroke="#000000" stroke-width="\${outlineWidth}" />\`;
    svgContent += \`<circle cx="\${center}" cy="\${center}" r="\${radius}" fill="none" stroke="#ffffff" stroke-width="\${dashWidth}" stroke-dasharray="3,3" />\`;
    
    if (isEraser) {
        svgContent += \`<rect x="\${center-3}" y="\${center-3}" width="6" height="6" fill="none" stroke="#000000" stroke-width="2.5" />\`;
        svgContent += \`<rect x="\${center-3}" y="\${center-3}" width="6" height="6" fill="none" stroke="#ffffff" stroke-width="1.2" />\`;
    } else {
        svgContent += \`<line x1="\${center-5}" y1="\${center}" x2="\${center+5}" y2="\${center}" stroke="#000000" stroke-width="2.5" stroke-linecap="square" />\`;
        svgContent += \`<line x1="\${center}" y1="\${center-5}" x2="\${center}" y2="\${center+5}" stroke="#000000" stroke-width="2.5" stroke-linecap="square" />\`;
        svgContent += \`<line x1="\${center-4}" y1="\${center}" x2="\${center+4}" y2="\${center}" stroke="\${brushColor}" stroke-width="1.2" stroke-linecap="square" />\`;
        svgContent += \`<line x1="\${center}" y1="\${center-4}" x2="\${center}" y2="\${center+4}" stroke="\${brushColor}" stroke-width="1.2" stroke-linecap="square" />\`;
    }
    
    customCursorDiv.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}">\${svgContent}</svg>\`;`;

content = content.replace(t3, r3);

fs.writeFileSync('viewer/app.js', content, 'utf8');
console.log('Fixed app.js successfully!');
