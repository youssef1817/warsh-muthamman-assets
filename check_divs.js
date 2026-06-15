const fs = require('fs');
const html = fs.readFileSync('viewer/index.html', 'utf8');
const lines = html.split('\n');

let balance = 0;
let output = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div(?=[\s>])/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    balance += opens - closes;
    output.push(`${(i+1).toString().padStart(4, '0')}: [BAL ${balance}] ${line.trim()}`);
}
fs.writeFileSync('viewer/balance_log.txt', output.join('\n'));
console.log('Balance log written.');
