
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');

let balance = 0;
let lines = content.split('\n');
for (let i = 0; i < 3870; i++) {
    const line = lines[i];
    balance += (line.match(/\{/g) || []).length;
    balance -= (line.match(/\}/g) || []).length;
}
console.log("Balance at 3870: " + balance);
