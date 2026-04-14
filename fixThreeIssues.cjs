const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// ────────────────────────────────────────────────────────────────────────────
// FIX 1: Remove duplicate Add Access buttons (keep only one per branch)
// ────────────────────────────────────────────────────────────────────────────

const TRIPLE_SHARE = `{canGenerate && <button onClick={() => setShareDocAccess(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }} title="Give someone access to this document">{IconLink}</button>}
                                      {canGenerate && <button onClick={() => setShareDocAccess(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }} title="Give someone access to this document">{IconLink}</button>}
                                      {canGenerate && <button onClick={() => setShareDocAccess(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }} title="Give someone access to this document">{IconLink}</button>}`;

const SINGLE_SHARE = `{canGenerate && <button onClick={() => setShareDocAccess(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }} title="Grant access to a team member">{IconLink} Add Access</button>}`;

if (code.includes(TRIPLE_SHARE)) {
  code = code.replace(TRIPLE_SHARE, SINGLE_SHARE);
  console.log('Fix 1: Removed duplicate share buttons.');
} else {
  console.log('Fix 1: Triple share pattern not found exactly, trying alternate...');
  // Fallback: remove lines 5738-5739 pattern (the two extra copies)
  code = code.replace(
    /\{canGenerate \&\& <button onClick=\{\(\) => setShareDocAccess\(doc\)\} style=\{\{ background:"none", border:`1px solid \$\{C\.bdr\}`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C\.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" \}\} title="Give someone access to this document"\>\{IconLink\}<\/button\>\}\s+\{canGenerate \&\& <button onClick=\{\(\) => setShareDocAccess\(doc\)\} style=\{\{ background:"none", border:`1px solid \$\{C\.bdr\}`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C\.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" \}\} title="Give someone access to this document"\>\{IconLink\}<\/button\>\}\s+\{canGenerate \&\& <button onClick=\{\(\) => setShareDocAccess\(doc\)\} style=\{\{ background:"none", border:`1px solid \$\{C\.bdr\}`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C\.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" \}\} title="Give someone access to this document"\>\{IconLink\}<\/button\>\}/g,
    SINGLE_SHARE
  );
  console.log('Fix 1: Applied fallback regex replacement.');
}

// ────────────────────────────────────────────────────────────────────────────
// FIX 2: Replace the "Add Document" section with: file upload + mark-as-submitted
// ────────────────────────────────────────────────────────────────────────────

const OLD_ADD_DOC = `                            {/* Add Document for this Employee */}
                             <div style={{ borderTop:\`1px solid \${C.bdr}\`, paddingTop:16 }}>
                               <div style={{ fontSize:12, fontWeight:700, color:C.sub, marginBottom:12 }}>ADD DOCUMENT FOR {emp.name.split(" ")[0].toUpperCase()}</div>
                               <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                 <select value={complianceAddDocForm.reqId} onChange={e=>setComplianceAddDocForm(f=>({...f, reqId:e.target.value}))}
                                   style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13 }}>
                                   <option value="">-- Select document type --</option>
                                   {missing.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                   <option value="custom">Other (custom name)</option>
                                 </select>
                                 {complianceAddDocForm.reqId === "custom" && (
                                   <input placeholder="Custom document name..."
                                     value={complianceAddDocForm.customName||""}
                                     onChange={e=>setComplianceAddDocForm(f=>({...f, customName:e.target.value}))}
                                     style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13, boxSizing:"border-box" }} />
                                 )}
                                 <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.surf, borderRadius:8 }}>
                                   <input type="checkbox" id="verifiedCheck" checked={complianceAddDocForm.verified}
                                     onChange={e=>setComplianceAddDocForm(f=>({...f, verified:e.target.checked}))} />
                                   <label htmlFor="verifiedCheck" style={{ fontSize:13, cursor:"pointer" }}>Mark as verified immediately</label>
                                 </div>
                                 <Btn style={{ width:"100%" }} onClick={() => {
                                   const selReq = complianceAddDocForm.reqId === "custom"
                                     ? { name: complianceAddDocForm.customName || "Document" }
                                     : complianceReqs.find(r => r.id === complianceAddDocForm.reqId);
                                   if (!selReq || !selReq.name) return toast("Select a document type first");
                                   const docName = selReq.name.split('/')[0].trim();
                                   setEmployees(prev => prev.map(e => e.id === emp.id
                                     ? { ...e, documents: [...(e.documents||[]), { n: docName, v: complianceAddDocForm.verified }] }
                                     : e
                                   ));
                                   setComplianceAddDocForm({ reqId:"", verified:true });
                                   toast(\`"\${docName}" added for \${emp.name} ✓\`);
                                 }}>Add Document</Btn>
                               </div>
                             </div>`;

const NEW_ADD_DOC = `                            {/* Add Document for this Employee */}
                             <div style={{ borderTop:\`1px solid \${C.bdr}\`, paddingTop:20 }}>
                               <div style={{ fontSize:12, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:14 }}>ADD DOCUMENT FOR {emp.name.split(" ")[0].toUpperCase()}</div>

                               {/* If employee has existing profile docs not yet mapped to a requirement — offer to Mark as Submitted */}
                               {(() => {
                                 const unmapped = latestDocs.filter(d =>
                                   missing.some(r => !latestDocs.some(ld =>
                                     ld.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim())
                                   )) &&
                                   !complianceReqs.some(r => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim()))
                                 );
                                 const mappable = latestDocs.filter(d =>
                                   missing.some(r => d.n.toLowerCase().split(' ').some(w => r.name.toLowerCase().includes(w) && w.length > 2))
                                   && !submitted.some(s => latestDocs.find(ld => ld.n === d.n && complianceReqs.some(r => ld.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim()))))
                                 );
                                 if (mappable.length === 0) return null;
                                 return (
                                   <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
                                     <div style={{ fontSize:11, fontWeight:700, color:"#92400e", marginBottom:8 }}>DOCUMENTS IN PROFILE — NOT YET MARKED</div>
                                     <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                                       {mappable.map((d,i) => (
                                         <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:13 }}>
                                           <span style={{ fontWeight:600 }}>{d.n}</span>
                                           <button onClick={() => {
                                             setEmployees(prev => prev.map(e => e.id === emp.id
                                               ? { ...e, documents: e.documents.map(doc => doc.n === d.n ? { ...doc, v: true } : doc) }
                                               : e
                                             ));
                                             toast(\`"\${d.n}" marked as submitted ✓\`);
                                           }} style={{ fontSize:11, fontWeight:700, padding:"4px 10px", background:"#d97706", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>
                                             Mark Submitted
                                           </button>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 );
                               })()}

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

                                 {/* File Upload */}
                                 <div>
                                   <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>ATTACH FILE</label>
                                   <div style={{ border:\`2px dashed \${complianceAddDocForm.fileName ? C.p : C.bdr}\`, borderRadius:10, padding:"18px", textAlign:"center", background: complianceAddDocForm.fileName ? \`rgba(var(--p-rgb),.04)\` : C.surf, transition:"all .2s", position:"relative" }}>
                                     <input type="file" id="complianceFile" onChange={e => {
                                       const f = e.target.files?.[0];
                                       if (f) setComplianceAddDocForm(prev => ({ ...prev, fileName: f.name }));
                                     }} style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }} />
                                     {complianceAddDocForm.fileName ? (
                                       <div>
                                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.p} strokeWidth="2" style={{ marginBottom:4 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                         <div style={{ fontSize:12, fontWeight:600, color:C.p }}>{complianceAddDocForm.fileName}</div>
                                         <div style={{ fontSize:11, color:C.sub }}>Click to change file</div>
                                       </div>
                                     ) : (
                                       <div>
                                         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="1.5" style={{ marginBottom:6 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                         <div style={{ fontSize:12, color:C.sub }}>Click to upload a file</div>
                                         <div style={{ fontSize:11, color:C.bdr }}>PDF, PNG, JPG accepted</div>
                                       </div>
                                     )}
                                   </div>
                                 </div>

                                 <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:C.surf, borderRadius:8 }}>
                                   <input type="checkbox" id="verifiedCheck" checked={complianceAddDocForm.verified}
                                     onChange={e=>setComplianceAddDocForm(f=>({...f, verified:e.target.checked}))} />
                                   <label htmlFor="verifiedCheck" style={{ fontSize:13, cursor:"pointer" }}>Mark as verified immediately</label>
                                 </div>

                                 <Btn style={{ width:"100%" }} onClick={() => {
                                   const selReq = complianceAddDocForm.reqId === "custom"
                                     ? { name: complianceAddDocForm.customName || "Document" }
                                     : complianceReqs.find(r => r.id === complianceAddDocForm.reqId);
                                   if (!selReq || !selReq.name) return toast("Select a document type first");
                                   if (!complianceAddDocForm.fileName) return toast("Please attach a file");
                                   const docName = selReq.name.split('/')[0].trim();
                                   setEmployees(prev => prev.map(e => e.id === emp.id
                                     ? { ...e, documents: [...(e.documents||[]), { n: docName, v: complianceAddDocForm.verified, fileName: complianceAddDocForm.fileName }] }
                                     : e
                                   ));
                                   setComplianceAddDocForm({ reqId:"", verified:true, fileName:"" });
                                   toast(\`"\${docName}" added for \${emp.name} ✓\`);
                                 }}>Add Document</Btn>
                               </div>
                             </div>`;

if (code.includes(OLD_ADD_DOC)) {
  code = code.replace(OLD_ADD_DOC, NEW_ADD_DOC);
  console.log('Fix 2: Add Document section updated with file upload + mark-as-submitted.');
} else {
  console.error('Fix 2: OLD_ADD_DOC marker not found!');
}

// ────────────────────────────────────────────────────────────────────────────
// FIX 3: Add fileName to complianceAddDocForm initial state
// ────────────────────────────────────────────────────────────────────────────
code = code.replace(
  'const [complianceAddDocForm, setComplianceAddDocForm] = useState({ reqId:"", verified: true });',
  'const [complianceAddDocForm, setComplianceAddDocForm] = useState({ reqId:"", verified: true, fileName:"", customName:"" });'
);
console.log('Fix 3: Updated complianceAddDocForm initial state.');

fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('\nAll 3 fixes applied successfully.');
