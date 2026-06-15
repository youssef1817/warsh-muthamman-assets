const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'viewer', 'app.js');
let content = fs.readFileSync(appFile, 'utf8');
content = content.replace(/mousedown/g, 'pointerdown');
content = content.replace(/mousemove/g, 'pointermove');
content = content.replace(/mouseup/g, 'pointerup');
fs.writeFileSync(appFile, content, 'utf8');
console.log('Replaced all mouse events with pointer events.');