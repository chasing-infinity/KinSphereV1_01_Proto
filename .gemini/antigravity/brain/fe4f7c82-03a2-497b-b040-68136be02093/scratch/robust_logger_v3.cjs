
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
    
    if (inComment) {
        if (char === '*' && nextChar === '/') { inComment = false; i++; }
    } else if (inLineComment) {
        if (char === '\n') inLineComment = false;
    } else if (inString) {
        if (char === inString && content[i-1] !== '\\') inString = null;
    } else if (char === '/' && nextChar === '*') { inComment = true; i++; }
    else if (char === '/' && nextChar === '/') { inLineComment = true; i++; }
    else if (char === "'" || char === '"' || char === '`') { inString = char; }
    else if (char === '{') { 
        bce++; 
        if (currentLine >= startLine) console.log(`L${currentLine}: b[${bce}] open {`);
    } else if (char === '}') { 
        bce--; 
        if (currentLine >= startLine) console.log(`L${currentLine}: b[${bce}] close }`);
    }

    if (char === '\n') currentLine++;
}
