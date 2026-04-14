const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

const HUB_START = '{/* ─ PAPERWORK HUB ─ */}';
const HUB_END   = '{/* ─ RECOGNITION ─ */}';
const si = code.indexOf(HUB_START);
const ei = code.indexOf(HUB_END);
let hub = code.slice(si, ei);

// Fix: remove outer single-quotes wrapping template literals
// Pattern: 'BACKTICK...' -> BACKTICK...  (where content has backtick delimiters)
hub = hub.replace(/'(`[^`']*`(?:[^'`]*`[^`']*`)*)`'/g, '$1');
hub = hub.replace(/'(`[^`]+`)'(?=[,;\s\]})]|$)/g, '$1');

// Most broken patterns look like: '`rgba(var(--p-rgb),.12)`'
// Fix using a simple global replacement for all the specific strings we created:
const fixes = [
  ["'`rgba(var(--p-rgb),.12)`'",   "`rgba(var(--p-rgb),.12)`"],
  ["'`rgba(var(--p-rgb),.06)`'",   "`rgba(var(--p-rgb),.06)`"],
  ["'`rgba(var(--p-rgb),.1)`'",    "`rgba(var(--p-rgb),.1)`"],
  ["'`rgba(var(--p-rgb),.25)`'",   "`rgba(var(--p-rgb),.25)`"],
  ["'`rgba(160,120,64,.1)`'",      "`rgba(160,120,64,.1)`"],
  ["'`rgba(160,120,64,.06)`'",     "`rgba(160,120,64,.06)`"],
  ["'`rgba(160,120,64,.05)`'",     "`rgba(160,120,64,.05)`"],
  ["'`rgba(160,120,64,.22)`'",     "`rgba(160,120,64,.22)`"],
  ["'`rgba(160,120,64,.25)`'",     "`rgba(160,120,64,.25)`"],
  ["'`rgba(160,120,64,.2)`'",      "`rgba(160,120,64,.2)`"],
  ["'`rgba(192,57,43,.1)`'",       "`rgba(192,57,43,.1)`"],
  ["'`rgba(192,57,43,.08)`'",      "`rgba(192,57,43,.08)`"],
  // background properties with backtick template literals
  ["background:'`rgba(var(--p-rgb),.12)`'", "background:`rgba(var(--p-rgb),.12)`"],
  ["background:'`rgba(var(--p-rgb),.06)`'", "background:`rgba(var(--p-rgb),.06)`"],
  ["background:'`rgba(160,120,64,.06)`'",   "background:`rgba(160,120,64,.06)`"],
  ["background:'`rgba(160,120,64,.05)`'",   "background:`rgba(160,120,64,.05)`"],
  ["background:'`rgba(160,120,64,.1)`'",    "background:`rgba(160,120,64,.1)`"],
  // border properties
  ["border:'`rgba(var(--p-rgb),.25)`'", "border:`1px solid rgba(var(--p-rgb),.25)`"],
  ["border:'`rgba(160,120,64,.25)`'",   "border:`1px solid rgba(160,120,64,.25)`"],
  ["border:'`rgba(160,120,64,.22)`'",   "border:`1px solid rgba(160,120,64,.22)`"],
  ["border:'`rgba(160,120,64,.2)`'",    "border:`1px solid rgba(160,120,64,.2)`"],
  // color C.p being stringified
  ['color:"C.p"',  'color:C.p'],
  ['color:"C.wht"', 'color:C.wht'],
  ['color:"C.sub"', 'color:C.sub'],
  ['color:"C.txt"', 'color:C.txt'],
  ['background:"C.p"',  'background:C.p'],
  ['background:"C.wht"', 'background:C.wht'],
];

for (const [bad, good] of fixes) {
  const before = hub.split(bad).length - 1;
  hub = hub.split(bad).join(good);
  if (before > 0) console.log(`Fixed ${before}x: ${bad.slice(0,50)}`);
}

// Final check
const remaining = (hub.match(/'`[^']+`'/g) || []).filter(m => !m.includes('/'));
console.log('\nRemaining broken template literals:', remaining.length);
if (remaining.length > 0) console.log(remaining.slice(0,3));

code = code.slice(0, si) + hub + code.slice(ei);
fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('\nAll fixes applied.');
