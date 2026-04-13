const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

const startTarget = '            <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"1200px", margin:"0 auto" }}>';
const endTarget = '{/* ── Tab Content: Documents ── */}';

const startIdx = c.indexOf(startTarget);
const endIdx = c.indexOf(endTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Mismatch finding targets!");
  process.exit(1);
}

const NEW_HERO = `            <div style={{ padding:\`0 \${pad}px \${padBottom}px\`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
              {/* ── Hero ── */}
              <div style={{
                position:"relative", margin:\`0 \${-pad}px 28px\`, padding: heroPadStd,
                background:\`linear-gradient(155deg, \${C.wht} 0%, \${C.surf} 38%, \${C.mid} 100%)\`,
                borderBottom:\`1px solid \${C.bdr}\`, overflow:"hidden",
              }}>
                <div style={{ position:"absolute", right:-40, top:-30, width:220, height:220, borderRadius:"50%", background:\`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)\`, pointerEvents:"none" }} />
                <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:16, flexWrap:"wrap", maxWidth:1200, margin:"0 auto" }}>
                  <div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10, padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:\`1px solid \${C.bdr}\`, fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Document Centre
                    </div>
                    <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em" }}>Paperwork Hub</h1>
                  </div>

                  <div style={{ display:"flex", background:C.wht, borderRadius:12, padding:4, border:\`1px solid \${C.bdr}\`, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                    {["Documents", "Templates", "Compliance"].map(t => (
                      (!canGenerate && t !== "Documents" && t !== "Compliance") ? null :
                      <button key={t} onClick={() => { setPaperTab(t); if(t==="Templates") setGenStep(1); }} 
                        style={{ padding:"8px 16px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight: (currentTab===t || (t==="Templates" && currentTab==="Generate"))?700:500,
                        background: (currentTab===t || (t==="Templates" && currentTab==="Generate")) ? C.p : "transparent",
                        color: (currentTab===t || (t==="Templates" && currentTab==="Generate")) ? "#fff" : C.sub,
                        transition:"all .2s" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              `;

c = c.slice(0, startIdx) + NEW_HERO + c.slice(endIdx);
fs.writeFileSync('kinsphere_prototype.tsx', c, 'utf8');
console.log("Hero injected.");
