const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

const si = code.indexOf('{/* ─ PAPERWORK HUB ─ */}');
const ei = code.indexOf('{/* ─ RECOGNITION ─ */}');
let hub = code.slice(si, ei);

// --- Fix the literal "$2" mistakes ---
// 5989: missing count color
hub = hub.replace(/color: row\.missing\.length>0\?"\$2":C\.sub/g, 'color: row.missing.length>0 ? "#c0392b" : C.sub');
// 5997: overdue color
hub = hub.replace(/color:"\$2", background:`rgba\(192,57,43,\.1\)`/g, 'color:"#c0392b", background:`rgba(192,57,43,.1)`');
// 5999: pending color
hub = hub.replace(/color:"\$2", background:`rgba\(160,120,64,\.1\)`/g, 'color:"#a07840", background:`rgba(160,120,64,.1)`');
// 6127, 6128, 6129:  Amber missing section
hub = hub.replace(/stroke="\$2"/g, 'stroke="#c0392b"');
hub = hub.replace(/color:"\$2"/g, 'color:"#c0392b"');
// 6138, 6139, 6144: Amber Mark From Profile section
hub = hub.replace(/color:"\$2"/g, 'color:"#7a5520"');
// 6167: Mark button
hub = hub.replace(/background:"\$2"/g, 'background:"#8a6530"');
// 6029: Remove req button
hub = hub.replace(/color:"\$2"/g, 'color:"#c0392b"');

// --- Replace grey/black buttons with light green ---
// Add Doc button in compliance table:
hub = hub.replace(/background:C\.txt, color:C\.surf, border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer"/g, 
  'background:`rgba(var(--p-rgb),.1)`, color:C.p, border:`1px solid rgba(var(--p-rgb),.2)`, borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer"');

// Send button in Document list:
hub = hub.replace(/background:C\.txt, border:"none", borderRadius:8, padding:"6px 16px", fontSize:11, fontWeight:700, color:C\.surf, cursor:"pointer", display:"flex"/g, 
  'background:`rgba(var(--p-rgb),.1)`, border:`1px solid rgba(var(--p-rgb),.2)`, borderRadius:8, padding:"6px 16px", fontSize:11, fontWeight:700, color:C.p, cursor:"pointer", display:"flex"');

// View document buttons: 
// The hover state is not easy inline, but let's change `background:"none"` to `background:"rgba(var(--p-rgb),.04)"` with `color:C.p`.
// (Except IconLink Add Access already uses C.p)
hub = hub.replace(/style={{ background:"none", border:`1px solid \$\{C\.bdr\}`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, color:C\.txt, cursor:"pointer"/g, 
  'style={{ background:`rgba(var(--p-rgb),.04)`, border:`1px solid rgba(var(--p-rgb),.15)`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer"');


// Fix the "Add Doc" feature layout in the modal.
// The user says: "Also the 'Add Dcoc' feature needs to look better please. It looks very weird"
// The file upload dropzone has: border: `2px dashed ${complianceAddDocForm.fileName ? C.p : C.bdr}`
// Let's redesign the form block
const oldAddDocForm = `                            {/* Add Document for this Employee */}
                            <div style={{ borderTop:\`1px solid \${C.bdr}\`, paddingTop:16 }}>
                              <div style={{ fontSize:12, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:14 }}>ADD DOCUMENT FOR {emp.name.split(" ")[0].toUpperCase()}</div>
                              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                <select value={complianceAddDocForm.reqId} onChange={e=>setComplianceAddDocForm(f=>({...f, reqId:e.target.value}))}
                                  style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13 }}>
                                  <option value="">-- Select document type --</option>
                                  {missing.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                  <option value="custom">Other (custom)</option>
                                </select>
                                {complianceAddDocForm.reqId === "custom" && (
                                  <input placeholder="Custom document name..."
                                    value={complianceAddDocForm.customName||""}
                                    onChange={e=>setComplianceAddDocForm(f=>({...f, customName:e.target.value}))}
                                    style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13, boxSizing:"border-box" }} />
                                )}
                                {/* File upload drop zone */}
                                <div>
                                  <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6, letterSpacing:.4 }}>ATTACH FILE</label>
                                  <div style={{ position:"relative", border:\`2px dashed \${complianceAddDocForm.fileName ? C.p : C.bdr}\`, borderRadius:10, padding:"20px 16px", textAlign:"center", background: complianceAddDocForm.fileName ? \`rgba(var(--p-rgb),.04)\` : C.surf, transition:"all .2s", cursor:"pointer" }}>
                                    <input type="file" onChange={e => {
                                      const f = e.target.files?.[0];
                                      if (f) setComplianceAddDocForm(prev => ({ ...prev, fileName: f.name }));
                                    }} style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }} />
                                    {complianceAddDocForm.fileName ? (
                                      <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.p} strokeWidth="2" style={{ marginBottom:4 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                                        <div style={{ fontSize:12, fontWeight:600, color:C.p }}>{complianceAddDocForm.fileName}</div>
                                        <div style={{ fontSize:11, color:C.sub }}>Click to change</div>
                                      </>
                                    ) : (
                                      <>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="1.5" style={{ marginBottom:6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        <div style={{ fontSize:12, color:C.sub }}>Click to upload a file</div>
                                        <div style={{ fontSize:11, color:C.bdr, marginTop:2 }}>PDF, PNG, JPG accepted</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.surf, borderRadius:8 }}>
                                  <input type="checkbox" id="verifiedCheck" checked={complianceAddDocForm.verified}
                                    onChange={e=>setComplianceAddDocForm(f=>({...f, verified:e.target.checked}))} />
                                  <label htmlFor="verifiedCheck" style={{ fontSize:13, cursor:"pointer" }}>Mark as verified immediately</label>
                                </div>
                                <Btn style={{ width:"100%" }} onClick={() => {`;

const newAddDocForm = `                            {/* Add Document for this Employee */}
                            <div style={{ borderTop:\`1px solid \${C.bdr}\`, paddingTop:20, marginTop:10 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.p} strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                                <div style={{ fontSize:13, fontWeight:700, color:C.txt, letterSpacing:.3 }}>UPLOAD DOCUMENT</div>
                              </div>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:12, background:C.surf, padding:16, borderRadius:12, border:\`1px solid \${C.bdr}\` }}>
                                <div>
                                  <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6, letterSpacing:.4 }}>DOCUMENT TYPE</label>
                                  <select value={complianceAddDocForm.reqId} onChange={e=>setComplianceAddDocForm(f=>({...f, reqId:e.target.value}))}
                                    style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13, outline:"none", color:C.txt }}>
                                    <option value="">-- Select requirement --</option>
                                    {missing.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    <option value="custom">Other (Custom Name)</option>
                                  </select>
                                </div>
                                {complianceAddDocForm.reqId === "custom" && (
                                  <div style={{ animation:"fadeIn .2s" }}>
                                    <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6, letterSpacing:.4 }}>CUSTOM NAME</label>
                                    <input placeholder="e.g. Visa Copy..."
                                      value={complianceAddDocForm.customName||""}
                                      onChange={e=>setComplianceAddDocForm(f=>({...f, customName:e.target.value}))}
                                      style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13, boxSizing:"border-box", outline:"none" }} />
                                  </div>
                                )}
                                
                                {/* Refined File Drop Zone */}
                                <div>
                                  <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6, letterSpacing:.4 }}>ATTACHMENT</label>
                                  <div style={{ position:"relative", border:\`1.5px dashed \${complianceAddDocForm.fileName ? C.p : '#cbd5e1'}\`, borderRadius:10, padding:"24px 16px", textAlign:"center", background: complianceAddDocForm.fileName ? \`rgba(var(--p-rgb),.04)\` : '#fdfdfd', transition:"all .2s", cursor:"pointer" }}
                                       onMouseEnter={e => !complianceAddDocForm.fileName && (e.currentTarget.style.background = \`rgba(var(--p-rgb),.02)\`)}
                                       onMouseLeave={e => !complianceAddDocForm.fileName && (e.currentTarget.style.background = '#fdfdfd')}
                                  >
                                    <input type="file" onChange={e => {
                                      const f = e.target.files?.[0];
                                      if (f) setComplianceAddDocForm(prev => ({ ...prev, fileName: f.name }));
                                    }} style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }} />
                                    {complianceAddDocForm.fileName ? (
                                      <div style={{ animation:"fadeIn .3s", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                                        <div style={{ width:40, height:40, borderRadius:"50%", background:\`rgba(var(--p-rgb),.1)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}>
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                                        </div>
                                        <div style={{ fontSize:13, fontWeight:600, color:C.p }}>{complianceAddDocForm.fileName}</div>
                                        <div style={{ fontSize:11, color:C.sub }}>Tap to replace file</div>
                                      </div>
                                    ) : (
                                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                                        <div style={{ width:40, height:40, borderRadius:"50%", background:C.surf, color:C.sub, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:2 }}>
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        </div>
                                        <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>Click to browse files</div>
                                        <div style={{ fontSize:11, color:C.sub }}>PDF, PNG, JPG (Max 5MB)</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:C.wht, borderRadius:8, border:\`1px solid \${C.bdr}\` }}>
                                  <input type="checkbox" id="verifiedCheck" checked={complianceAddDocForm.verified}
                                    onChange={e=>setComplianceAddDocForm(f=>({...f, verified:e.target.checked}))} 
                                    style={{ width:16, height:16, accentColor:C.p }} />
                                  <label htmlFor="verifiedCheck" style={{ fontSize:12, fontWeight:500, color:C.txt, cursor:"pointer", flex:1 }}>Mark doc as instantly verified</label>
                                </div>
                                <Btn style={{ width:"100%", padding:"12px", marginTop:4 }} onClick={() => {`;

hub = hub.replace(oldAddDocForm, newAddDocForm);

code = code.slice(0, si) + hub + code.slice(ei);
fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('Script applied.');
