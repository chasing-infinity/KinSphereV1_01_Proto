const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// ── Find the old compliance block ──
const OLD_COMPLIANCE_START = `              {/* ── Tab Content: Compliance ── */}
              {currentTab === "Compliance" && isSA && (`;
const OLD_COMPLIANCE_END = `              {/* Add Access Modal */}`;

const si = code.indexOf(OLD_COMPLIANCE_START);
const ei = code.indexOf(OLD_COMPLIANCE_END, si);
if (si === -1 || ei === -1) { console.error("Markers not found", si, ei); process.exit(1); }

// ── The new compliance block ──
const NEW_COMPLIANCE = `              {/* ── Tab Content: Compliance ── */}
              {currentTab === "Compliance" && isSA && (() => {
                // Build live compliance rows from employees + configurable reqs
                const compRows = employees.map(emp => {
                  const empDocs = emp.documents || [];
                  const submitted = complianceReqs.filter(r =>
                    empDocs.some(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim().toLowerCase()))
                  );
                  const missing = complianceReqs.filter(r =>
                    !empDocs.some(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim().toLowerCase()))
                  );
                  const stat = missing.length === 0 ? "Complete" : submitted.length === 0 ? "Overdue" : "Pending";
                  return { emp, req: complianceReqs.length, submitted, missing, stat };
                });

                return (
                  <div style={{ animation:"fadeIn 0.3s" }}>
                    {/* KPI Cards */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20, marginBottom:30 }}>
                      <Card style={{ padding:20, borderLeft:\`4px solid \${C.p}\` }}>
                        <div style={{ fontSize:11, color:C.sub, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Fully Compliant</div>
                        <div style={{ fontSize:32, fontWeight:700, marginTop:6, color:C.txt }}>{compRows.filter(r=>r.stat==="Complete").length}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>of {employees.length} employees</div>
                      </Card>
                      <Card style={{ padding:20, borderLeft:\`4px solid #f59e0b\` }}>
                        <div style={{ fontSize:11, color:C.sub, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Documents Missing</div>
                        <div style={{ fontSize:32, fontWeight:700, marginTop:6, color:"#d97706" }}>{compRows.reduce((acc,r)=>acc+r.missing.length,0)}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>across all employees</div>
                      </Card>
                      <Card style={{ padding:20, borderLeft:\`4px solid #dc2626\` }}>
                        <div style={{ fontSize:11, color:C.sub, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Overdue (0 docs)</div>
                        <div style={{ fontSize:32, fontWeight:700, marginTop:6, color:"#dc2626" }}>{compRows.filter(r=>r.stat==="Overdue").length}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>employees</div>
                      </Card>
                    </div>

                    {/* Table */}
                    <div style={{ background:C.wht, borderRadius:14, border:\`1px solid \${C.bdr}\`, overflow:"hidden" }}>
                      <div style={{ padding:"16px 20px", borderBottom:\`1px solid \${C.bdr}\`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ fontWeight:700, fontSize:14, display:"flex", gap:8, alignItems:"center" }}>
                          {IconShield} Workforce Compliance Status
                        </div>
                        <Btn variant="outline" style={{ fontSize:11, padding:"6px 14px" }} onClick={() => setShowComplianceSetup(true)}>
                          Setup Requirements
                        </Btn>
                      </div>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead>
                          <tr style={{ background:C.surf }}>
                            {["Employee", "Required", "Submitted", "Missing", "Status", ""].map(h => (
                              <th key={h} style={{ padding:"12px 20px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:11, letterSpacing:.5, borderBottom:\`1px solid \${C.bdr}\` }}>{h.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {compRows.map((row, i) => (
                            <tr key={i} onClick={() => setComplianceEmpDetail({ emp: row.emp, mode:"overview" })}
                              style={{ borderBottom:\`1px solid \${C.surf}\`, cursor:"pointer", transition:"background .15s" }}
                              onMouseEnter={e=>e.currentTarget.style.background=C.surf}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <td style={{ padding:"14px 20px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <Av ini={row.emp.ini} sz={30} />
                                  <div>
                                    <div style={{ fontWeight:600 }}>{row.emp.name}</div>
                                    <div style={{ fontSize:11, color:C.sub }}>{row.emp.dept} · {row.emp.designation}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding:"14px 20px" }}>
                                <span style={{ fontWeight:600, color:C.txt }}>{row.req}</span>
                              </td>
                              <td style={{ padding:"14px 20px" }}>
                                <button onClick={ev=>{ ev.stopPropagation(); setComplianceDocFilter({ emp: row.emp, type:"submitted" }); }}
                                  style={{ fontWeight:700, color:"#15803d", background:"#dcfce7", border:"none", borderRadius:6, padding:"3px 10px", cursor:"pointer", fontSize:13 }}>
                                  {row.submitted.length}
                                </button>
                              </td>
                              <td style={{ padding:"14px 20px" }}>
                                <button onClick={ev=>{ ev.stopPropagation(); setComplianceDocFilter({ emp: row.emp, type:"missing" }); }}
                                  style={{ fontWeight:700, color: row.missing.length>0?"#dc2626":C.sub, background: row.missing.length>0?"#fee2e2":C.surf, border:"none", borderRadius:6, padding:"3px 10px", cursor: row.missing.length>0?"pointer":"default", fontSize:13 }}>
                                  {row.missing.length}
                                </button>
                              </td>
                              <td style={{ padding:"14px 20px" }}>
                                {row.stat === "Complete" ? (
                                  <span style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", padding:"4px 12px", borderRadius:99 }}>COMPLETE</span>
                                ) : row.stat === "Overdue" ? (
                                  <span style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fee2e2", padding:"4px 12px", borderRadius:99 }}>OVERDUE</span>
                                ) : (
                                  <span style={{ fontSize:11, fontWeight:700, color:"#d97706", background:"#fef3c7", padding:"4px 12px", borderRadius:99 }}>PENDING</span>
                                )}
                              </td>
                              <td style={{ padding:"14px 20px", textAlign:"right" }}>
                                <button onClick={ev=>{ ev.stopPropagation(); setComplianceEmpDetail({ emp: row.emp, mode:"add" }); }}
                                  style={{ background:C.txt, color:C.surf, border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                                  + Add Doc
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ── Setup Requirements Modal ── */}
                    {showComplianceSetup && (
                      <Modal title="Setup Document Requirements" onClose={() => setShowComplianceSetup(false)} width={520}>
                        <div style={{ padding:"16px 24px 24px" }}>
                          <p style={{ fontSize:13, color:C.sub, margin:"0 0 20px" }}>
                            Define what documents are required from all employees. These will be tracked in the compliance dashboard.
                          </p>
                          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                            {complianceReqs.map(req => (
                              <div key={req.id} style={{ display:"flex", alignItems:"center", gap:10, background:C.surf, padding:"10px 14px", borderRadius:10, border:\`1px solid \${C.bdr}\` }}>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontWeight:600, fontSize:13 }}>{req.name}</div>
                                  <div style={{ fontSize:11, color:C.sub }}>{req.cat}</div>
                                </div>
                                <button onClick={() => setComplianceReqs(prev => prev.filter(r => r.id !== req.id))}
                                  style={{ background:"none", border:\`1px solid rgba(220,38,38,.25)\`, borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:600, color:"#dc2626", cursor:"pointer" }}>
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <div style={{ borderTop:\`1px solid \${C.bdr}\`, paddingTop:16 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:C.sub, marginBottom:10 }}>ADD NEW REQUIREMENT</div>
                            <div style={{ display:"flex", gap:10 }}>
                              <input value={complianceSetupForm.name} onChange={e=>setComplianceSetupForm(f=>({...f, name:e.target.value}))}
                                placeholder="e.g. Passport, Work Permit..."
                                style={{ flex:1, padding:"9px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13 }} />
                              <select value={complianceSetupForm.cat} onChange={e=>setComplianceSetupForm(f=>({...f, cat:e.target.value}))}
                                style={{ padding:"9px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13 }}>
                                <option>Identity</option>
                                <option>Financial</option>
                                <option>Legal</option>
                                <option>Other</option>
                              </select>
                              <Btn onClick={() => {
                                if (!complianceSetupForm.name.trim()) return toast("Enter a document name");
                                setComplianceReqs(prev => [...prev, { id:"r"+Date.now(), name:complianceSetupForm.name.trim(), cat:complianceSetupForm.cat }]);
                                setComplianceSetupForm({ name:"", cat:"Identity" });
                                toast("Requirement added");
                              }}>Add</Btn>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    )}

                    {/* ── Employee Detail / Add Doc Modal ── */}
                    {complianceEmpDetail && (() => {
                      const { emp, mode } = complianceEmpDetail;
                      const empDocs = emp.documents || [];
                      const latestEmp = employees.find(e => e.id === emp.id) || emp;
                      const latestDocs = latestEmp.documents || [];
                      const submitted = complianceReqs.filter(r =>
                        latestDocs.some(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim()))
                      );
                      const missing = complianceReqs.filter(r =>
                        !latestDocs.some(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim()))
                      );

                      return (
                        <Modal title={\`\${emp.name} — Documents\`} onClose={() => { setComplianceEmpDetail(null); setComplianceAddDocForm({ reqId:"", verified:true }); }} width={520}>
                          <div style={{ padding:"16px 24px 24px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, padding:"14px 16px", background:C.surf, borderRadius:10 }}>
                              <Av ini={emp.ini} sz={36} />
                              <div>
                                <div style={{ fontWeight:700, fontSize:15 }}>{emp.name}</div>
                                <div style={{ fontSize:12, color:C.sub }}>{emp.designation} · {emp.dept}</div>
                              </div>
                            </div>

                            {/* Submitted */}
                            <div style={{ marginBottom:20 }}>
                              <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:10 }}>SUBMITTED DOCUMENTS ({submitted.length}/{complianceReqs.length})</div>
                              {submitted.length === 0 ? (
                                <div style={{ fontSize:13, color:C.sub, fontStyle:"italic" }}>None submitted yet.</div>
                              ) : submitted.map(r => {
                                const docEntry = latestDocs.find(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim()));
                                return (
                                  <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#f0fdf4", borderRadius:8, border:"1px solid #bbf7d0", marginBottom:6 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                    <div style={{ flex:1 }}>
                                      <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                                      <div style={{ fontSize:11, color:"#15803d" }}>{docEntry?.v ? "Verified" : "Uploaded — Pending Verification"}</div>
                                    </div>
                                    {!docEntry?.v && (
                                      <button onClick={() => {
                                        setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, documents: e.documents.map(d => d.n === docEntry.n ? {...d, v:true} : d) } : e));
                                        toast("Document verified ✓");
                                      }} style={{ fontSize:11, fontWeight:700, padding:"4px 10px", background:"#15803d", color:"#fff", border:"none", borderRadius:6, cursor:"pointer" }}>Verify</button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Missing */}
                            {missing.length > 0 && (
                              <div style={{ marginBottom:20 }}>
                                <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:10 }}>MISSING DOCUMENTS ({missing.length})</div>
                                {missing.map(r => (
                                  <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#fff7ed", borderRadius:8, border:"1px solid #fed7aa", marginBottom:6 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    <div style={{ flex:1, fontWeight:600, fontSize:13, color:"#92400e" }}>{r.name}</div>
                                    <span style={{ fontSize:11, color:"#d97706" }}>{r.cat}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Document for this Employee */}
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
                            </div>
                          </div>
                        </Modal>
                      );
                    })()}

                    {/* ── Doc Filter Modal (Submitted / Missing click) ── */}
                    {complianceDocFilter && (() => {
                      const { emp, type } = complianceDocFilter;
                      const latestEmp = employees.find(e => e.id === emp.id) || emp;
                      const latestDocs = latestEmp.documents || [];
                      const submitted = complianceReqs.filter(r => latestDocs.some(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim())));
                      const missing = complianceReqs.filter(r => !latestDocs.some(d => d.n.toLowerCase().includes(r.name.toLowerCase().split('/')[0].trim())));
                      const docs = type === "submitted" ? submitted : missing;

                      return (
                        <Modal title={\`\${emp.name} — \${type === "submitted" ? "Submitted Documents" : "Missing Documents"}\`}
                          onClose={() => setComplianceDocFilter(null)} width={440}>
                          <div style={{ padding:"16px 24px 24px" }}>
                            {docs.length === 0 ? (
                              <div style={{ color:C.sub, fontSize:13 }}>
                                {type === "submitted" ? "No documents submitted yet." : "All documents are submitted!"}
                              </div>
                            ) : docs.map(r => (
                              <div key={r.id} style={{
                                display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                                background: type==="submitted" ? "#f0fdf4" : "#fff7ed",
                                border: \`1px solid \${type==="submitted" ? "#bbf7d0" : "#fed7aa"}\`,
                                borderRadius:10, marginBottom:8
                              }}>
                                {type === "submitted"
                                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                }
                                <div>
                                  <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                                  <div style={{ fontSize:11, color:C.sub }}>{r.cat}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Modal>
                      );
                    })()}
                  </div>
                );
              })()}

              `;

code = code.slice(0, si) + NEW_COMPLIANCE + code.slice(ei);
fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('Compliance tab rebuilt successfully.');
