const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

c = c.replace(/borderTop:\\`1px solid \\\${C.bdr}\\`/g, 'borderTop:`1px solid ${C.bdr}`');
c = c.replace(/border:\\`1px solid \\\${C.p}\\`/g, 'border:`1px solid ${C.p}`');
c = c.replace(/border:\\`1px solid \\\${C.bdr}\\`/g, 'border:`1px solid ${C.bdr}`');

fs.writeFileSync('kinsphere_prototype.tsx', c);
console.log('Fixed Escapes.');
