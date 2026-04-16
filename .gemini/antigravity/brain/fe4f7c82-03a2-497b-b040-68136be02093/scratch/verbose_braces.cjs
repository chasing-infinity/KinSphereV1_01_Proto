
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
let startLine = 3350; 
let endLine = 4050;

for (let i = startLine - 1; i < endLine; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    balance += opens;
    balance -= closes;
    console.log(`${i + 1}: [${balance}] ${line.substring(0, 40)}`);
    if (balance === 0 && i > startLine + 10) {
        console.log("ZERO AT " + (i+1));
    }
}
