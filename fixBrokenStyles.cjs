const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

const HUB_START = '{/* ─ PAPERWORK HUB ─ */}';
const HUB_END   = '{/* ─ RECOGNITION ─ */}';
const si = code.indexOf(HUB_START);
const ei = code.indexOf(HUB_END);
let hub = code.slice(si, ei);

// All broken patterns from the previous pass left template literals wrapped in double-quotes inside JSX style props
// E.g.: background:"`rgba(var(--p-rgb),.12)`"   (the backtick string is inside a JS string → wrong)
// Fix: strip surrounding double-quotes from template literals

// Pattern: "  becomes a value inside the style object
// Replace all occurrences of: :"`backtick-expression`" with :`backtick-expression`

hub = hub.replace(/:"(`[^`"]+`)"(?=[,\s}])/g, ':$1');
hub = hub.replace(/:"(`[^`"]+`)"(?=[,\s}])/g, ':$1'); // run twice to catch any missed

// Fix double-quoted color in ternary: `"\"#c0392b\""` etc
hub = hub.replace(/"(\"#[0-9a-fA-F]{6}\")"/g, '"$2"');  // doesn't apply here
// Fix: `""#c0392b""` → `"#c0392b"`
hub = hub.replace(/"("#[0-9a-fA-F]{6})"/g, '$1"');
hub = hub.replace(/"(#[0-9a-fA-F]{6})"/g, '"$1"');

// Handle specific bad patterns manually:
// 5983: background:"`rgba(var(--p-rgb),.12)`" → background:`rgba(var(--p-rgb),.12)`
// 5989: color:""#c0392b"" → color:"#c0392b"
// 5989: background:"`rgba(192,57,43,.1)`" → background:`rgba(192,57,43,.1)`
// 5995: background:"`rgba(var(--p-rgb),.12)`"

const specificFixes = [
  ['background:"`rgba(var(--p-rgb),.12)`"', 'background:`rgba(var(--p-rgb),.12)`'],
  ['background:"`rgba(var(--p-rgb),.06)`"', 'background:`rgba(var(--p-rgb),.06)`'],
  ['background:"`rgba(var(--p-rgb),.1)`"',  'background:`rgba(var(--p-rgb),.1)`'],
  ['background:"`rgba(var(--p-rgb),.25)`"', 'background:`rgba(var(--p-rgb),.25)`'],
  ['background:"`rgba(160,120,64,.1)`"',    'background:`rgba(160,120,64,.1)`'],
  ['background:"`rgba(160,120,64,.06)`"',   'background:`rgba(160,120,64,.06)`'],
  ['background:"`rgba(160,120,64,.05)`"',   'background:`rgba(160,120,64,.05)`'],
  ['background:"`rgba(192,57,43,.1)`"',     'background:`rgba(192,57,43,.1)`'],
  ['background:"`rgba(192,57,43,.08)`"',    'background:`rgba(192,57,43,.08)`'],
  ['border:"`1px solid rgba(var(--p-rgb),.25)`"', 'border:`1px solid rgba(var(--p-rgb),.25)`'],
  ['border:"`1px solid rgba(160,120,64,.25)`"',   'border:`1px solid rgba(160,120,64,.25)`'],
  ['border:"`1px solid rgba(160,120,64,.22)`"',   'border:`1px solid rgba(160,120,64,.22)`'],
  ['border:"`1px solid rgba(160,120,64,.2)`"',    'border:`1px solid rgba(160,120,64,.2)`'],
  ['border:"`rgba(var(--p-rgb),.25)`"',     'border:`1px solid rgba(var(--p-rgb),.25)`'],
  // double-stringified hex
  ['color:""#c0392b""',   'color:"#c0392b"'],
  ['color:""#8a6530""',   'color:"#8a6530"'],
  ['color:""#a07840""',   'color:"#a07840"'],
  ['color:""#7a5520""',   'color:"#7a5520"'],
  ['color:""#6b4a1c""',   'color:"#6b4a1c"'],
  // background double-stringified
  ['background:""rgba(192,57,43,.1)""', 'background:`rgba(192,57,43,.1)`'],
  // verify button  
  ['background:C.p, color:C.wht',  'background:C.p, color:"#fff"'],
];

let count = 0;
for (const [bad, good] of specificFixes) {
  const n = hub.split(bad).length - 1;
  if (n > 0) { hub = hub.split(bad).join(good); count++; console.log(`Fixed ${n}x: ${bad.slice(0,60)}`); }
}

// Also fix any remaining: :"`...`" pattern with regex
const before = hub.match(/:"(`[^"]+`)"(?=[,\s}])/g) || [];
if (before.length) {
  console.log('\nFixing remaining regex matches:', before.length);
  hub = hub.replace(/:"(`[^"]+`)"(?=[,\s`}])/g, ':$1');
}

code = code.slice(0, si) + hub + code.slice(ei);
fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log(`\nDone. Fixed ${count} specific patterns.`);
