const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// Position 381317 = #fce7f3 in the offboarding emoji div
const fcePos = 381317;

// Walk back to find opening <div
const divStart = c.lastIndexOf('<div', fcePos);
// Walk forward to find </div>
const divEnd = c.indexOf('</div>', fcePos) + 6;

console.log('div to replace:', JSON.stringify(c.slice(divStart, divEnd)));

const offboardSvgDiv = `<div style={{ width:64, height:64, borderRadius:18, background:\`rgba(var(--p-rgb),0.09)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>`;

c = c.slice(0, divStart) + offboardSvgDiv + c.slice(divEnd);

// Also fix the onMouseEnter/Leave handlers on both chapter cards (simple hover → enhanced hover)
// These still use the simple version
const simpleHover = `onMouseEnter={e=>e.currentTarget.style.borderColor=C.p} onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}>`;
const richHover   = `onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=\`0 8px 28px rgba(var(--p-rgb),0.10)\`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.boxShadow="0 4px 15px rgba(0,0,0,0.02)";}}>`;

let count = 0;
c = c.replaceAll(simpleHover, () => { count++; return richHover; });
console.log(`Replaced ${count} hover handlers`);

fs.writeFileSync('kinsphere_prototype.tsx', c, 'utf8');
console.log('Done.');

// Final verification
const check = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');
console.log('fce7f3 still present:', check.includes('#fce7f3'));
console.log('SVG offboard present:', check.includes('M9 21H5'));
console.log('SVG onboard present:', check.includes('M16 21v-2a4'));
