
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
let inString = null;
let inComment = false;
let inLineComment = false;

let startPos = content.indexOf('const LevelUp =');
let endPos = content.indexOf('const ProgressBar =');

let opens = 0;
let closes = 0;

for (let i = startPos; i < endPos; i++) {
     const char = content[i];
     const nextChar = content[i+1];
     if (inComment) { if (char === '*' && nextChar === '/') { inComment = false; i++; } continue; }
     if (inLineComment) { if (char === '\n') inLineComment = false; continue; }
     if (inString) { if (char === inString && content[i-1] !== '\\') inString = null; continue; }
     if (char === '/' && nextChar === '*') { inComment = true; i++; }
     else if (char === '/' && nextChar === '/') { inLineComment = true; i++; }
     else if (char === "'" || char === '"' || char === '`') { inString = char; }
     else if (char === '{') opens++;
     else if (char === '}') closes++;
}
console.log("Opens: " + opens + ", Closes: " + closes);
