const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// ─── 1. COMPONENT — insert before "const OffboardingFlow" ────────────────
const COMPONENT = `
const ReportsAnalytics = ({ employees, leaves, saPayslips, offboardingItems, C }) => {
  const [activeSection, setActiveSection] = useState("overview");

  // ── derived data ─────────────────────────────────────────────────────
  const totalEmp = employees.length;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();

  const newHires = employees.filter(e => {
    if (!e.joined || e.joined === "—") return false;
    const parts = e.joined.split(" ");
    if (parts.length < 3) return false;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const mo = months.indexOf(parts[1]);
    const yr = parseInt(parts[2]);
    return mo === thisMonth && yr === thisYear;
  }).length;

  const exits = offboardingItems.filter(o => {
    const d = new Date(o.lastAction?.replace("Last Working Day: ","") || "");
    return !isNaN(d) && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const netGrowth = newHires - exits;
  const attritionRate = totalEmp > 0 ? ((exits / totalEmp) * 100).toFixed(1) : "0.0";

  const approvedLeaves = leaves.filter(l => l.status === "approved");
  const totalLeaves    = approvedLeaves.length;
  const leaveTypes     = approvedLeaves.reduce((acc, l) => { acc[l.type] = (acc[l.type]||0)+1; return acc; }, {});
  const topLeaveType   = Object.entries(leaveTypes).sort((a,b)=>b[1]-a[1])[0];

  const monthlyPayroll = saPayslips.filter(p => p.monthIndex === thisMonth).reduce((sum, p) => {
    const n = parseInt((p.net||"0").replace(/[^0-9]/g,"")) || 0;
    return sum + n;
  }, 0);
  const avgSalary = totalEmp > 0 ? Math.round(monthlyPayroll / totalEmp) : 0;

  const depts = employees.reduce((acc, e) => { const d = e.dept||"Unknown"; acc[d]=(acc[d]||0)+1; return acc; }, {});
  const deptList = Object.entries(depts).sort((a,b)=>b[1]-a[1]);

  // ── helpers ──────────────────────────────────────────────────────────
  const fmt = n => n >= 10000000 ? \`\u20B9\${(n/10000000).toFixed(1)}Cr\`
                 : n >= 100000   ? \`\u20B9\${(n/100000).toFixed(1)}L\`
                 : \`\u20B9\${n.toLocaleString("en-IN")}\`;

  const Chip = ({ up, label }) => (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:10, fontWeight:700,
      color: up ? "#16a34a" : "#dc2626", background: up ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
      padding:"2px 7px", borderRadius:99 }}>
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {up ? <polyline points="1 7 5 3 9 7"/> : <polyline points="1 3 5 7 9 3"/>}
      </svg>
      {label}
    </span>
  );

  const InsightBar = ({ text, icon }) => (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", borderRadius:10,
      background:\`rgba(var(--p-rgb),0.05)\`, border:\`1px solid rgba(var(--p-rgb),0.12)\`, marginTop:20 }}>
      <span style={{ color:C.p, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:12, color:C.txt, lineHeight:1.5 }}>{text}</span>
    </div>
  );

  const StatCard = ({ label, value, sub, trend, icon, accent }) => (
    <div style={{ padding:"20px 22px", borderRadius:14, background:C.wht, border:\`1px solid \${C.bdr}\`,
      display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8 }}>{label}</div>
        <div style={{ color: accent||C.p, opacity:0.7 }}>{icon}</div>
      </div>
      <div style={{ fontSize:26, fontWeight:800, color: accent||C.txt, letterSpacing:"-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.sub }}>{sub}</div>}
      {trend !== undefined && <Chip up={trend >= 0} label={\`\${trend >= 0 ? "+" : ""}\${trend} this month\`} />}
    </div>
  );

  const SectionBtn = ({ id, label }) => (
    <button onClick={() => setActiveSection(id)} style={{
      padding:"7px 16px", borderRadius:8, border:\`1px solid \${activeSection===id ? C.p : C.bdr}\`,
      background: activeSection===id ? \`rgba(var(--p-rgb),0.08)\` : "transparent",
      color: activeSection===id ? C.p : C.sub, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s"
    }}>{label}</button>
  );

  const MiniBar = ({ label, value, max, color }) => {
    const pct = max > 0 ? Math.round((value/max)*100) : 0;
    return (
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:12, color:C.txt }}>{label}</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.txt }}>{value}</span>
        </div>
        <div style={{ height:6, background:C.surf, borderRadius:99 }}>
          <div style={{ height:6, width:\`\${pct}%\`, background: color||C.p, borderRadius:99, transition:"width 0.5s" }}/>
        </div>
      </div>
    );
  };

  const SectionWrap = ({ children }) => (
    <div style={{ display:"grid", gap:20, animation:"fadeIn 0.3s" }}>{children}</div>
  );

  // ── icon shortcuts ────────────────────────────────────────────────────
  const IconUsers  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
  const IconTrend  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
  const IconLeaf   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
  const IconReward = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
  const IconMsg    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  const IconGrid   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
  const IconAlert  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

  const sections = [
    { id:"overview",    label:"Workforce" },
    { id:"attrition",   label:"Attrition" },
    { id:"leaves",      label:"Leave" },
    { id:"payroll",     label:"Payroll" },
    { id:"teams",       label:"Teams" },
  ];

  return (
    <div style={{ padding:"0 32px 48px", maxWidth:900, margin:"0 auto", animation:"fadeIn 0.3s" }}>
      {/* ── Header ── */}
      <div style={{ padding:"40px 0 28px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:14,
          padding:"5px 14px", borderRadius:999, background:C.surf, border:\`1px solid \${C.bdr}\`,
          fontSize:11, fontWeight:700, letterSpacing:1, color:C.p, textTransform:"uppercase" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Executive View
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:30, color:C.txt, margin:"0 0 8px", fontWeight:700, letterSpacing:"-0.02em" }}>Reports & Analytics</h1>
        <p style={{ color:C.sub, fontSize:14, margin:0, lineHeight:1.6 }}>Workforce intelligence for leadership decisions. Updated in real-time.</p>
      </div>

      {/* ── Section tabs ── */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28, paddingBottom:20, borderBottom:\`1px solid \${C.bdr}\` }}>
        {sections.map(s => <SectionBtn key={s.id} id={s.id} label={s.label} />)}
      </div>

      {/* ══ WORKFORCE OVERVIEW ══════════════════════════════════════════ */}
      {activeSection === "overview" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            <StatCard label="Total Employees" value={totalEmp} icon={<IconUsers/>} sub="Active headcount" />
            <StatCard label="New Hires" value={newHires} icon={<IconTrend/>} sub="This month" trend={newHires} accent="#16a34a" />
            <StatCard label="Exits" value={exits} icon={<IconTrend/>} sub="This month" trend={-exits} accent={exits>0?"#dc2626":C.txt} />
            <StatCard label="Net Growth" value={(netGrowth>=0?"+":"")+netGrowth} icon={<IconUsers/>} sub="New − exits" accent={netGrowth>=0?"#16a34a":"#dc2626"} />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:\`1px solid \${C.bdr}\` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:18 }}>Department Breakdown</div>
            {deptList.slice(0,6).map(([d,n]) => <MiniBar key={d} label={d} value={n} max={totalEmp} />)}
          </div>

          <InsightBar icon={<IconAlert/>}
            text={netGrowth > 0
              ? \`Team is growing steadily — \${newHires} new hire\${newHires!==1?"s":""} joined this month.\`
              : exits > newHires
              ? \`Exits (\${exits}) currently outpacing new hires (\${newHires}) — review talent pipeline.\`
              : "Workforce is stable. No significant changes this month."} />
        </SectionWrap>
      )}

      {/* ══ ATTRITION & RETENTION ═══════════════════════════════════════ */}
      {activeSection === "attrition" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
            <StatCard label="Attrition Rate" value={\`\${attritionRate}%\`} icon={<IconTrend/>} sub="Based on exits this month" accent={parseFloat(attritionRate)>10?"#dc2626":C.p} />
            <StatCard label="Total Exits" value={offboardingItems.length} icon={<IconUsers/>} sub="All time in system" />
            <StatCard label="Completed" value={offboardingItems.filter(o=>o.progress===100).length} icon={<IconTrend/>} sub="Fully offboarded" accent="#16a34a" />
            <StatCard label="In Progress" value={offboardingItems.filter(o=>o.progress<100).length} icon={<IconAlert/>} sub="Pending clearance" accent="#f59e0b" />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:\`1px solid \${C.bdr}\` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:18 }}>Exit Reasons</div>
            {["Resignation","Contract End","Retirement","Termination"].map(reason => {
              const count = offboardingItems.filter(o => o.reason === reason).length;
              return <MiniBar key={reason} label={reason} value={count} max={Math.max(offboardingItems.length,1)} />;
            })}
            {offboardingItems.length === 0 && <div style={{ color:C.sub, fontSize:13 }}>No exit data yet.</div>}
          </div>

          <InsightBar icon={<IconAlert/>}
            text={parseFloat(attritionRate) > 10
              ? \`Attrition rate (\${attritionRate}%) is above healthy threshold (10%) — immediate retention action recommended.\`
              : \`Attrition is within healthy range at \${attritionRate}%. Continue monitoring exit reasons for trends.\`} />
        </SectionWrap>
      )}

      {/* ══ LEAVE INSIGHTS ══════════════════════════════════════════════ */}
      {activeSection === "leaves" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            <StatCard label="Total Leaves Taken" value={totalLeaves} icon={<IconLeaf/>} sub="Approved leave records" />
            <StatCard label="Pending Approvals" value={leaves.filter(l=>l.status==="pending").length} icon={<IconAlert/>} sub="Awaiting decision" accent="#f59e0b" />
            <StatCard label="Top Leave Type" value={topLeaveType?.[0]||"—"} icon={<IconLeaf/>} sub={topLeaveType ? \`\${topLeaveType[1]} requests\` : "No data"} />
            <StatCard label="Unique Requesters" value={[...new Set(approvedLeaves.map(l=>l.empId))].length} icon={<IconUsers/>} sub="Employees who took leave" />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:\`1px solid \${C.bdr}\` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:18 }}>Leave Type Distribution</div>
            {Object.entries(leaveTypes).length === 0
              ? <div style={{ color:C.sub, fontSize:13 }}>No approved leave data.</div>
              : Object.entries(leaveTypes).sort((a,b)=>b[1]-a[1]).map(([type,count]) =>
                  <MiniBar key={type} label={type} value={count} max={totalLeaves} />
                )
            }
          </div>

          <InsightBar icon={<IconAlert/>}
            text={totalLeaves > totalEmp * 2
              ? \`High leave utilisation detected (\${totalLeaves} approved). Review team coverage and workload distribution.\`
              : leaves.filter(l=>l.status==="pending").length > 5
              ? \`\${leaves.filter(l=>l.status==="pending").length} leave requests awaiting approval — action recommended.\`
              : \`Leave patterns appear healthy. Most common type: \${topLeaveType?.[0]||"N/A"}.\`} />
        </SectionWrap>
      )}

      {/* ══ PAYROLL OVERVIEW ════════════════════════════════════════════ */}
      {activeSection === "payroll" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            <StatCard label="Monthly Payroll" value={monthlyPayroll > 0 ? fmt(monthlyPayroll) : "—"} icon={<IconReward/>} sub={\`\${new Date().toLocaleString("en-IN",{month:"long"})} \${thisYear}\`} accent={C.p} />
            <StatCard label="Average Salary" value={avgSalary > 0 ? fmt(avgSalary) : "—"} icon={<IconReward/>} sub="Per employee / month" />
            <StatCard label="Employees on Payroll" value={saPayslips.filter(p=>p.monthIndex===thisMonth).length} icon={<IconUsers/>} sub="With payslips this month" />
            <StatCard label="Payslips Generated" value={saPayslips.length} icon={<IconGrid/>} sub="All time" />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:\`1px solid \${C.bdr}\` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:18 }}>Salary Distribution by Department</div>
            {deptList.length === 0
              ? <div style={{ color:C.sub, fontSize:13 }}>No department data.</div>
              : deptList.map(([dept, count]) => {
                  const deptAvg = employees.filter(e => e.dept === dept && e.salary && e.salary !== "—")
                    .reduce((s, e) => s + (parseInt(String(e.salary).replace(/[^0-9]/g,""))||0), 0);
                  return <MiniBar key={dept} label={dept} value={count} max={totalEmp} />;
                })
            }
          </div>

          <InsightBar icon={<IconAlert/>}
            text={monthlyPayroll > 0
              ? \`Monthly payroll stands at \${fmt(monthlyPayroll)}. Average per employee: \${fmt(avgSalary)}.\`
              : "Run payroll for this month to see payroll analytics."} />
        </SectionWrap>
      )}

      {/* ══ TEAM VIEW ═══════════════════════════════════════════════════ */}
      {activeSection === "teams" && (
        <SectionWrap>
          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:\`1px solid \${C.bdr}\` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:20 }}>Team-wise Breakdown</div>
            <div style={{ display:"grid", gap:0 }}>
              {/* Header */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px", gap:8, padding:"8px 12px",
                background:C.surf, borderRadius:8, marginBottom:8, fontSize:10, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.6 }}>
                <div>Department</div><div style={{textAlign:"center"}}>Headcount</div>
                <div style={{textAlign:"center"}}>Leaves</div><div style={{textAlign:"center"}}>Exits</div>
              </div>
              {deptList.map(([dept, count]) => {
                const deptLeaves = approvedLeaves.filter(l => {
                  const emp = employees.find(e => e.id === l.empId);
                  return emp?.dept === dept;
                }).length;
                const deptExits = offboardingItems.filter(o => {
                  const emp = employees.find(e => e.id === o.empId);
                  return emp?.dept === dept;
                }).length;
                return (
                  <div key={dept} style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px", gap:8,
                    padding:"12px", borderRadius:8, marginBottom:4, border:\`1px solid \${C.bdr}\`,
                    transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.surf}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ fontWeight:600, color:C.txt, fontSize:13 }}>{dept}</div>
                    <div style={{ textAlign:"center", color:C.p, fontWeight:700, fontSize:13 }}>{count}</div>
                    <div style={{ textAlign:"center", color:C.sub, fontSize:13 }}>{deptLeaves}</div>
                    <div style={{ textAlign:"center", color:deptExits>0?"#dc2626":C.sub, fontWeight:deptExits>0?700:400, fontSize:13 }}>{deptExits}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <InsightBar icon={<IconAlert/>}
            text={deptList.length > 0
              ? \`Largest team: \${deptList[0][0]} (\${deptList[0][1]} people). Monitor teams with exit activity for retention signals.\`
              : "Add employees to departments to see team-level insights."} />
        </SectionWrap>
      )}

      <style>{\`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}\`}</style>
    </div>
  );
};

`;

// Insert before "const OffboardingFlow"
const insertBefore = "const OffboardingFlow = ";
const idx = c.indexOf(insertBefore);
if (idx === -1) { console.error("Could not find insertion point!"); process.exit(1); }
c = c.slice(0, idx) + COMPONENT + c.slice(idx);
console.log("Component inserted at index:", idx);

// ─── 2. PAGE RENDERER — insert before "{/* ─ PEOPLE CHAPTERS ─ */}" ────
const PAGE_RENDERER = `
        {/* ─ REPORTS & ANALYTICS ─ */}
        {page === "Reports & Analytics" && isSA && (
          <div style={{ padding:\`0 \${pad}px \${padBottom}px\`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <ReportsAnalytics
              employees={employees}
              leaves={leaves}
              saPayslips={saPayslips}
              offboardingItems={offboardingItems}
              C={C}
            />
          </div>
        )}

`;

const insertBefore2 = "{/* ─ PEOPLE CHAPTERS ─ */}";
const idx2 = c.indexOf(insertBefore2);
if (idx2 === -1) { console.error("Could not find People Chapters render point!"); process.exit(1); }
c = c.slice(0, idx2) + PAGE_RENDERER + c.slice(idx2);
console.log("Page renderer inserted at index:", idx2);

fs.writeFileSync('kinsphere_prototype.tsx', c, 'utf8');
console.log("Done. File written.");
