const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// Extract only the Paperwork Hub block for targeted replacements
const HUB_START = '{/* ─ PAPERWORK HUB ─ */}';
const HUB_END   = '{/* ─ RECOGNITION ─ */}';
const si = code.indexOf(HUB_START);
const ei = code.indexOf(HUB_END);
let hub = code.slice(si, ei);

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR REMAPPING  (hardcoded → theme tokens)
// Theme tokens available: C.p, C.p2, C.surf, C.bdr, C.txt, C.sub, C.wht, C.mid, C.bg
// rgba(var(--p-rgb), x) for tinted primaries
// ─────────────────────────────────────────────────────────────────────────────

// ── Status colours → use semantic thin wrappers that stay on-theme ──
// Success / verified green  → C.p tones
hub = hub.replace(/#15803d/g, 'C.p');
hub = hub.replace(/#dcfce7/g, '`rgba(var(--p-rgb),.12)`');
hub = hub.replace(/#f0fdf4/g, '`rgba(var(--p-rgb),.06)`');
hub = hub.replace(/#bbf7d0/g, '`rgba(var(--p-rgb),.25)`');

// Amber / warning → use C.p with low opacity (avoids random amber)
// In status chips use a muted gold — replace amber with a refined neutral
hub = hub.replace(/#f59e0b/g, '"#a07840"');    // muted warm amber — single sensible tone
hub = hub.replace(/#d97706/g, '"#8a6530"');    // darker variant
hub = hub.replace(/#fef3c7/g, '`rgba(160,120,64,.1)`');
hub = hub.replace(/#fffbeb/g, '`rgba(160,120,64,.06)`');
hub = hub.replace(/#fde68a/g, '`rgba(160,120,64,.25)`');
hub = hub.replace(/#fff7ed/g, '`rgba(160,120,64,.06)`');
hub = hub.replace(/#fed7aa/g, '`rgba(160,120,64,.22)`');
hub = hub.replace(/#92400e/g, '"#7a5520"');
hub = hub.replace(/#78350f/g, '"#6b4a1c"');

// Red / danger → a refined muted red, not screaming primary
hub = hub.replace(/#dc2626/g, '"#c0392b"');
hub = hub.replace(/#fee2e2/g, '"rgba(192,57,43,.1)"');

// Doc preview background
hub = hub.replace(/#f8fafc/g, 'C.surf');
hub = hub.replace(/#1e293b/g, 'C.txt');

// #fff → C.wht for consistency
hub = hub.replace(/"#fff"/g, 'C.wht');

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN POLISH — replace choppy inline styles with refined versions
// ─────────────────────────────────────────────────────────────────────────────

// 1. Submitted doc row: make it cleaner with theme tones
hub = hub.replace(
  'display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:\'`rgba(var(--p-rgb),.06)`\', borderRadius:8, border:\'`rgba(var(--p-rgb),.25)`\', marginBottom:6',
  'display:"flex", alignItems:"center", gap:10, padding:"11px 16px", background:`rgba(var(--p-rgb),.06)`, borderRadius:10, border:`1px solid rgba(var(--p-rgb),.2)`, marginBottom:6'
);

// 2. Missing doc row: use muted amber theme
hub = hub.replace(
  'display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:\'`rgba(160,120,64,.06)`\', borderRadius:8, border:\'`rgba(160,120,64,.22)`\', marginBottom:6',
  'display:"flex", alignItems:"center", gap:10, padding:"11px 16px", background:`rgba(160,120,64,.05)`, borderRadius:10, border:`1px solid rgba(160,120,64,.2)`, marginBottom:6'
);

// 3. Amber section (Mark from profile)
hub = hub.replace(
  'background:\'`rgba(160,120,64,.06)`\', border:\'`rgba(160,120,64,.25)`\', borderRadius:10',
  'background:`rgba(160,120,64,.05)`, border:`1px solid rgba(160,120,64,.2)`, borderRadius:12'
);

// 4. Compliance KPI cards — tighten up the left border tokens
hub = hub.replace(/borderLeft:`4px solid "a07840"`/g, 'borderLeft:`4px solid #a07840`');
hub = hub.replace(/borderLeft:`4px solid "c0392b"`/g, 'borderLeft:`4px solid #c0392b`');

// 5. Status badge backgrounds that references template literals as strings
// These were double-stringified by the replace above — fix them
hub = hub.replace(/background:'`rgba\(var\(--p-rgb\),\.12\)`'/g, 'background:`rgba(var(--p-rgb),.12)`');
hub = hub.replace(/background:'`rgba\(var\(--p-rgb\),\.06\)`'/g, 'background:`rgba(var(--p-rgb),.06)`');
hub = hub.replace(/background:'`rgba\(160,120,64,\.1\)`'/g, 'background:`rgba(160,120,64,.1)`');
hub = hub.replace(/background:'`rgba\(160,120,64,\.06\)`'/g, 'background:`rgba(160,120,64,.06)`');
hub = hub.replace(/border:'`rgba\(var\(--p-rgb\),\.25\)`'/g, 'border:`1px solid rgba(var(--p-rgb),.25)`');
hub = hub.replace(/border:'`rgba\(160,120,64,\.25\)`'/g, 'border:`1px solid rgba(160,120,64,.25)`');
hub = hub.replace(/border:'`rgba\(160,120,64,\.22\)`'/g, 'border:`1px solid rgba(160,120,64,.22)`');

// 6. Documents table: refine the SIGNED badge to use theme green
hub = hub.replace(
  'color:"C.p", background:`rgba(var(--p-rgb),.12)`',
  'color:C.p, background:`rgba(var(--p-rgb),.12)`'
);
hub = hub.replace(
  'color:"C.p"',
  'color:C.p'
);

// 7. Compliance setup modal requirement rows
hub = hub.replace(
  'border:`1px solid rgba(220,38,38,.2)`, borderRadius:6',
  `border:\`1px solid rgba(192,57,43,.25)\`, borderRadius:6`
);

// 8. Add context colour to the submitted count chip in compliance
// SIGNED badge uses C.p tones — already done above

// Fix verify button to use C.p 
hub = hub.replace(
  'background:"C.p", color:"#fff"',
  'background:C.p, color:C.wht'
);

// Fix the file upload drop zone active colour
hub = hub.replace(
  '"rgba(192,57,43,.1)"',
  '`rgba(192,57,43,.1)`'
);

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY & SPACING — improve the choppy feel
// ─────────────────────────────────────────────────────────────────────────────

// Make submitted status chips look more polished (rounded pill)
hub = hub.replace(
  'fontSize:11, fontWeight:700, color:"C.p", background:`rgba(var(--p-rgb),.1)`, padding:"4px 10px", borderRadius:99',
  'fontSize:11, fontWeight:700, color:C.p, background:`rgba(var(--p-rgb),.1)`, padding:"4px 12px", borderRadius:99, letterSpacing:.3'
);
hub = hub.replace(
  'fontSize:11, fontWeight:700, color:C.p, background:`rgba(var(--p-rgb),.1)`, padding:"4px 10px", borderRadius:99',
  'fontSize:11, fontWeight:700, color:C.p, background:`rgba(var(--p-rgb),.1)`, padding:"4px 12px", borderRadius:99, letterSpacing:.3'
);

// PENDING chip → muted amber on theme
hub = hub.replace(
  'fontSize:11, fontWeight:700, color:"#a07840", background:`rgba(160,120,64,.1)`, padding:"4px 10px", borderRadius:99',
  'fontSize:11, fontWeight:700, color:"#a07840", background:`rgba(160,120,64,.1)`, padding:"4px 12px", borderRadius:99, letterSpacing:.3'
);
hub = hub.replace(
  'fontSize:11, fontWeight:700, color:"#a07840", background:`rgba(160,120,64,.1)`, padding:"4px 12px", borderRadius:99',
  'fontSize:11, fontWeight:700, color:"#a07840", background:`rgba(160,120,64,.1)`, padding:"4px 12px", borderRadius:99, letterSpacing:.3'
);

// OVERDUE chip
hub = hub.replace(
  'fontSize:11, fontWeight:700, color:"#c0392b", background:"rgba(192,57,43,.1)", padding:"4px 10px", borderRadius:99',
  'fontSize:11, fontWeight:700, color:"#c0392b", background:`rgba(192,57,43,.08)`, padding:"4px 12px", borderRadius:99, letterSpacing:.3'
);
hub = hub.replace(
  'fontSize:11, fontWeight:700, color:"#c0392b", background:`rgba(192,57,43,.1)`, padding:"4px 10px", borderRadius:99',
  'fontSize:11, fontWeight:700, color:"#c0392b", background:`rgba(192,57,43,.08)`, padding:"4px 12px", borderRadius:99, letterSpacing:.3'
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPLIANCE KPI CARDS — replace borderLeft tokens cleanly
// ─────────────────────────────────────────────────────────────────────────────
hub = hub.replace(
  'borderLeft:`4px solid ${C.p}`',
  `borderLeft:\`4px solid \${C.p}\``
);

// Write back
code = code.slice(0, si) + hub + code.slice(ei);
fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('Redesign pass complete — colors normalized to theme.');
