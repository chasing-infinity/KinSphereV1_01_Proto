
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
let currentLine = 1;
for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') bce++;
    if (char === '}') {
        bce--;
        if (bce === 0) {
             // console.log("Balanced at " + currentLine);
        }
    }
    if (char === '\n') {
        if (bce === 1) {
            console.log(`STAYS AT 1: Line ${currentLine}`);
            // process.exit(0);
        }
        currentLine++;
    }
}
