const fs = require('fs');
const content = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
let parenBalance = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') balance++;
    if (line[j] === '}') balance--;
    if (line[j] === '(') parenBalance++;
    if (line[j] === ')') parenBalance--;
  }
  if (i >= 6360 && i <= 6390) {
    console.log(`Line ${i + 1}: B=${balance} P=${parenBalance} | ${line.trim()}`);
  }
}
