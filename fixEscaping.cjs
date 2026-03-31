const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');
const st = c.indexOf('const OnboardingFlow');
const en = c.indexOf('export default function App', st);
const before = c.substring(0, st);
const after = c.substring(en);
let mid = c.substring(st, en);

// Replace \` with `
mid = mid.replace(/\\`/g, '`');

// Replace \$ with $
mid = mid.replace(/\\\$/g, '$');

fs.writeFileSync('kinsphere_prototype.tsx', before + mid + after);
console.log('Fixed escaping in kinsphere_prototype.tsx');
