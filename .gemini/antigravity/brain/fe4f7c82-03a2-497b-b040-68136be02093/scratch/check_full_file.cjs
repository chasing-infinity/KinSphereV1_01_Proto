
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\kinsphere_prototype.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    balance += opens;
    balance -= closes;
    if (balance < 0) {
        console.log(`CRASH at line ${i + 1}: Balance ${balance}`);
        console.log(line);
        process.exit(0);
    }
}
console.log("File is balanced! Final balance: " + balance);
