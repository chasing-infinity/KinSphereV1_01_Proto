const fs = require('fs');
let content = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// 1. Update ProfileDetail component to support Bank Details and onEditBank
const pdStart = content.indexOf('const ProfileDetail = ({ e, wrapCard = true, empList = EMPS, narrow = false }) => {');
const pdEnd = content.indexOf('return wrapCard ? <Card', pdStart);
if (pdStart !== -1 && pdEnd !== -1) {
    let pdBlock = content.substring(pdStart, pdEnd);
    pdBlock = pdBlock.replace(
        'const ProfileDetail = ({ e, wrapCard = true, empList = EMPS, narrow = false }) => {',
        'const ProfileDetail = ({ e, wrapCard = true, empList = EMPS, narrow = false, onEditBank }) => {'
    );
    
    // Insert Bank Details section before ASSIGNED DEVICES
    const targetA = '<div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${C.bdr}` }}>\\n        <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>ASSIGNED DEVICES</div>';
    
    const bankHtml = `<div style={{ marginTop:18, paddingTop:16, borderTop:\\\`1px solid \\\${C.bdr}\\\` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom:8 }}>
          <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5 }}>BANK DETAILS</div>
          {onEditBank && <button onClick={onEditBank} style={{ background:"none", border:\\\`1px solid \\\${C.p}\\\`, color:C.p, borderRadius:4, padding:"3px 8px", fontSize:10, fontWeight:700, cursor:"pointer" }}>Edit bank info</button>}
        </div>
        {e.bankInfo?.accountNumber || e.bankInfo?.ifsc ? (
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "160px 1fr", gap:"12px 20px", fontSize:12 }}>
            <div style={{ display:"contents" }}>
              <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5 }}>ACCOUNT NUMBER</div>
              <div style={{ color:C.txt, fontFamily:"monospace" }}>{e.bankInfo.accountNumber || "—"}</div>
            </div>
            <div style={{ display:"contents" }}>
              <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5 }}>IFSC CODE</div>
              <div style={{ color:C.txt, fontFamily:"monospace" }}>{e.bankInfo.ifsc || "—"}</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize:12, color:C.sub, fontStyle:"italic" }}>No bank details provided.</div>
        )}
      </div>
      <div style={{ marginTop:18, paddingTop:16, borderTop:\\\`1px solid \\\${C.bdr}\\\` }}>
        <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>ASSIGNED DEVICES</div>`;
    
    pdBlock = pdBlock.replace(targetA, bankHtml);
    content = content.substring(0, pdStart) + pdBlock + content.substring(pdEnd);
}

// 2. Add bankPick state to App
const stateAnchor = 'const [showEmp,    setShowEmp]  = useState(false);';
if (content.includes(stateAnchor)) {
    content = content.replace(
        stateAnchor,
        `const [bankPick, setBankPick] = useState(null);\n  const [bankForm, setBankForm] = useState({ acc: "", ifsc: "" });\n  const [showEmp,    setShowEmp]  = useState(false);`
    );
}

// 3. Add effect to populate bankForm when bankPick changes
const effectAnchor = 'useEffect(() => {\n    if (showEmp && profilePick) {';
if (content.includes(effectAnchor)) {
    content = content.replace(
        effectAnchor,
        `useEffect(() => {
    if (bankPick) {
      const e = empById(bankPick, employees);
      if (e) setBankForm({ acc: e.bankInfo?.accountNumber || "", ifsc: e.bankInfo?.ifsc || "" });
    }
  }, [bankPick, employees]);\n  useEffect(() => {\n    if (showEmp && profilePick) {`
    );
}

// 4. Update ProfileDetail usage in My Profile
const myProfileAnchor = '<ProfileDetail e={me} empList={employees} wrapCard={false} narrow={narrow} />';
if (content.includes(myProfileAnchor)) {
    content = content.replace(
        myProfileAnchor,
        '<ProfileDetail e={me} empList={employees} wrapCard={false} narrow={narrow} onEditBank={() => setBankPick(me.id)} />'
    );
}

// 5. Update ProfileDetail usage in Employee Profile Modal
const empProfileAnchor = '<ProfileDetail e={empById(profilePick, employees)} wrapCard={false} empList={employees} narrow={narrow} />';
if (content.includes(empProfileAnchor)) {
    content = content.replace(
        empProfileAnchor,
        '<ProfileDetail e={empById(profilePick, employees)} wrapCard={false} empList={employees} narrow={narrow} onEditBank={() => setBankPick(profilePick)} />'
    );
}

// 6. Add Bank Details Modal JSX
const modalAnchor = '{showTimeline && (';
if (content.includes(modalAnchor)) {
   const bankModalJsx = `{bankPick && (
        <Modal title="Update Bank Details" onClose={() => setBankPick(null)} width={400}>
          <div style={{ marginBottom:16 }}>
             <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>ACCOUNT NUMBER</label>
             <input value={bankForm.acc} onChange={e => setBankForm({ ...bankForm, acc: e.target.value })} style={{ width:"100%", boxSizing:"border-box", padding:"10px", borderRadius:8, border:\\\`1px solid \\\${C.bdr}\\\`, outline:"none", fontSize:14 }} />
          </div>
          <div style={{ marginBottom:20 }}>
             <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>IFSC CODE</label>
             <input value={bankForm.ifsc} onChange={e => setBankForm({ ...bankForm, ifsc: e.target.value })} style={{ width:"100%", boxSizing:"border-box", padding:"10px", borderRadius:8, border:\\\`1px solid \\\${C.bdr}\\\`, outline:"none", fontSize:14 }} />
          </div>
          <div style={{ display:"flex", gap:10 }}>
             <Btn variant="ghost" onClick={() => setBankPick(null)} style={{ flex:1 }}>Cancel</Btn>
             <Btn onClick={() => {
                setEmployees(emps => emps.map(emp => emp.id === bankPick ? { ...emp, bankInfo: { accountNumber: bankForm.acc, ifsc: bankForm.ifsc } } : emp));
                toast("Bank details updated successfully ✓");
                setBankPick(null);
             }} style={{ flex:1, background:C.p, color:"#fff" }}>Save Bank Info</Btn>
          </div>
        </Modal>
      )}

      `;
    content = content.replace(modalAnchor, bankModalJsx + modalAnchor);
}

fs.writeFileSync('kinsphere_prototype.tsx', content);
console.log('Done script.');
