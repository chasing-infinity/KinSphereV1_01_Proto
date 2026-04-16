
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let balance = 0;
let startPos = content.indexOf('const updateMarkerStatus');
let endPos = content.indexOf('const stats =');

console.log("TRACE START at " + startPos);
for (let i = startPos; i < endPos; i++) {
    const char = content[i];
    if (char === '{') balance++;
    if (char === '}') balance--;
}
console.log("Segment balance: " + balance);
