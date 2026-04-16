
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let lines = content.split('\n');
let line = lines[4048]; // line 4049
console.log("L4049: [" + line + "]");
for (let i = 0; i < line.length; i++) {
    console.log(i + ": " + line[i]);
}
