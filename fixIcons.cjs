const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// ── Onboarding card: replace emoji icon well + card hover ──────────────────
c = c.replace(
  `onMouseEnter={e=>e.currentTarget.style.borderColor=C.p} onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}>\n                      <div style={{ width:64, height:64, borderRadius:"50%", background:"#e0f2fe", color:"#0369a1", fontSize:28, display:"flex", alignItems:"center", justifyContent:"center" }}>\u{1F44B}</div>`,
  `onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=\`0 8px 28px rgba(var(--p-rgb),0.10)\`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.boxShadow="0 4px 15px rgba(0,0,0,0.02)";}}>
                      <div style={{ width:64, height:64, borderRadius:18, background:\`rgba(var(--p-rgb),0.08)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg></div>`
);

// ── Offboarding card: replace emoji icon well + card hover ─────────────────
c = c.replace(
  `onMouseEnter={e=>e.currentTarget.style.borderColor=C.p} onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}>\n                      <div style={{ width:64, height:64, borderRadius:"50%", background:"#fce7f3", color:"#be185d", fontSize:28, display:"flex", alignItems:"center", justifyContent:"center" }}>\u{1F6AA}</div>`,
  `onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=\`0 8px 28px rgba(var(--p-rgb),0.10)\`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.boxShadow="0 4px 15px rgba(0,0,0,0.02)";}}>
                      <div style={{ width:64, height:64, borderRadius:18, background:\`rgba(var(--p-rgb),0.08)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>`
);

// ── Fallback "coming soon" card: replace 🎢 emoji ─────────────────────────
c = c.replace(
  `<div style={{ fontSize:40, marginBottom:16 }}>\u{1F3A2}</div>`,
  `<div style={{ width:56, height:56, borderRadius:14, background:\`rgba(var(--p-rgb),0.07)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>`
);

fs.writeFileSync('kinsphere_prototype.tsx', c, 'utf8');
console.log('Icons replaced successfully.');
