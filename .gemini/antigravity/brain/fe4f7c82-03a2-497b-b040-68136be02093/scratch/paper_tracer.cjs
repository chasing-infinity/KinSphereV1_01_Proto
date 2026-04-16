
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{') bce++;
        if (char === '}') bce--;
    }
    if (i >= 6370 && i <= 6500) {
        console.log(`${i+1}: [${bce}] ${line.trim()}`);
    }
}
