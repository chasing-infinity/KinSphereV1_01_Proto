
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let lines = content.split('\n');
let line = lines[4053]; // line 4054
console.log("L4054: [" + line + "]");
for (let i = 0; i < line.length; i++) {
    console.log(i + ": " + line[i]);
}
