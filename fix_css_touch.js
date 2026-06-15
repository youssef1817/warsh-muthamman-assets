const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'viewer', 'index.css');
let css = fs.readFileSync(cssFile, 'utf8');
css += '\n';
css += '/* Add touch-action none for tablet dragging */\n';
css += '#overlay-container, .highlight-box, .marker-box, .box-resize-handle, .box-toolbar button {\n';
css += '    touch-action: none;\n';
css += '}\n';
fs.writeFileSync(cssFile, css, 'utf8');
console.log('Added touch-action: none');
