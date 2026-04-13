const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// Onboarding emoji div — #e0f2fe at position ~380481
const bluePos = c.indexOf('#e0f2fe', 379000);
const divStart = c.lastIndexOf('<div', bluePos);
const divEnd = c.indexOf('</div>', bluePos) + 6;

console.log('Replacing:', JSON.stringify(c.slice(divStart, divEnd)));

const onboardSvg = `<div style={{ width:64, height:64, borderRadius:18, background:\`rgba(var(--p-rgb),0.09)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg></div>`;

c = c.slice(0, divStart) + onboardSvg + c.slice(divEnd);

fs.writeFileSync('kinsphere_prototype.tsx', c, 'utf8');

// Verify
const result = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');
console.log('e0f2fe in chapter area still:', result.indexOf('#e0f2fe', 379000) !== -1);
console.log('Onboard SVG present:', result.includes('M16 21v-2a4'));
console.log('Done.');
