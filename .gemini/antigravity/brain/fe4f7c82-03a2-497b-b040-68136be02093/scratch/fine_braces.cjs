
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let balance = 0;
let startPos = content.indexOf('const LevelUp =');
let endPos = content.indexOf('const updateMarkerStatus');

console.log("TRACE START at " + startPos);
for (let i = startPos; i < endPos; i++) {
    const char = content[i];
    if (char === '{') balance++;
    if (char === '}') balance--;
    if (balance < 0) {
        console.log("NEGATIVE AT " + i + " char " + char);
        process.exit(0);
    }
}
console.log("Final balance: " + balance);
