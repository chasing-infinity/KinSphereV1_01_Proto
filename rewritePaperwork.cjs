const fs = require('fs');
let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

const startStr = '{/* ─ PAPERWORK HUB ─ */}';
const endStr = '{/* ─ RECOGNITION ─ */}';
const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find boundaries');
  process.exit(1);
}

const UI_CODE = `        {/* ─ PAPERWORK HUB ─ */}
        {page==="Paperwork Hub" && (() => {
          const canGenerate = isSA;
          const canSeeAll   = isSA;
          const currentTab = ["Documents", "Templates", "Compliance", "Generate"].includes(paperTab) ? paperTab : "Documents";

          const visiblePapers = canSeeAll ? papers : papers.filter(d => d.empId === ME_ID);
          const filteredPapers = paperFilter === "All" ? visiblePapers : visiblePapers.filter(d => d.type === paperFilter);
          const srchPapers = filteredPapers.filter(d => d.name.toLowerCase().includes(empSearch.toLowerCase()) || 
             (d.empId && employees.find(e=>e.id===d.empId)?.name.toLowerCase().includes(empSearch.toLowerCase())));

          // Mock compliance data based on employees
          const complianceList = employees.map(e => {
            const hasAadhaar = papers.some(p => p.empId === e.id && p.name.includes("Aadhaar"));
            const hasPAN = papers.some(p => p.empId === e.id && p.name.includes("PAN"));
            const hasOffer = papers.some(p => p.empId === e.id && p.type === "Offer Letter" && p.status==="signed");
            let req = 3, sub = 0;
            if (hasAadhaar) sub++;
            if (hasPAN) sub++;
            if (hasOffer) sub++;
            let stat = sub === req ? "Complete" : sub === 0 ? "Overdue" : "Pending";
            return { emp: e, req, sub, stat, missing: req - sub };
          });

          // SVG Icons
          const IconDoc = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
          const IconSend = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
          const IconEye = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
          const IconTpl = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
          const IconShield = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
          const IconClock = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

          return (
            <div style={{ padding:\`0 \${pad}px \${padBottom}px\`, width:"100%", maxWidth:"1200px", margin:"0 auto" }}>
              {/* ── Tabs & Header ── */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:30, paddingBottom:20, borderBottom:\`1px solid \${C.bdr}\` }}>
                <div>
                  <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:C.txt, margin:"0 0 8px", fontWeight:700 }}>Paperwork Hub</h1>
                  <p style={{ color:C.sub, fontSize:14, margin:0 }}>Manage documents, templates, e-signatures, and compliance.</p>
                </div>
                <div style={{ display:"flex", background:C.surf, borderRadius:12, padding:4, border:\`1px solid \${C.bdr}\` }}>
                  {["Documents", "Templates", "Compliance"].map(t => (
                    (!canGenerate && t !== "Documents" && t !== "Compliance") ? null :
                    <button key={t} onClick={() => { setPaperTab(t); if(t==="Templates") setGenStep(1); }} 
                      style={{ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
                      background: (currentTab===t || (t==="Templates" && currentTab==="Generate")) ? C.wht : "transparent",
                      color: (currentTab===t || (t==="Templates" && currentTab==="Generate")) ? C.p : C.sub,
                      boxShadow: (currentTab===t || (t==="Templates" && currentTab==="Generate")) ? "0 2px 8px rgba(0,0,0,.04)" : "none",
                      transition:"all .2s" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tab Content: Documents ── */}
              {currentTab === "Documents" && (
                <div style={{ animation:"fadeIn 0.3s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, gap:12, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                      <input 
                        type="text" placeholder="Search document or employee..." 
                        value={empSearch} onChange={e=>setEmpSearch(e.target.value)}
                        style={{ padding:"8px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.wht, fontSize:13, width:240 }}
                      />
                      {["All", "Offer Letter", "Appointment Letter", "Payslip", "NDA", "Other"].map(f => (
                        <button key={f} onClick={() => setPaperFilter(f)} style={{ padding:"6px 14px", borderRadius:20, border:\`1px solid \${paperFilter === f ? C.p : C.bdr}\`, background: paperFilter === f ? \`rgba(var(--p-rgb),.05)\` : C.wht, color: paperFilter === f ? C.p : C.sub, fontSize:11, fontWeight:600, cursor:"pointer" }}>{f}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ background:C.wht, borderRadius:14, border:\`1px solid \${C.bdr}\`, overflow:"hidden", boxShadow:"0 2px 12px rgba(var(--shadow-rgb),.03)" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:C.surf }}>
                          {["Document Name", "Recipient", "Type", "Status", "Sent On", "Activity"].map((h, i) => (
                            <th key={h} style={{ padding:"12px 16px", textAlign: i===5 ? "right" : "left", color:C.sub, fontWeight:700, fontSize:11, letterSpacing:.5, borderBottom:\`1px solid \${C.bdr}\` }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {srchPapers.map((doc) => {
                          const docEmp = employees.find(e => e.id === doc.empId);
                          const isSigned = doc.status === "signed";
                          const isSent = doc.status === "sent";
                          return (
                            <tr key={doc.id} style={{ borderBottom:\`1px solid \${C.surf}\` }}>
                              <td style={{ padding:"14px 16px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <div style={{ color:C.p }}>{IconDoc}</div>
                                  <div>
                                    <div style={{ fontWeight:600, color:C.txt, cursor:"pointer" }} onClick={() => setViewingDoc(doc)}>{doc.name}</div>
                                    <div style={{ fontSize:11, color:C.sub }}>{doc.fileName || "Generated.pdf"}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                {docEmp ? (
                                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <Av ini={docEmp.ini} sz={24} />
                                    <span style={{ fontSize:12, fontWeight:500 }}>{docEmp.name}</span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize:12, color:C.sub }}>External</span>
                                )}
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                <span style={{ fontSize:11, color:C.sub, background:C.surf, padding:"4px 8px", borderRadius:6, border:\`1px solid \${C.bdr}\` }}>{doc.type}</span>
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                {isSigned ? (
                                  <span style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", padding:"4px 10px", borderRadius:99, display:"inline-flex", gap:4, alignItems:"center" }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> SIGNED
                                  </span>
                                ) : isSent ? (
                                  <span style={{ fontSize:11, fontWeight:700, color:C.p, background:\`rgba(var(--p-rgb),.1)\`, padding:"4px 10px", borderRadius:99 }}>SENT</span>
                                ) : (
                                  <span style={{ fontSize:11, fontWeight:700, color:C.sub, background:C.surf, padding:"4px 10px", borderRadius:99, border:\`1px solid \${C.bdr}\` }}>DRAFT</span>
                                )}
                              </td>
                              <td style={{ padding:"14px 16px", fontSize:12, color:C.sub }}>
                                {doc.date}
                              </td>
                              <td style={{ padding:"14px 16px", textAlign:"right" }}>
                                <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                                  {isSigned ? (
                                    <>
                                      <button onClick={() => setViewingDoc(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, color:C.txt, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }}>{IconEye} View</button>
                                      <button onClick={() => { toast(\`Downloading \${doc.name}.pdf...\`); }} style={{ background:\`rgba(var(--p-rgb),.05)\`, border:\`1px solid rgba(var(--p-rgb),.2)\`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer" }}>↓ Download</button>
                                    </>
                                  ) : isSent ? (
                                    <>
                                      <button onClick={() => setViewingDoc(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, color:C.txt, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }}>{IconEye}</button>
                                      <button onClick={() => { toast("Recipient Simulated"); setSignId(doc.id); }} style={{ background:C.p, border:"none", borderRadius:8, padding:"6px 16px", fontSize:11, fontWeight:700, color:C.wht, cursor:"pointer" }}>Simulate Recipient</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => setViewingDoc(doc)} style={{ background:"none", border:\`1px solid \${C.bdr}\`, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:600, color:C.txt, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }}>{IconEye}</button>
                                      <button onClick={() => {
                                        setPapers(papers.map(p => p.id === doc.id ? { ...p, status:"sent" } : p));
                                        toast(\`Document sent successfully\`);
                                      }} style={{ background:C.txt, border:"none", borderRadius:8, padding:"6px 16px", fontSize:11, fontWeight:700, color:C.surf, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>{IconSend} Send</button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {srchPapers.length === 0 && (
                          <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:C.sub, fontSize:13 }}>No documents found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Tab Content: Templates ── */}
              {(currentTab === "Templates" || currentTab === "Generate") && isSA && (
                <div style={{ animation:"fadeIn 0.3s", maxWidth:1000, margin:"0 auto" }}>
                  
                  {/* Flow Steps */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, marginBottom:40 }}>
                    {[1,2,3].map(s => (
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:10, opacity: genStep >= s ? 1 : 0.3 }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background: genStep === s ? C.p : (genStep > s ? "transparent" : C.surf), border: genStep > s ? \`2px solid \${C.p}\` : "none", color: genStep === s ? C.wht : (genStep > s ? C.p : C.sub), display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>
                          {genStep > s ? "✓" : s}
                        </div>
                        <div style={{ fontSize:13, fontWeight:600, color: genStep === s ? C.txt : C.sub }}>{s===1?"Select Template":s===2?"Auto-fill Fields":"Dispatch"}</div>
                        {s < 3 && <div style={{ width:40, height:1, background:C.bdr }} />}
                      </div>
                    ))}
                  </div>

                  {genStep === 1 && (
                    <>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                        <h2 style={{ fontSize:18, margin:0, color:C.txt }}>Template Library</h2>
                        <Btn onClick={() => toast("Template builder coming soon!")}>+ Upload Template</Btn>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
                        {templates.map(tpl => {
                          const fieldCount = getPlaceholders(tpl.body).length;
                          return (
                            <Card key={tpl.id} onClick={() => { setGenTemplate(tpl); setGenStep(2); }} 
                              style={{ cursor:"pointer", transition:"all .2s", border:\`1px solid \${genTemplate?.id === tpl.id ? C.p : C.bdr}\`, padding:24 }}
                              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.06)"}
                              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                                <div style={{ width:40, height:40, borderRadius:8, background:\`rgba(var(--p-rgb),.08)\`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}>{IconTpl}</div>
                                <span style={{ fontSize:11, color:C.sub, background:C.surf, padding:"2px 8px", borderRadius:4 }}>{tpl.type}</span>
                              </div>
                              <div style={{ fontWeight:700, fontSize:16, color:C.txt, marginBottom:8 }}>{tpl.name}</div>
                              <div style={{ display:"flex", gap:16, fontSize:12, color:C.sub }}>
                                <span style={{ display:"flex", gap:4, alignItems:"center" }}>{IconEdit} {fieldCount} fields</span>
                                <span style={{ display:"flex", gap:4, alignItems:"center" }}>{IconClock} Updated recently</span>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {genStep === 2 && (
                    <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", gap:24, alignItems:"start" }}>
                      <Card style={{ padding:24 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.txt, marginBottom:20 }}>Recipient & Fields</div>
                        
                        <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:8 }}>SELECT RECIPIENT to AUTO-FILL</label>
                        <select 
                          style={{ width:"100%", padding:10, borderRadius:8, border:\`1px solid \${C.bdr}\`, marginBottom:20, background:C.wht, fontSize:13 }}
                          onChange={(e) => {
                            const emp = employees.find(em => em.id === Number(e.target.value));
                            if(emp) {
                              setGenVals({ EMPLOYEE_NAME: emp.name, SALARY: emp.salary, START_DATE: emp.joined, EMPLOYEE_ROLE: emp.designation });
                              setGenEmpId(emp.id);
                            }
                          }}
                        >
                          <option value="">-- Manual Entry --</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.dept})</option>)}
                        </select>

                        <div style={{ height:1, background:C.surf, margin:"20px 0" }} />

                        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                          {!genTemplate || getPlaceholders(genTemplate.body).length === 0 ? (
                             <div style={{ fontSize:13, color:C.sub }}>No dynamic fields.</div>
                          ) : getPlaceholders(genTemplate.body).map(field => (
                            <div key={field}>
                              <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>{field.toUpperCase().replace(/_/g, " ")}</label>
                              <input 
                                placeholder={\`Enter \${field.replace(/_/g, " ")}...\`}
                                value={genVals[field] || ""}
                                onChange={(e) => setGenVals({ ...genVals, [field]: e.target.value })}
                                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:\`1px solid \${C.bdr}\`, background:C.surf, fontSize:13 }}
                              />
                            </div>
                          ))}
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:30, paddingTop:20, borderTop:\`1px solid \${C.surf}\` }}>
                          <Btn variant="ghost" onClick={() => setGenStep(1)}>Back</Btn>
                          <Btn onClick={() => {
                            setGenFilledBody(fillTemplate(genTemplate.body, genVals));
                            setGenStep(3);
                          }}>Next: Dispatch →</Btn>
                        </div>
                      </Card>

                      <Card style={{ padding:40, borderStyle:"dashed", background:\`linear-gradient(to bottom, #fff 0%, \${C.bg} 100%)\` }}>
                         <div style={{ textAlign:"center", marginBottom:30 }}>
                           <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:2, marginBottom:4 }}>DOCUMENT PREVIEW</div>
                           <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:22 }}>{genTemplate?.name}</h2>
                         </div>
                         <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia, serif", fontSize:14, lineHeight:1.8, color:C.txt, margin:0 }}>
                           {fillTemplate(genTemplate.body, genVals)}
                         </pre>
                      </Card>
                    </div>
                  )}

                  {genStep === 3 && (
                    <Card style={{ padding:"40px 60px", textAlign:"center", maxWidth:600, margin:"0 auto" }}>
                      <div style={{ display:"inline-flex", padding:16, borderRadius:"50%", background:\`rgba(var(--p-rgb),.1)\`, color:C.p, marginBottom:20 }}>
                        {IconSend}
                      </div>
                      <h2 style={{ fontSize:24, fontFamily:"Georgia,serif", margin:"0 0 12px" }}>Ready to Dispatch</h2>
                      <p style={{ color:C.sub, fontSize:14, lineHeight:1.6, marginBottom:30 }}>
                        The document "{genTemplate?.name}" is ready to be finalized. 
                        It will be added to the Documents hub and tracked for signatures.
                      </p>
                      
                      <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
                        <Btn variant="outline" onClick={() => setGenStep(2)}>Review Fields</Btn>
                        <Btn onClick={() => {
                          const docId = papers.length + 100;
                          const newDoc = {
                            id: docId, name: genTemplate.name,
                            type: genTemplate.type,
                            status: "draft", date: "Just now",
                            empId: genEmpId || null,
                            filledBody: genFilledBody
                          };
                          setPapers([newDoc, ...papers]);
                          setPaperTab("Documents");
                          setGenStep(1);
                          setGenVals({});
                          setGenEmpId("");
                          toast("Document Generated Successfully ✓");
                        }}>Generate & Save to Hub</Btn>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* ── Tab Content: Compliance ── */}
              {currentTab === "Compliance" && isSA && (
                <div style={{ animation:"fadeIn 0.3s" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20, marginBottom:30 }}>
                    <Card style={{ padding:20, borderLeft:\`4px solid \${C.p}\` }}>
                      <div style={{ fontSize:12, color:C.sub, fontWeight:600, textTransform:"uppercase" }}>Fully Compliant</div>
                      <div style={{ fontSize:28, fontWeight:700, marginTop:4, color:C.txt }}>{complianceList.filter(c=>c.stat==="Complete").length}</div>
                    </Card>
                    <Card style={{ padding:20, borderLeft:\`4px solid #f59e0b\` }}>
                      <div style={{ fontSize:12, color:C.sub, fontWeight:600, textTransform:"uppercase" }}>Pending Items</div>
                      <div style={{ fontSize:28, fontWeight:700, marginTop:4, color:C.txt }}>{complianceList.filter(c=>c.stat!=="Complete").reduce((acc, c)=>acc+c.missing, 0)}</div>
                    </Card>
                    <Card style={{ padding:20, borderLeft:\`4px solid #dc2626\` }}>
                      <div style={{ fontSize:12, color:C.sub, fontWeight:600, textTransform:"uppercase" }}>Overdue Records</div>
                      <div style={{ fontSize:28, fontWeight:700, marginTop:4, color:C.txt }}>{complianceList.filter(c=>c.stat==="Overdue").length}</div>
                    </Card>
                  </div>

                  <div style={{ background:C.wht, borderRadius:14, border:\`1px solid \${C.bdr}\` }}>
                    <div style={{ padding:"16px 20px", borderBottom:\`1px solid \${C.bdr}\`, display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontWeight:700, display:"flex", gap:8, alignItems:"center" }}>{IconShield} Workforce Compliance Status</div>
                      <Btn variant="outline" style={{ fontSize:11, padding:"4px 12px" }}>Setup Requirements</Btn>
                    </div>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:C.surf }}>
                          {["Employee", "Required", "Submitted", "Missing", "Status"].map((h) => (
                            <th key={h} style={{ padding:"12px 20px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:11, borderBottom:\`1px solid \${C.bdr}\` }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {complianceList.map((c, i) => (
                          <tr key={i} style={{ borderBottom:\`1px solid \${C.surf}\` }}>
                            <td style={{ padding:"14px 20px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <Av ini={c.emp.ini} sz={28} />
                                <div>
                                  <div style={{ fontWeight:600 }}>{c.emp.name}</div>
                                  <div style={{ fontSize:11, color:C.sub }}>{c.emp.dept}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding:"14px 20px", color:C.txt, fontWeight:600 }}>{c.req}</td>
                            <td style={{ padding:"14px 20px", color:"#15803d", fontWeight:600 }}>{c.sub}</td>
                            <td style={{ padding:"14px 20px", color:c.missing>0?"#dc2626":C.sub, fontWeight:c.missing>0?700:400 }}>{c.missing}</td>
                            <td style={{ padding:"14px 20px" }}>
                              {c.stat === "Complete" ? (
                                <span style={{ fontSize:11, fontWeight:700, color:"#15803d", background:"#dcfce7", padding:"4px 10px", borderRadius:99 }}>COMPLETE</span>
                              ) : c.stat === "Overdue" ? (
                                <span style={{ fontSize:11, fontWeight:700, color:"#dc2626", background:"#fee2e2", padding:"4px 10px", borderRadius:99 }}>OVERDUE</span>
                              ) : (
                                <span style={{ fontSize:11, fontWeight:700, color:"#f59e0b", background:"#fef3c7", padding:"4px 10px", borderRadius:99 }}>PENDING</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Preview Modal */}
              {viewingDoc && (
                <Modal title="Document Viewer" onClose={() => setViewingDoc(null)} width={800}>
                  <div style={{ padding:20 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:20, borderBottom:\`1px solid \${C.surf}\` }}>
                      <div>
                        <h2 style={{ margin:"0 0 6px", fontFamily:"Georgia,serif", fontSize:24 }}>{viewingDoc.name}</h2>
                        <div style={{ display:"flex", gap:12, fontSize:13, color:C.sub, alignItems:"center" }}>
                          <span>Type: <strong style={{ color:C.txt }}>{viewingDoc.type}</strong></span>
                          <span>•</span>
                          <span>Recipient: <strong style={{ color:C.txt }}>{viewingDoc.empId ? employees.find(e=>e.id===viewingDoc.empId)?.name : "External"}</strong></span>
                        </div>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color: viewingDoc.status==="signed" ? "#15803d" : C.wht, background: viewingDoc.status==="signed" ? "#dcfce7" : C.txt, padding:"6px 14px", borderRadius:99 }}>
                        {viewingDoc.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ background:\`#f8fafc\`, padding:40, borderRadius:12, border:\`1px solid \${C.bdr}\`, minHeight:400, boxShadow:"inset 0 2px 10px rgba(0,0,0,0.02)" }}>
                      <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia, serif", fontSize:15, lineHeight:1.9, color:"#1e293b", margin:0, maxWidth:640, marginInline:"auto" }}>
                        {viewingDoc.filledBody || "This document content is securely stored. In a production environment, rendering actual PDF here."}
                      </pre>
                    </div>

                    <div style={{ marginTop:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:12, color:C.sub, display:"flex", gap:6, alignItems:"center" }}>{IconClock} Last activity: {viewingDoc.date}</div>
                      <div style={{ display:"flex", gap:12 }}>
                        <Btn variant="outline" onClick={() => setViewingDoc(null)}>Close</Btn>
                        {viewingDoc.status !== "signed" && (
                          <Btn onClick={() => setSignId(viewingDoc.id)}>Sign Document / Send</Btn>
                        )}
                        {viewingDoc.status === "signed" && (
                          <Btn onClick={() => toast("Securely downloading...")}>Download PDF</Btn>
                        )}
                      </div>
                    </div>
                  </div>
                </Modal>
              )}

            </div>
          );
        })}`;

code = code.slice(0, startIdx) + UI_CODE + code.slice(endIdx);
fs.writeFileSync('kinsphere_prototype.tsx', code, 'utf8');
console.log('Successfully rewrote Paperwork Hub block.');
