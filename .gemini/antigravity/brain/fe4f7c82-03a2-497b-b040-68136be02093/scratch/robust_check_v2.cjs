
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0; // braces
let par = 0; // parens
let inString = null;
let inComment = false;
let inLineComment = false;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];

    if (inComment) {
        if (char === '*' && nextChar === '/') { inComment = false; i++; }
        continue;
    }
    if (inLineComment) {
        if (char === '\n') inLineComment = false;
        continue;
    }
    if (inString) {
        if (char === inString && content[i-1] !== '\\') inString = null;
        continue;
    }

    if (char === '/' && nextChar === '*') { inComment = true; i++; }
    else if (char === '/' && nextChar === '/') { inLineComment = true; i++; }
    else if (char === "'" || char === '"' || char === '`') { inString = char; }
    else if (char === '{') { bce++; }
    else if (char === '}') { bce--; if (bce < 0) logCrash(i, "}"); }
    else if (char === '(') { par++; }
    else if (char === ')') { par--; if (par < 0) logCrash(i, ")"); }
}

function logCrash(i, sym) {
    console.log(`UNEXPECTED ${sym} at char ${i}`);
    const context = content.substring(i - 40, i + 40);
    console.log("Context: " + context);
    const lines = content.substring(0, i).split('\n');
    console.log("Line number: " + lines.length);
    process.exit(1);
}

console.log(`Final balance: Braces=${bce}, Parens=${par}`);
