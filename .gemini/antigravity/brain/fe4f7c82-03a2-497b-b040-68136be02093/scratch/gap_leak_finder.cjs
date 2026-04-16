
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
let inString = null;
let inComment = false;
let inLineComment = false;

let lines = content.split('\n');
let lastZeroLine = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (inComment) {
            if (char === '*' && line[j+1] === '/') { inComment = false; j++; }
        } else if (inLineComment) {
        } else if (inString) {
            if (char === inString && line[j-1] !== '\\') inString = null;
        } else if (char === '/' && line[j+1] === '*') { inComment = true; j++; }
        else if (char === '/' && line[j+1] === '/') { inLineComment = true; break; }
        else if (char === "'" || char === '"' || char === '`') { inString = char; }
        else if (char === '{') { bce++; }
        else if (char === '}') { bce--; }
    }
    inLineComment = false;
    if (bce === 0) {
        lastZeroLine = i + 1;
    } else {
        if (i + 1 - lastZeroLine > 1000) { // If unbalanced for more than 1000 lines
            console.log(`Potential leak detected starting after line ${lastZeroLine}. Current line: ${i+1}, Balance: ${bce}`);
            // Show the start of the leak
            console.log("Context around start of leak:");
            for (let k = Math.max(0, lastZeroLine - 5); k < lastZeroLine + 10; k++) {
                console.log(`${k+1}: ${lines[k]}`);
            }
            process.exit(0);
        }
    }
}
console.log("No large unbalance gaps found. Last zero line: " + lastZeroLine);
console.log("Final balance: " + bce);
