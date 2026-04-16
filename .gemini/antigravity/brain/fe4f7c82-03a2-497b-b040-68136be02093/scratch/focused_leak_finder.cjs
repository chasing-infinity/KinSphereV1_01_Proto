
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let lines = content.split('\n');
let lastZeroLine = 0;
let bce = 0;

// To skip early noise, we can calculate initial balance at line 2700 using a more robust method or just assume it's 0 if the file is normally healthy.
// But we saw it was 1 or 2.

for (let i = 2700; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{') bce++;
        if (char === '}') bce--;
    }
    if (bce === 0) {
        lastZeroLine = i + 1;
    } else {
        if (i + 1 - lastZeroLine > 500) {
             console.log(`Potential leak after line ${lastZeroLine}. Current: ${i+1}, Bal: ${bce}`);
             console.log("Context:");
             for (let k = lastZeroLine - 5; k < lastZeroLine + 10; k++) {
                 if (lines[k]) console.log(`${k+1}: ${lines[k]}`);
             }
             process.exit(0);
        }
    }
}
