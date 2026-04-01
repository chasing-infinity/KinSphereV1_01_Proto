const fs = require('fs');

let code = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// 1. Add global state for released payslips if we need it, or we simply use `saPayslips` state.
// We'll update the saPayslips objects directly and append a `released: true` and `workedDays` properties.
// And we also need to expose the released modal state in App component.

const stateAnchor = 'const [payrollStep, setPayrollStep] = useState(0);';
if (code.includes(stateAnchor)) {
    code = code.replace(stateAnchor, `const [releaseStep, setReleaseStep] = useState(0);\n  const [payrollStep, setPayrollStep] = useState(0);`);
}

// 2. Add the "Release Payslips" button next to "Start Payroll"
const startPayrollBtnAnchor = 'onClick={() => {\n                  setPayrollStep(1);\n                  setSelectedPayIds(saPayslipRows.map(p => p.id));\n                }}';
if (code.includes(startPayrollBtnAnchor)) {
    const btnHtml = `<div style={{ display: "flex", gap: "10px" }}>
              <Btn
                style={{ padding: "8px 18px", fontSize: 13, background: "#fff", color: C.p, border: \`1px solid \${C.p}\`, boxShadow: "0 4px 12px rgba(0,0,0,.05)" }}
                onClick={() => setReleaseStep(1)}
              >
                Release Payslips
              </Btn>
              <Btn
                style={{ padding: "8px 18px", fontSize: 13, background: C.p, color: "#fff", border: "none", boxShadow: "0 4px 12px rgba(var(--p-rgb),.25)" }}
                onClick={() => {
                  setPayrollStep(1);
                  setSelectedPayIds(saPayslipRows.map(p => p.id));
                }}
              >
                Start Payroll
              </Btn>
            </div>`;
    
    // We need to replace the entire old Start Payroll button:
    const oldBtn = `<Btn\n                style={{ padding: "8px 18px", fontSize: 13, background: C.p, color: "#fff", border: "none", boxShadow: "0 4px 12px rgba(var(--p-rgb),.25)" }}\n                onClick={() => {\n                  setPayrollStep(1);\n                  setSelectedPayIds(saPayslipRows.map(p => p.id));\n                }}\n              >\n                Start Payroll\n              </Btn>`;
    
    if (code.includes(oldBtn)) {
        code = code.replace(oldBtn, btnHtml);
    }
}

// 3. Inject ReleasePayslipsModal component
const modalComponent = `
const ReleasePayslipsModal = ({ onClose, saPayslips, setSaPayslips, employees, toast, parseInr, C, MONTHS_SHORT }) => {
  const [step, setStep] = useState(1);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonth);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Custom days map: id -> days
  const [editedDays, setEditedDays] = useState({});

  const totalDaysInMonth = new Date(currentYear, selectedMonthIndex + 1, 0).getDate();

  // Generate the active employee states to display
  const targetEmployees = employees.filter(e => e.status !== "inactive");
  const rowData = targetEmployees.map(emp => {
    const existingPayslip = saPayslips.find(p => p.empId === emp.id && p.monthIndex === selectedMonthIndex && parseInt(p.year) === currentYear);
    const pId = existingPayslip ? existingPayslip.id : \`new_pay_\${emp.id}_\${selectedMonthIndex}\`;
    const netFallback = emp.ctc ? \`₹\${Math.round(parseInt(emp.ctc.replace(/\\D/g,'')) / 12).toLocaleString("en-IN")}\` : "₹50,000";
    
    const p = existingPayslip || {
      id: pId,
      empId: emp.id,
      name: emp.name,
      net: netFallback,
      released: false
    };

    const isReleased = !!p.released;
    const daysWorked = editedDays[pId] !== undefined ? editedDays[pId] : totalDaysInMonth;
    const baseNet = parseInr(p.net);
    const calculatedNet = Math.round((baseNet / totalDaysInMonth) * daysWorked);
    const calcNetStr = \`₹\${calculatedNet.toLocaleString("en-IN")}\`;

    return { emp, p, isReleased, daysWorked, calcNetStr, pId };
  });

  const validUnreleased = rowData.filter(x => !x.isReleased);
  const releasedList = rowData.filter(x => x.isReleased);

  const toggleSelect = id => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleRelease = () => {
    if (selectedIds.length === 0) {
      toast("Select at least one employee.");
      return;
    }
    
    const newGlobalPayslips = [];
    let count = 0;

    selectedIds.forEach(id => {
      count++;
      const pState = validUnreleased.find(x => x.p.id === id);
      if (pState) {
        // If it exists in saPayslips, update it
        if (!saPayslips.find(x => x.id === id)) {
           newGlobalPayslips.push({
              id: id,
              empId: pState.emp.id,
              ini: pState.emp.ini,
              name: pState.emp.name,
              dept: pState.emp.dept,
              year: currentYear.toString(),
              month: selectedMonthIndex,
              monthIndex: selectedMonthIndex,
              monthLabel: \`\${MONTHS_SHORT[selectedMonthIndex]} \${currentYear}\`,
              credited: new Date().toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"}),
              gross: \`₹\${Math.round((parseInr(pState.p.net) || 50000) * 1.38).toLocaleString("en-IN")}\`,
              net: pState.calcNetStr,
              workedDays: pState.daysWorked,
              released: true,
              status: "Unpaid"
           });
        }
      }
    });

    // Update existing ones individually in the main array
    const updatedGlobal = saPayslips.map(ps => {
       if (selectedIds.includes(ps.id)) {
           const match = validUnreleased.find(x => x.p.id === ps.id);
           return { ...ps, released: true, net: match.calcNetStr, workedDays: match.daysWorked };
       }
       return ps;
    });

    setSaPayslips([...updatedGlobal, ...newGlobalPayslips]);
    toast(\`Successfully released payslips for \${count} employees!\`);
    onClose();
  };

  if (step === 1) {
    return (
      <Modal title="Release Payslips" onClose={onClose} width={400}>
        <div style={{ padding: "10px 0 20px" }}>
          <p style={{ color:C.sub, fontSize:14, marginBottom:20 }}>Select the month for the current year ({currentYear}) to release payslips.</p>
          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.6, marginBottom:8 }}>MONTH</div>
          <select
            value={selectedMonthIndex}
            onChange={e => setSelectedMonthIndex(parseInt(e.target.value))}
            style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:\`1px solid \${C.bdr}\`, outline:"none", appearance:"none", background:"#fff" }}
          >
            {MONTHS_SHORT.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
          <Btn onClick={() => setStep(2)} style={{ flex:1, background:C.p, color:"#fff" }}>Next →</Btn>
        </div>
      </Modal>
    );
  }

  if (step === 2) {
    const isAllSelected = validUnreleased.length > 0 && selectedIds.length === validUnreleased.length;
    return (
      <Modal title="Select Employees & Adjust Days" onClose={onClose} width={600}>
        <div style={{ marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ color:C.sub, fontSize:13, margin:0 }}>{MONTHS_SHORT[selectedMonthIndex]} {currentYear} · {totalDaysInMonth} Days Total</p>
          {validUnreleased.length > 0 && (
            <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, cursor:"pointer", color:C.txt }}>
              <input type="checkbox" checked={isAllSelected} onChange={e => setSelectedIds(e.target.checked ? validUnreleased.map(x=>x.p.id) : [])} style={{ cursor:"pointer" }} />
              Select All
            </label>
          )}
        </div>
        
        {validUnreleased.length === 0 ? (
          <div style={{ padding:"30px", textAlign:"center", color:C.sub, background:C.surf, borderRadius:8 }}>
            No eligible unreleased payslips found for this month.
          </div>
        ) : (
          <div style={{ maxHeight:300, overflowY:"auto", border:\`1px solid \${C.bdr}\`, borderRadius:8, background:"#fff" }}>
            {validUnreleased.map(({ p, emp, daysWorked, calcNetStr, pId }) => (
              <label key={pId} style={{ display:"flex", alignItems:"center", padding:"12px 16px", borderBottom:\`1px solid \${C.bdr}\`, cursor:"pointer", transition:"background .2s" }} onMouseEnter={e=>(e.currentTarget.style.background=C.surf)} onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                <input type="checkbox" checked={selectedIds.includes(pId)} onChange={() => toggleSelect(pId)} style={{ marginRight:12, cursor:"pointer" }} />
                <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
                  <span style={{ fontSize:14, fontWeight:600, color:C.txt }}>{emp.name}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:11, color:C.sub, fontWeight:600 }}>DAYS</span>
                    <input 
                       type="number" 
                       value={daysWorked} 
                       min={0} 
                       max={totalDaysInMonth}
                       onChange={e => {
                         let v = parseInt(e.target.value) || 0;
                         if (v > totalDaysInMonth) v = totalDaysInMonth;
                         if (v < 0) v = 0;
                         setEditedDays(prev => ({...prev, [pId]: v }));
                       }}
                       onClick={e => e.stopPropagation()}
                       style={{ width:40, padding:"4px", textAlign:"center", border:\`1px solid \${C.bdr}\`, borderRadius:6, fontSize:13, fontWeight:600 }}
                    />
                  </div>
                  <span style={{ fontSize:14, fontWeight:700, color:C.p, width:90, textAlign:"right" }}>{calcNetStr}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        {releasedList.length > 0 && (
          <div style={{ marginTop:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, marginBottom:8, letterSpacing:0.5 }}>ALREADY RELEASED</div>
            <div style={{ opacity:0.6 }}>
              {releasedList.map(r => (
                <div key={r.pId} style={{ display:"flex", justifyContent:"space-between", padding:"8px", fontSize:13 }}>
                  <span>{r.emp.name}</span>
                  <span style={{ display:"flex", gap:16 }}><span>{r.daysWorked} Days</span> <strong>{r.calcNetStr}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex:1 }}>← Back</Btn>
          <Btn onClick={handleRelease} style={{ flex:2, background:C.p, color:"#fff" }} disabled={selectedIds.length === 0}>
            Release Payslips ({selectedIds.length})
          </Btn>
        </div>
      </Modal>
    );
  }
};
`;

// Inject modal body before export default App;
const injectModalAnchor = 'export default function App()';
if (code.includes(injectModalAnchor)) {
    code = code.replace(injectModalAnchor, modalComponent + '\n\nexport default function App()');
}

// 4. Also render the new modal in App conditionally
const renderAnchor = '{payrollStep > 0 && (';
if (code.includes(renderAnchor)) {
    const renderModal = `{releaseStep > 0 && (
        <ReleasePayslipsModal 
          onClose={() => setReleaseStep(0)}
          saPayslips={saPayslips}
          setSaPayslips={setSaPayslips}
          employees={employees}
          toast={toast}
          parseInr={parseInr}
          C={C}
          MONTHS_SHORT={MONTHS_SHORT}
        />
      )}\n      {payrollStep > 0 && (`;
    code = code.replace(renderAnchor, renderModal);
}

fs.writeFileSync('kinsphere_prototype.tsx', code);
console.log('Script done.');

