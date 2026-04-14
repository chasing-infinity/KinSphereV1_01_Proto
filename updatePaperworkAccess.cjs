const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// 1. Update visiblePapers
code = code.replace(
  'const visiblePapers = canSeeAll ? papers : papers.filter(d => d.empId === ME_ID);',
  'const visiblePapers = canSeeAll ? papers : papers.filter(d => d.empId === ME_ID || (d.sharedWith && d.sharedWith.includes(ME_ID)));'
);

// 2. Add an IconLink (Add Access icon)
const iconLinkStr = `const IconLink = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;`;
code = code.replace('const IconShield = ', iconLinkStr + '\n          const IconShield = ');

// 3. Add the 'Add Access' button to row actions
// The button should be shown for all users who already have access (if they see it, they can share it) or just Super Admins.
// Let's allow anyone who can see it to share it, or to be safe, if we just let them click it.
const addAccessButtonStr = `{canGenerate && <button onClick={() => setShareDocAccess(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }} title="Give someone access to this document">{IconLink}</button>}\n                                      `;

code = code.replace(
  '<button onClick={() => setViewingDoc(doc)}',
  addAccessButtonStr + '<button onClick={() => setViewingDoc(doc)}'
);
// replace multiple occurrences if needed
code = code.replace(
  '<button onClick={() => setViewingDoc(doc)}',
  addAccessButtonStr + '<button onClick={() => setViewingDoc(doc)}'
);
code = code.replace(
  '<button onClick={() => setViewingDoc(doc)}',
  addAccessButtonStr + '<button onClick={() => setViewingDoc(doc)}'
);

// 4. Add the Modal for 'Add Access'
const modalCode = `              {/* Add Access Modal */}
              {shareDocAccess && (
                <Modal title="Give Access" onClose={() => setShareDocAccess(null)} width={400}>
                  <div style={{ padding:24 }}>
                    <p style={{ margin:"0 0 16px", fontSize:14, color:C.sub, lineHeight:1.5 }}>
                      Select an employee to give them viewing access to <strong style={{ color:C.txt }}>{shareDocAccess.name}</strong>.
                    </p>
                    <div style={{ marginBottom:20 }}>
                      <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:8 }}>SELECT EMPLOYEE</label>
                      <select id="shareEmpSelect" style={{ width:"100%", padding:10, borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.surf, fontSize:13 }}>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
                      </select>
                    </div>
                    <div style={{ display:"flex", justifyContent:"flex-end", gap:12 }}>
                      <Btn variant="outline" onClick={() => setShareDocAccess(null)}>Cancel</Btn>
                      <Btn onClick={() => {
                        const sel = document.getElementById("shareEmpSelect").value;
                        if(sel) {
                          const numId = Number(sel);
                          setPapers(papers.map(p => {
                            if (p.id === shareDocAccess.id) {
                              const existingShares = p.sharedWith || [];
                              if (!existingShares.includes(numId)) {
                                return { ...p, sharedWith: [...existingShares, numId] };
                              }
                            }
                            return p;
                          }));
                          toast(\`Access granted successfully\`);
                          setShareDocAccess(null);
                        }
                      }}>Grant Access</Btn>
                    </div>
                  </div>
                </Modal>
              )}

              {/* Preview Modal */}`;

code = code.replace('              {/* Preview Modal */}', modalCode);

fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('Successfully injected Add Access functionality!');
