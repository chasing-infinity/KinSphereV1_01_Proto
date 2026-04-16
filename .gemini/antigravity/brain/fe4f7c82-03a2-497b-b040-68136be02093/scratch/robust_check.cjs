
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let balance = 0;
let inString = null;
let inComment = false;
let inLineComment = false;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];

    if (inComment) {
        if (char === '*' && nextChar === '/') {
            inComment = false;
            i++;
        }
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

    if (char === '/' && nextChar === '*') {
        inComment = true;
        i++;
    } else if (char === '/' && nextChar === '/') {
        inLineComment = true;
        i++;
    } else if (char === "'" || char === '"' || char === '`') {
        inString = char;
    } else if (char === '{') {
        balance++;
    } else if (char === '}') {
        balance--;
        if (balance < 0) {
            console.log("UNEXPECTED } at character " + i);
            const context = content.substring(i - 40, i + 40);
            console.log("Context: " + context);
            // find line number
            const lines = content.substring(0, i).split('\n');
            console.log("Line number: " + lines.length);
            process.exit(1);
        }
    }
}
console.log("Final balance: " + balance);
