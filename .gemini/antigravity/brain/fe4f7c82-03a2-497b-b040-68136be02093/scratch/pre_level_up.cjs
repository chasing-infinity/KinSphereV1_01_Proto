
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 3300; i < 3350; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    balance += opens;
    balance -= closes;
    console.log(`${i + 1}: [${balance}] ${line.substring(0, 40)}`);
}
