
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let bce = 0;
for (let i = 0; i < 500; i++) {
    const char = content[i];
    if (char === '{') bce++;
    if (char === '}') bce--;
    if (char === '{' || char === '}') {
        console.log(`Pos ${i}: b[${bce}] ${char}`);
    }
}
