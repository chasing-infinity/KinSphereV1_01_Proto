
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
let inString = null;
let inComment = false;
let inLineComment = false;

let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let opens = 0;
    let closes = 0;

    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (inComment) {
            if (char === '*' && line[j+1] === '/') { inComment = false; j++; }
            continue;
        }
        if (inLineComment) continue;
        if (inString) {
            if (char === inString && line[j-1] !== '\\') inString = null;
            continue;
        }
        if (char === '/' && line[j+1] === '*') { inComment = true; j++; }
        else if (char === '/' && line[j+1] === '/') { inLineComment = true; j++; }
        else if (char === "'" || char === '"' || char === '`') { inString = char; }
        else if (char === '{') { bce++; opens++; }
        else if (char === '}') { bce--; closes++; }
    }
    inLineComment = false; 

    if (i >= 4030 && i <= 4060) {
        console.log(`${i+1}: [${bce}] (+${opens}, -${closes}) ${line.trim()}`);
    }
}
