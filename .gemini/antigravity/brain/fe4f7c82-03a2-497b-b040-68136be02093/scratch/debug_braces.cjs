
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
let startLine = 3356; 

for (let i = startLine - 1; i < 3420; i++) {
    const line = lines[i];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    balance += opens;
    balance -= closes;
    console.log(`${i + 1}: [${balance}] ${line}`);
}
