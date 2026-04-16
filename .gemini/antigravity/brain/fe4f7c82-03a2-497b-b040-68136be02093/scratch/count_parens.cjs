
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let par = 0;
let inString = null;
let inComment = false;
let inLineComment = false;

let startPos = content.indexOf('return (', content.indexOf('const LevelUp ='));
let endPos = content.indexOf('const ProgressBar =');

for (let i = startPos; i < endPos; i++) {
     const char = content[i];
     const nextChar = content[i+1];
     if (inComment) { if (char === '*' && nextChar === '/') { inComment = false; i++; } continue; }
     if (inLineComment) { if (char === '\n') inLineComment = false; continue; }
     if (inString) { if (char === inString && content[i-1] !== '\\') inString = null; continue; }
     if (char === '/' && nextChar === '*') { inComment = true; i++; }
     else if (char === '/' && nextChar === '/') { inLineComment = true; i++; }
     else if (char === "'" || char === '"' || char === '`') { inString = char; }
     else if (char === '(') par++;
     else if (char === ')') {
         par--;
         if (par < 0) {
             console.log("UNEXPECTED ) AT " + i);
             process.exit(0);
         }
     }
}
console.log("Parens balance: " + par);
