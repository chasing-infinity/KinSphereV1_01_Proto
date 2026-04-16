
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
let inString = null;
let inComment = false;
let inLineComment = false;

let startLine = 1;
let currentLine = 1;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];
    
    if (inComment) { if (char === '*' && nextChar === '/') { inComment = false; i++; } }
    else if (inLineComment) { if (char === '\n') inLineComment = false; }
    else if (inString) { if (char === inString && content[i-1] !== '\\') inString = null; }
    else if (char === '/' && nextChar === '*') { inComment = true; i++; }
    else if (char === '/' && nextChar === '/') { inLineComment = true; i++; }
    else if (char === "'" || char === '"' || char === '`') { inString = char; }
    else if (char === '{') { bce++; }
    else if (char === '}') { 
        bce--; 
        if (bce === 0 && currentLine < 4297) {
            // console.log("ZERO AT " + currentLine);
        }
    }

    if (char === '\n') {
        if (bce === 1 && currentLine < 4297) {
             // Find where it STAYS at 1
        }
        currentLine++;
    }
}
function findFirstLeak() {
    let b = 0;
    let s = null;
    let i = null;
    let lc = 1;
    for (let j = 0; j < content.length; j++) {
        const char = content[j];
        if (char === '{') b++;
        if (char === '}') b--;
        if (b === 0) s = j;
        if (char === '\n') lc++;
        if (lc === 4297) break;
    }
    // s is the last position where it was balanced.
    // find the first char AFTER s that makes it unbalanced.
    for (let j = s + 1; j < content.length; j++) {
         if (content[j] === '{') {
              console.log("FIRST LEAK AT POS " + j);
              // find its line
              let lines = content.substring(0, j).split('\n');
              console.log("Line: " + lines.length);
              process.exit(0);
         }
    }
}
findFirstLeak();
