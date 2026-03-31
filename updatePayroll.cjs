const fs = require('fs');
const file = 'kinsphere_prototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `const PayrollWizardModal = ({ 
  onClose, saPayslips, employees, processedPayments, setProcessedPayments, 
  editedSalaries, setPaymentLogs, toast, parseInr, C, MONTHS_SHORT 
}) => {
  const currentYear = new Date().getFullYear();
  const [step, setStep] = useState(1);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive data
  const monthPayslips = saPayslips.filter(p => p.monthIndex === selectedMonthIndex && parseInt(p.year) === currentYear);
  const empStates = monthPayslips.map(p => {
    const emp = employees.find(e => e.id === p.empId);
    const hasBank = !!emp?.bankInfo?.accountNumber && !!emp?.bankInfo?.ifsc;
    const isPaid = !!processedPayments[p.id];
    return { p, emp, hasBank, isPaid };
  });

  const validUnpaid = empStates.filter(x => x.hasBank && !x.isPaid);
  const alreadyPaid = empStates.filter(x => x.isPaid);
  const missingBank = empStates.filter(x => !x.hasBank && !x.isPaid);

  const handleProceedToStep2 = () => {
    setSelectedIds(validUnpaid.map(x => x.p.id));
    setStep(2);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newProcessed = { ...processedPayments };
      let totalAmt = 0;
      selectedIds.forEach(id => {
        newProcessed[id] = true;
        const pState = validUnpaid.find(x => x.p.id === id);
        if (pState) totalAmt += parseInr(editedSalaries[id] || pState.p.net);
      });
      setProcessedPayments(newProcessed);
      setPaymentLogs(prev => [{
        ts: new Date().toLocaleString("en-IN"),
        actor: "Super Admin",
        monthYear: \\\`\\\${MONTHS_SHORT[selectedMonthIndex]} \\\${currentYear}\\\`,
        amount: \\\`₹\\\${totalAmt.toLocaleString("en-IN")}\\\`,
        count: selectedIds.length
      }, ...prev]);
      setIsProcessing(false);
      setStep(4);
    }, 2000);
  };

  if (step === 1) {
    return (
      <Modal title="Start Payroll" onClose={onClose} width={400}>
        <div style={{ padding: "10px 0 20px" }}>
          <p style={{ color:C.sub, fontSize:14, marginBottom:20 }}>Select the month for the current year (\\\${currentYear}) to process payroll.</p>
          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.6, marginBottom:8 }}>MONTH</div>
          <select 
            value={selectedMonthIndex} 
            onChange={e => setSelectedMonthIndex(Number(e.target.value))}
            style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:\\\`1px solid \\\${C.bdr}\\\`, background:C.surf, fontSize:15, color:C.txt, outline:"none" }}
          >
            {MONTHS_SHORT.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:32 }}>
             <Btn variant="ghost" onClick={onClose} style={{marginRight:12}}>Cancel</Btn>
             <Btn onClick={handleProceedToStep2} style={{ padding:"12px 24px", background:C.p, color:"#fff" }}>Continue</Btn>
          </div>
        </div>
      </Modal>
    );
  }

  if (step === 2) {
    return (
      <Modal title=\\\`Payroll: \\\${MONTHS_SHORT[selectedMonthIndex]} \\\${currentYear}\\\` onClose={onClose} width={700}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:C.txt, margin:0 }}>Select Employees to Pay</h3>
          {validUnpaid.length > 0 && (
            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:600, color:C.sub }}>
              <input 
                type="checkbox" 
                checked={selectedIds.length === validUnpaid.length} 
                onChange={e => setSelectedIds(e.target.checked ? validUnpaid.map(x => x.p.id) : [])}
                style={{ accentColor:C.p, transform:"scale(1.1)" }}
              />
              Select All Eligible
            </label>
          )}
        </div>
        
        <div style={{ maxHeight: 380, overflowY:"auto", borderRadius:12, border:\\\`1px solid \\\${C.bdr}\\\` }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
             <thead style={{ position:"sticky", top:0, background:C.surf, zIndex:1, borderBottom:\\\`1px solid \\\${C.bdr}\\\` }}>
                <tr>
                   <th style={{ padding:"12px", width:40, textAlign:"center" }}></th>
                   <th style={{ padding:"12px", textAlign:"left", color:C.sub, fontSize:10, fontWeight:700 }}>EMPLOYEE</th>
                   <th style={{ padding:"12px", textAlign:"left", color:C.sub, fontSize:10, fontWeight:700 }}>NET PAY</th>
                </tr>
             </thead>
             <tbody>
                {validUnpaid.map(({ p, emp }) => (
                  <tr key={p.id} style={{ borderBottom:\\\`1px solid \\\${C.surf}\\\` }}>
                     <td style={{ padding:"12px", textAlign:"center" }}>
                        <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} style={{ accentColor:C.p, transform:"scale(1.1)" }} />
                     </td>
                     <td style={{ padding:"12px", fontWeight:600 }}>{p.name}</td>
                     <td style={{ padding:"12px", fontWeight:700, color:C.txt }}>{editedSalaries[p.id] || p.net}</td>
                  </tr>
                ))}
                {validUnpaid.length === 0 && (
                  <tr><td colSpan={3} style={{ padding:"32px", textAlign:"center", color:C.sub }}>No eligible unpaid employees found for this month.</td></tr>
                )}
             </tbody>
          </table>
        </div>

        {missingBank.length > 0 && (
          <div style={{ marginTop:24 }}>
            <h4 style={{ fontSize:12, fontWeight:700, color:"#b91c1c", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Missing Bank Details (\\\${missingBank.length})</h4>
            <div style={{ background:"#fef2f2", padding:"12px 16px", borderRadius:10, border:"1px solid #fecaca" }}>
              <div style={{ fontSize:13, color:"#991b1b" }}>These employees cannot be paid until bank details are added:</div>
              <div style={{ fontSize:13, color:"#7f1d1d", fontWeight:600, marginTop:4 }}>
                {missingBank.map(x => x.p.name).join(", ")}
              </div>
            </div>
          </div>
        )}

        {alreadyPaid.length > 0 && (
          <div style={{ marginTop:24 }}>
            <h4 style={{ fontSize:12, fontWeight:700, color:"#16a34a", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Already Paid (\\\${alreadyPaid.length})</h4>
            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10 }}>
               {alreadyPaid.map(({ p }) => (
                  <div key={p.id} style={{ padding:"12px 16px", borderBottom:\\\`1px solid #dcfce7\\\`, display:"flex", justifyContent:"space-between", alignItems:"center", opacity:0.7 }}>
                     <span style={{ fontSize:13, fontWeight:600, color:"#166534" }}>{p.name}</span>
                     <span style={{ fontSize:13, fontWeight:700, color:"#15803d" }}>Processed: {editedSalaries[p.id] || p.net}</span>
                  </div>
               ))}
            </div>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:32, paddingTop:24, borderTop:\\\`1px solid \\\${C.bdr}\\\` }}>
           <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
           <Btn style={{ padding:"12px 28px", background:C.p, color:"#fff" }} disabled={selectedIds.length === 0} onClick={() => setStep(3)}>Review Payment Summary</Btn>
        </div>
      </Modal>
    );
  }

  if (step === 3) {
    const totalAmt = selectedIds.reduce((acc, id) => acc + parseInr(editedSalaries[id] || validUnpaid.find(x => x.p.id === id)?.p.net || "0"), 0);
    return (
      <Modal title="Payment Summary" onClose={onClose} width={500}>
        <div style={{ textAlign:"center", padding:"20px 0" }}>
           <div style={{ fontSize:48, marginBottom:16 }}>💳</div>
           <h2 style={{ fontSize:24, fontWeight:700, color:C.txt, margin:"0 0 8px" }}>Approve Payroll Release</h2>
           <p style={{ fontSize:15, color:C.sub, margin:"0 0 32px" }}>You are paying \\\${selectedIds.length} out of \\\${employees.length} total employees for \\\${MONTHS_SHORT[selectedMonthIndex]} \\\${currentYear}.</p>
           
           <div style={{ background:C.surf, padding:24, borderRadius:16, border:\\\`1px solid \\\${C.bdr}\\\`, marginBottom:32 }}>
             <div style={{ fontSize:12, fontWeight:700, color:C.sub, letterSpacing:1, marginBottom:8 }}>TOTAL NET PAYOUT</div>
             <div style={{ fontSize:32, fontWeight:800, color:C.p }}>₹{totalAmt.toLocaleString("en-IN")}</div>
           </div>

           <Btn 
             onClick={handlePay} 
             disabled={isProcessing}
             style={{ width:"100%", padding:"16px", fontSize:16, background:isProcessing ? C.sub : "#0f172a", color:"#fff", border:"none", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"all 0.2s", boxShadow: isProcessing ? "none" : "0 8px 16px rgba(0,0,0,0.15)" }}
           >
             {isProcessing ? "Processing via Secure Gateway..." : "Proceed to Payment Gateway →"}
           </Btn>
           <Btn variant="ghost" onClick={() => setStep(2)} style={{ width:"100%", marginTop:12 }}>Go Back</Btn>
        </div>
      </Modal>
    );
  }

  if (step === 4) {
    return (
      <Modal title="Success!" onClose={onClose} width={400}>
         <div style={{ textAlign:"center", padding:"40px 20px 20px" }}>
            <div style={{ fontSize:64, marginBottom:20, color:"#22c55e", animation:"bounce 1s infinite" }}>✓</div>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.txt, margin:"0 0 12px" }}>Payments Processed</h2>
            <p style={{ fontSize:15, color:C.sub, margin:"0 0 32px", lineHeight:1.5 }}>
              The payroll batch of {selectedIds.length} employees has been pushed to the banking gateway successfully.
            </p>
            <Btn style={{ width:"100%", padding:"14px", fontSize:15 }} onClick={() => { toast("Payroll successfully completed!"); onClose(); }}>View Processed Payments</Btn>
         </div>
      </Modal>
    );
  }
  return null;
};
`;

// 1. Insert PayrollWizardModal right before "export default function App() {"
{
  const pivot = "export default function App() {";
  const pIdx = content.indexOf(pivot);
  if(pIdx !== -1) {
    // Un-escape the backticks and dollars so they are normal in the output
    let codeStr = replacement.replace(/\\\\\\\`/g, '\`').replace(/\\\\\\\$/g, '$');
    content = content.substring(0, pIdx) + codeStr + '\n' + pivot + content.substring(pIdx + pivot.length);
  }
}

// 2. Erase the old block from "{payrollStep > 0 && (" up to "{/* showPaymentConfirm removed as replaced by wizard */}"
{
  const st = content.indexOf('{payrollStep > 0 && (');
  const en = content.indexOf('{/* showPaymentConfirm removed as replaced by wizard */}');
  if (st !== -1 && en !== -1) {
    const replacementStr = `      {payrollStep > 0 && (
        <PayrollWizardModal 
           onClose={() => setPayrollStep(0)} 
           saPayslips={DEMO_PAYSLIPS}
           employees={employees}
           processedPayments={processedPayments}
           setProcessedPayments={setProcessedPayments}
           editedSalaries={editedSalaries}
           setPaymentLogs={setPaymentLogs}
           toast={toast}
           parseInr={parseInr}
           C={C}
           MONTHS_SHORT={MONTHS_SHORT}
        />
      )}
`;
    content = content.substring(0, st) + replacementStr + content.substring(en + '{/* showPaymentConfirm removed as replaced by wizard */}'.length);
  } else {
     console.log('Could not find modal block');
  }
}

fs.writeFileSync(file, content);
console.log('Update Complete.');
