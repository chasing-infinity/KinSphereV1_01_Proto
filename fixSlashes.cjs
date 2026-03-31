const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

const st = c.indexOf('const PayrollWizardModal');
const en = c.indexOf('export default function App');
const before = c.substring(0, st);
const after = c.substring(en);
let mid = c.substring(st, en);

// Unescape remaining backslashes before backticks and dollar signs
mid = mid.replace(/\\`/g, '`').replace(/\\\$/g, '$');

fs.writeFileSync('kinsphere_prototype.tsx', before + mid + after);
console.log('Fixed Escaping');
