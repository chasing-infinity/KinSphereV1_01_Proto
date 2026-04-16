
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let balance = 0;
let startPos = 199138;
let endPos = content.indexOf('const ProgressBar =');

for (let i = startPos; i < endPos; i++) {
    const char = content[i];
    if (char === '{') balance++;
    if (char === '}') balance--;
    if (balance < 0) {
        console.log("NEGATIVE AT " + i + " char " + char);
        const ctx = content.substring(i - 40, i + 40);
        console.log("Context: " + ctx);
        const lines = content.substring(0, i).split('\n');
        console.log("Line number: " + lines.length);
        process.exit(0);
    }
}
