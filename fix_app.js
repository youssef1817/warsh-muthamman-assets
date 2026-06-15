const fs = require('fs');

const filePath = 'viewer/app.js';
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `// رسم الصورة الحالية في الكانفاس
function setupDrawingCanvasForCurrentImage() {
    if (!drawingCanvas || !DOM.img) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });

    if (e.shiftKey && hasLastPoint && committedImageData) {
        ctx.putImageData(committedImageData, 0, 0);
    }

    // ضبط حجم الكانفاس الحقيقي ليطابق أبعاد الصورة الفعلية`;

const replacement1 = `// رسم الصورة الحالية في الكانفاس
function setupDrawingCanvasForCurrentImage() {
    if (!drawingCanvas || !DOM.img) return;
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });

    // ضبط حجم الكانفاس الحقيقي ليطابق أبعاد الصورة الفعلية`;

content = content.split(target1.replace(/\r\n/g, '\n')).join(replacement1.replace(/\r\n/g, '\n'));

const target2 = `function startDrawing(e) {
    if (!isDrawingMode || e.button !== 0 || e.altKey) return; // رسم باليسار فقط وبشرط عدم ضغط Alt (للسحب والتحريك)
    const pos = getCanvasMousePos(e);
    const ctx = drawingCanvas.getContext('2d', { willReadFrequently: true });
    
    // حفظ اللقطة الحالية قبل الرسم الجديد للتراجع
    if (drawingHistory.length >= 25) {
        drawingHistory.shift(); // حد أقصى للذاكرة
    }
    drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));

    if (e.shiftKey && hasLastPoint) {`;

const replacement2 = `function startDrawing(e) {
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

content = content.split(target2.replace(/\r\n/g, '\n')).join(replacement2.replace(/\r\n/g, '\n'));

const target3 = `    let svgContent = '';
    customCursorDiv.innerHTML = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}">\${svgContent}</svg>\`;`;

const replacement3 = `    const outlineWidth = 1.5;
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

content = content.split(target3.replace(/\r\n/g, '\n')).join(replacement3.replace(/\r\n/g, '\n'));

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done');
