import { useState, useRef, useEffect } from "react";

const CSS_THEME = `
:root {
  --p: #afc0a5;
  --p-rgb: 175, 192, 165;
  --p2: #8a9a80;
  --acc: #afc0a5;
  --bg: #fffef8;
  --mid: #dce3c7;
  --surf: #dbead2;
  --bdr: #c1d0b5;
  --dk: #3a4832;
  --dk2: #2d3a28;
  --dkAcc: #c1d0b5;
  --txt: #2a3326;
  --sub: #5a6e52;
  --wht: #ffffff;
  --shadow-rgb: 42, 51, 38;
}
.dark {
  --p: #afc0a5;
  --p-rgb: 175, 192, 165;
  --p2: #8a9a80;
  --acc: #afc0a5;
  --bg: #161814;
  --mid: #252922;
  --surf: #2b3028;
  --bdr: #3d4538;
  --dk: #0d100d;
  --dk2: #161814;
  --dkAcc: #8a9a80;
  --txt: #e8ece6;
  --sub: #a1afa0;
  --wht: #1d211b;
  --shadow-rgb: 0, 0, 0;
}
body { background: var(--bg); color: var(--txt); transition: background 0.3s, color 0.3s; margin:0; padding:0; }
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = CSS_THEME;
  document.head.appendChild(style);
}

const C = {
  p:     "var(--p)",
  p2:    "var(--p2)",
  acc:   "var(--acc)",
  bg:    "var(--bg)",
  mid:   "var(--mid)",
  surf:  "var(--surf)",
  bdr:   "var(--bdr)",
  dk:    "var(--dk)",
  dk2:   "var(--dk2)",
  dkAcc: "var(--dkAcc)",
  txt:   "var(--txt)",
  sub:   "var(--sub)",
  wht:   "var(--wht)",
};

/** Logged-in user (matches sidebar avatar / name). */
const ME_ID = 1;

const EMPS = [
  { id:1, ini:"AM", name:"Arjun Mehta",    email:"admin@bipolarfactory.com",  role:"Super Admin", dept:"Leadership", type:"Full Time", joined:"Jan 2022", salary:"₹25,00,000",
    phone:"+91 98765 43210", designation:"Co-founder & CEO", dob:"15 Aug 1988",
    devices:["MacBook Pro M3","iPhone 15 Pro"], documents:[{ n:"Aadhaar", v:true },{ n:"PAN", v:true },{ n:"Offer letter", v:true }], managerId:null,
    bankInfo:{ holder:"Arjun Mehta", acc:"1234567890", ifsc:"HDFC0001234" } },
  { id:2, ini:"NA", name:"Nihit Agarwal",  email:"nihit@bipolarfactory.com",  role:"Super Admin", dept:"Technology",  type:"Full Time", joined:"Apr 2023", salary:"—",
    phone:"+91 98100 11223", designation:"Head of Engineering", dob:"03 Feb 1992",
    devices:["MacBook Air M2"], documents:[{ n:"Aadhaar", v:true },{ n:"PAN", v:false }], managerId:1,
    bankInfo:{ holder:"Nihit Agarwal", acc:"9876543210", ifsc:"ICIC0005678" } },
  { id:3, ini:"PS", name:"Priya Sharma",   email:"priya@bipolarfactory.com",  role:"Employee",    dept:"Design",      type:"Full Time", joined:"Jun 2023", salary:"₹1,00,000",
    phone:"+91 91234 55667", designation:"Product Designer", dob:"22 Nov 1995",
    devices:["MacBook Pro 14"], documents:[{ n:"Aadhaar", v:true },{ n:"NDA", v:true }], managerId:1,
    bankInfo:{ holder:"Priya Sharma", acc:"5566778899", ifsc:"SBIN0009988" } },
  { id:4, ini:"RA", name:"Ridwanul Alam",  email:"ridwan@bipolarfactory.com", role:"Super Admin", dept:"Technology",  type:"Full Time", joined:"Mar 2026", salary:"₹1",
    phone:"+91 90000 44112", designation:"Software Engineer", dob:"01 Jan 1999",
    devices:["Dell XPS 15"], documents:[{ n:"PAN", v:true }], managerId:2,
    bankInfo:null /* Missing for testing */ },
  { id:5, ini:"S",  name:"Sahil .",        email:"sahil@bipolarfactory.com",  role:"Super Admin", dept:"Technology",  type:"Full Time", joined:"Oct 2022", salary:"—",
    phone:"+91 98888 77665", designation:"Tech Lead", dob:"10 Jul 1990",
    devices:["ThinkPad P1"], documents:[{ n:"Aadhaar", v:true },{ n:"Contract", v:true }], managerId:1,
    bankInfo:{ holder:"Sahil", acc:"1122334455", ifsc:"KKBK0004433" } },
];

const INIT_LEAVES = [
  { id:1, empId:1, ini:"AM", emp:"Arjun Mehta",  type:"Sick Leave",   from:"25 Mar", to:"25 Mar", fromISO:"2026-03-25", toISO:"2026-03-25", days:"1d", reason:"Check", approver:"Ridwanul Alam", status:"pending"  },
  { id:2, empId:1, ini:"AM", emp:"Arjun Mehta",  type:"Earned Leave", from:"20 Mar", to:"20 Mar", fromISO:"2026-03-20", toISO:"2026-03-20", days:"1d", reason:"Check", approver:"Priya Sharma",  status:"pending"  },
  { id:3, empId:3, ini:"PS", emp:"Priya Sharma", type:"Sick Leave",   from:"10 Mar", to:"11 Mar", fromISO:"2026-03-10", toISO:"2026-03-11", days:"2d", reason:"Fever", approver:"Arjun Mehta",   status:"approved" },
  { id:4, empId:3, ini:"PS", emp:"Priya Sharma", type:"Casual Leave", from:"28 Mar", to:"28 Mar", fromISO:"2026-03-28", toISO:"2026-03-28", days:"1d", reason:"Personal", approver:"Arjun Mehta",   status:"pending"  },
];

const PAYROLL = [
  { ini:"PS", name:"Priya Sharma",  dept:"",           ctc:"₹1,00,000", basic:"50%", hra:"20%", other:"30%", net:"₹8,333", set:true  },
  { ini:"S",  name:"Sahil .",       dept:"Technology", ctc:"Not set",   basic:"—",   hra:"—",   other:"—",   net:"—",      set:false },
  { ini:"NA", name:"Nihit Agarwal", dept:"Technology", ctc:"Not set",   basic:"—",   hra:"—",   other:"—",   net:"—",      set:false },
  { ini:"RA", name:"Ridwanul Alam", dept:"Technology", ctc:"Not set",   basic:"—",   hra:"—",   other:"—",   net:"—",      set:false },
  { ini:"AM", name:"Arjun Mehta",   dept:"",           ctc:"Not set",   basic:"—",   hra:"—",   other:"—",   net:"—",      set:false },
];

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Demo payslips: one entry per employee per month (prototype). */
function buildDemoPayslips() {
  const ps = [];
  const periods = [
    { y: 2025, months: [9, 10, 11] },
    { y: 2026, months: [0, 1, 2, 3, 4, 5] },
  ];
  for (const { y, months } of periods) {
    for (const m of months) {
      EMPS.forEach(e => {
        const base = 95000 + e.id * 1800 + m * 120;
        const net = Math.round(base * 0.78);
        const gross = Math.round(base * 1.08);
        ps.push({
          id: `ps-${e.id}-${y}-${m}`,
          empId: e.id,
          ini: e.ini,
          name: e.name,
          dept: e.dept,
          year: y,
          month: m,
          monthLabel: `${MONTHS_SHORT[m]} ${y}`,
          credited: `15 ${MONTHS_SHORT[m]} ${y}`,
          gross: `₹${gross.toLocaleString("en-IN")}`,
          net: `₹${net.toLocaleString("en-IN")}`,
          status: "Unpaid",
        });
      });
    }
  }
  return ps;
}
const DEMO_PAYSLIPS = buildDemoPayslips();

const INIT_HOLIDAYS = [
  { id:1, n:"Ganesh Chaturthi", d:"07 Sep 2026", dISO:"2026-09-07", desc:"Company-wide holiday for Ganesh Chaturthi." },
  { id:2, n:"Gandhi Jayanti",   d:"02 Oct 2026", dISO:"2026-10-02", desc:"National holiday." },
  { id:3, n:"Diwali",           d:"01 Nov 2026", dISO:"2026-11-01", desc:"Festival of Lights." },
];

const PAY_SELECT_ARROW = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a6e52' d='M2.5 4L6 7.5 9.5 4'/%3E%3C/svg%3E\")";

const parseInr = (s) => (s && typeof s === "string") ? Number(s.replace(/[₹,]/g, "")) : 0;

const payFilterSelectStyle = {
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  padding: "10px 36px 10px 14px",
  borderRadius: 10,
  border: `1px solid ${C.bdr}`,
  backgroundColor: C.wht,
  backgroundImage: PAY_SELECT_ARROW,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  fontSize: 13,
  fontWeight: 600,
  color: C.txt,
  cursor: "pointer",
  minWidth: 120,
  boxShadow: "inset 0 1px 2px rgba(var(--shadow-rgb),.04)",
};

/** Default salary config form values per employee (ini key). */
const DEFAULT_SALARY_CFG = () => ({
  annualCtc: "",
  basicPct: "50",
  hraPct: "20",
  profTax: "200",
  pf: "1800",
  tds: "",
});

function parseInrStr(s) {
  if (!s || s === "—") return 0;
  return Number(String(s).replace(/[₹,\s]/g, "")) || 0;
}
function formatInrNum(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Monthly breakdown for payslip from salary config + demo row. */
function getPayslipBreakdown(ini, salaryConfigs, payslipRow) {
  const cfg = salaryConfigs[ini] ? { ...DEFAULT_SALARY_CFG(), ...salaryConfigs[ini] } : DEFAULT_SALARY_CFG();
  const annual = Number(cfg.annualCtc) || 0;
  const grossDemo = parseInrStr(payslipRow.gross);
  const netDemo = parseInrStr(payslipRow.net);
  const monthlyGross = annual > 0 ? annual / 12 : grossDemo;
  const bp = Number(cfg.basicPct) || 0;
  const hp = Number(cfg.hraPct) || 0;
  const basic = annual > 0 ? monthlyGross * bp / 100 : grossDemo * 0.5;
  const hra = annual > 0 ? monthlyGross * hp / 100 : grossDemo * 0.2;
  const other = Math.max(0, monthlyGross - basic - hra);
  const pt = Number(cfg.profTax) || 0;
  const pf = Number(cfg.pf) || 0;
  const tds = Number(cfg.tds) || 0;
  const totalDed = pt + pf + tds;
  const netCalc = monthlyGross - totalDed;
  const net = annual > 0 ? netCalc : netDemo;
  return {
    cfg,
    annual,
    monthlyGross,
    basic,
    hra,
    other,
    bp,
    hp,
    otherPct: annual > 0 ? Math.max(0, 100 - bp - hp) : null,
    pt,
    pf,
    tds,
    totalDed,
    net,
    grossStr: formatInrNum(monthlyGross),
    netStr: formatInrNum(net),
  };
}

const empById = (id, list = EMPS) => list.find(e => e.id === id);
const mgrName = (id, list = EMPS) => (id == null ? "—" : (empById(id, list)?.name ?? "—"));

/** Only Admin & Employee leave requests use tagged approvers (not Super Admin self-serve queue). */
const LEAVE_TAGGED_APPROVAL_ROLES = new Set(["Admin", "Employee"]);

function leaveRequesterEmp(leave, employeesList) {
  return employeesList.find(e => e.id === leave.empId);
}

/** Pending leave the viewer may approve: tagged approver, requester is Admin or Employee. */
function canActOnTaggedLeave(leave, viewerName, employeesList) {
  if (leave.status !== "pending") return false;
  const req = leaveRequesterEmp(leave, employeesList);
  if (!req || !LEAVE_TAGGED_APPROVAL_ROLES.has(req.role)) return false;
  return leave.approver === viewerName;
}

/** Super Admin may act on any pending leave; others only via tagged flow. */
function canApproveLeaveRow(leave, viewerName, employeesList, viewerIsSA) {
  if (leave.status !== "pending") return false;
  if (viewerIsSA) return true;
  return canActOnTaggedLeave(leave, viewerName, employeesList);
}

/** Build a leave row from the apply form (dates as YYYY-MM-DD). */
function leaveRowFromApplyForm(leaves, employeesList, form, submitterEmpId, isSA) {
  const empId = isSA ? form.forEmpId : submitterEmpId;
  const e = empById(empId, employeesList);
  if (!e) return { error: "Choose an employee." };
  if (!form.from || !form.to) return { error: "Choose from and to dates." };
  if (form.from > form.to) return { error: "End date must be on or after start date." };
  const approverName = form.approver && form.approver !== "Select approver…" ? form.approver.trim() : "";
  if (!approverName) return { error: "Tag an approver." };
  const maxId = Math.max(0, ...leaves.map(l => l.id));
  const fromD = new Date(form.from + "T12:00:00");
  const toD = new Date(form.to + "T12:00:00");
  const fmt = d => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  const daySpan = Math.max(1, Math.round((toD.getTime() - fromD.getTime()) / 864e5) + 1);
  const daysLabel = daySpan === 1 ? "1d" : `${daySpan}d`;
  return {
    row: {
      id: maxId + 1,
      empId: e.id,
      ini: e.ini,
      emp: e.name,
      type: form.type,
      from: fmt(fromD),
      to: fmt(toD),
      fromISO: form.from,
      toISO: form.to,
      days: daysLabel,
      reason: form.reason.trim() || "—",
      approver: approverName,
      status: "pending",
    },
  };
}

/** CSV column order — matches import requirements. */
const EMP_CSV_HEADERS = [
  "name", "email", "phone", "designation", "department", "role", "employment_type",
  "date_of_joining", "salary", "dob", "ini", "avatar_color", "manager_email",
];

function escapeCSVCell(v) {
  const t = String(v ?? "");
  if (/[",\n\r]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
  return t;
}

function employeesToCSV(rows) {
  const header = EMP_CSV_HEADERS.map(escapeCSVCell).join(",");
  const lines = rows.map(e => {
    const managerEmail = e.managerId != null ? (empById(e.managerId, rows)?.email ?? "") : "";
    const cells = [
      e.name, e.email, e.phone, e.designation, e.dept, e.role, e.type, e.joined,
      e.salary, e.dob, e.ini, e.avatarC, managerEmail,
    ];
    return cells.map(escapeCSVCell).join(",");
  });
  return [header, ...lines].join("\n");
}

function downloadTextFile(filename, text, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

/** Parse CSV (simple comma split; quoted fields supported). */
function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { out.push(cur.trim()); cur = ""; }
    else cur += c;
  }
  out.push(cur.trim());
  return out;
}

/**
 * Required columns: name, email, role, department, employment_type, date_of_joining
 * Optional: phone, designation, salary, dob, ini, avatar_color, manager_email
 */
function parseEmployeesFromCSV(text, existing) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("Add a header row and at least one employee row.");
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, "_"));
  const required = ["name", "email", "role", "department", "employment_type", "date_of_joining"];
  for (const r of required) {
    if (!headers.includes(r)) throw new Error(`Missing required column: "${r}"`);
  }
  const idx = h => headers.indexOf(h);
  const get = (row, h) => {
    const i = idx(h);
    return i < 0 ? "" : (row[i] ?? "").trim();
  };
  const emailToId = new Map(existing.map(e => [e.email.toLowerCase(), e.id]));
  let maxId = Math.max(0, ...existing.map(e => e.id));
  const parsed = [];
  for (let li = 1; li < lines.length; li++) {
    const row = parseCSVLine(lines[li]);
    if (row.every(c => !c)) continue;
    const name = get(row, "name");
    const email = (get(row, "email") || "").trim();
    if (!name || !email) continue;
    const em = email.toLowerCase();
    if (emailToId.has(em)) continue;
    let ini = get(row, "ini");
    if (!ini) {
      const parts = name.split(/\s+/).filter(Boolean);
      ini = parts.map(w => w[0]).join("").slice(0, 2).toUpperCase() || "NA";
    }
    maxId += 1;
    emailToId.set(em, maxId);
    parsed.push({
      id: maxId,
      ini,
      name,
      email,
      role: get(row, "role") || "Employee",
      dept: get(row, "department") || "—",
      type: get(row, "employment_type") || "Full Time",
      joined: get(row, "date_of_joining") || "—",
      salary: get(row, "salary") || "—",
      phone: get(row, "phone") || "—",
      designation: get(row, "designation") || "—",
      dob: get(row, "dob") || "—",
      avatarC: get(row, "avatar_color") || "#99a98f",
      mgrEmail: get(row, "manager_email").toLowerCase(),
    });
  }
  return parsed.map(({ mgrEmail, ...rest }) => ({
    ...rest,
    devices: [],
    documents: [],
    managerId: mgrEmail ? (emailToId.get(mgrEmail) ?? null) : null,
  }));
}

const ICONS = {
  Dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  Employees: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  "Time Away": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2"/></svg>,
  Paydays: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Recognition: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  "Org Chart": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>,
  "Listening Room": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  Settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  "My Profile": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  "Add Employee": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ClipboardList: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="12" y1="11" x2="16" y2="11"/><line x1="12" y1="16" x2="16" y2="16"/><line x1="8" y1="11" x2="8.01" y2="11"/><line x1="8" y1="16" x2="8.01" y2="16"/></svg>,
  CalendarCheck: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>,
};

const NAV = [
  { key:"Dashboard" },
  { key:"Employees" },
  { key:"Time Away" },
  { key:"Paydays" },
  { key:"Recognition" },
  { key:"Org Chart" },
  { key:"Listening Room" },
  { key:"Settings" },
];

const navItemsForRole = isSA =>
  NAV.map(n => (n.key === "Employees" ? (isSA ? n : { key:"My Profile" }) : n));

function daysInMonth(y, m0) {
  return new Date(y, m0 + 1, 0).getDate();
}
function parseISODate(s) {
  const [y, mo, d] = s.split("-").map(Number);
  return new Date(y, mo - 1, d);
}
function dateInRange(d, fromISO, toISO) {
  const t = d.getTime();
  return t >= parseISODate(fromISO).getTime() && t <= parseISODate(toISO).getTime();
}

/** Mon–Sat are working days; only Sunday is marked as weekly off in calendars. */
function isWeeklyOff(d) {
  return d.getDay() === 0;
}
function leaveColor(status) {
  /** Subtler yellow for pending with a slight transparency for "lighter visual" */
  if (status === "pending") return "rgba(254, 240, 138, 0.5)";
  /** Same fill as <Badge approved /> (`C.surf`). */
  if (status === "approved") return C.surf;
  return "#e5e7eb";
}

/** All leave rows active on a calendar day (inclusive range). */
function leavesOnDate(allLeaves, d) {
  return allLeaves.filter(l => dateInRange(d, l.fromISO, l.toISO));
}

function saDayCellBg(isOff, dayLeaves) {
  if (isOff) return "#e8e8e4";
  if (!dayLeaves.length) return "#ffffff";
  const hasP = dayLeaves.some(l => l.status === "pending");
  const hasA = dayLeaves.some(l => l.status === "approved");
  if (hasP && hasA) return "rgba(253, 230, 138, 0.7)";
  if (hasP) return leaveColor("pending");
  if (hasA) return leaveColor("approved");
  return leaveColor("rejected");
}

const RECOGS = [
  { from:"Arjun Mehta", fIni:"AM", to:"Ridwanul Alam", tIni:"RA", msg:"Thanks for the quick turnaround on the API fix!", time:"10h ago" },
  { from:"Arjun Mehta", fIni:"AM", to:"Priya Sharma",  tIni:"PS", msg:"Great work on the design system docs!", time:"4d ago" },
];

const SOOTHING_GREENS = ["#afc0a5", "#8a9a80", "#a3b18a", "#588157", "#3a5a40", "#7da890", "#6fa88a", "#94a89a"];
const getSoothingGreen = (seed) => {
  if (!seed) return SOOTHING_GREENS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return SOOTHING_GREENS[Math.abs(hash) % SOOTHING_GREENS.length];
};

const Av = ({ ini, sz=34, bg }) => {
  const finalBg = bg && bg !== C.p ? bg : getSoothingGreen(ini);
  return (
    <div style={{ width:sz, height:sz, borderRadius:"50%", background:finalBg, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      color:"#fff", fontSize:sz*0.33, fontWeight:700, fontFamily:"sans-serif",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>{ini}</div>
  );
};

const Badge = ({ s }) => {
  const m = {
    pending:  { bg:"#fef3c7", c:"#7a5a00", lbl:"Pending"  },
    approved: { bg:C.surf, c:"#2d5a3a", lbl:"Approved" },
    rejected: { bg:"#e8e8e3", c:"#555550", lbl:"Rejected" },
  };
  const x = m[s]||m.pending;
  return <span style={{ background:x.bg, color:x.c, padding:"3px 10px", borderRadius:12, fontSize:10, fontWeight:700, letterSpacing:.5 }}>{x.lbl.toUpperCase()}</span>;
};

const Pill = ({ txt, bg, c }) => (
  <span style={{ background:bg, color:c, padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700 }}>{txt}</span>
);

const Btn = ({ children, onClick, variant="primary", style:s={} }) => {
  const base = { border:"none", borderRadius:9, fontSize:12, fontWeight:600, cursor:"pointer", padding:"8px 18px", transition:"opacity .15s", ...s };
  const v = variant==="primary" ? { background:C.p,   color:"#2a3326" }
          : variant==="ghost"   ? { background:"transparent", border:`1px solid ${C.bdr}`, color:C.sub }
          : variant==="outline" ? { background:C.surf, border:`1px solid ${C.bdr}`, color:C.txt }
          :                       { background:C.mid,  border:`1px solid ${C.bdr}`, color:C.txt };
  return (
    <button onClick={onClick} style={{...base,...v}}
      onMouseEnter={e=>e.currentTarget.style.opacity=".82"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{children}</button>
  );
};

const Card = ({ children, style:s={} }) => (
  <div style={{
    background:C.wht, borderRadius:14, border:`1px solid ${C.bdr}`,
    padding:"clamp(16px, 3.5vw, 22px) clamp(16px, 4vw, 24px)",
    ...s,
  }}>{children}</div>
);

/** Accent-bar panel for Settings (matches Dashboard / Listening Room cards). */
const SettingsPanel = ({ label, title, accent = C.p, children, style: wrapStyle = {} }) => (
  <div style={{
    position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
    padding:"20px 22px 22px", marginBottom:16, boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06)",
    overflow:"hidden", ...wrapStyle,
  }}>
    <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:accent, borderRadius:"4px 0 0 4px" }} />
    <div style={{ paddingLeft:8 }}>
      {label ? (
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>{label}</div>
      ) : null}
      {title ? (
        <h2 style={{ margin:"0 0 14px", fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>{title}</h2>
      ) : null}
      {children}
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:C.txt, fontFamily:"Georgia,serif" }}>{children}</h3>
);

const Inp = ({ label, type="text", opts, ...rest }) => (
  <div style={{ marginBottom:13 }}>
    <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>{label.toUpperCase()}</label>
    {opts ? (
      <select style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12, color:C.txt, boxSizing:"border-box" }} {...rest}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    ) : type==="textarea" ? (
      <textarea style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12, color:C.txt, minHeight:70, boxSizing:"border-box", fontFamily:"sans-serif", resize:"vertical" }} {...rest} />
    ) : (
      <input type={type} style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12, color:C.txt, boxSizing:"border-box" }} {...rest} />
    )}
  </div>
);

/** Label + input with fixed ₹ or % on the edge (salary modals). */
const AffixField = ({ label, hint, prefix, suffix, type = "text", value, onChange, style: wrapStyle = {} }) => (
  <div style={{ marginBottom:0, ...wrapStyle }}>
    <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:6, letterSpacing:.5 }}>{label.toUpperCase()}</label>
    {hint ? <div style={{ fontSize:10, color:C.bdr, marginBottom:6, lineHeight:1.35 }}>{hint}</div> : null}
    <div style={{
      display:"flex", alignItems:"stretch", borderRadius:10, border:`1px solid ${C.bdr}`,
      background:C.wht, overflow:"hidden", boxShadow:"inset 0 1px 2px rgba(var(--shadow-rgb),.04)",
    }}>
      {prefix != null && (
        <span style={{
          display:"flex", alignItems:"center", padding:"0 12px", background:C.surf, borderRight:`1px solid ${C.bdr}`,
          fontSize:14, fontWeight:700, color:C.p, fontFamily:"system-ui,sans-serif", userSelect:"none", flexShrink:0,
        }}>{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder="0"
        style={{
          flex:1, minWidth:0, border:"none", outline:"none", padding:"10px 12px", fontSize:13, color:C.txt, background:"transparent", fontVariantNumeric:"tabular-nums",
        }}
      />
      {suffix != null && (
        <span style={{
          display:"flex", alignItems:"center", padding:"0 12px", background:C.surf, borderLeft:`1px solid ${C.bdr}`,
          fontSize:14, fontWeight:700, color:C.p, userSelect:"none", flexShrink:0,
        }}>{suffix}</span>
      )}
    </div>
  </div>
);

const ModalSectionLabel = ({ children }) => (
  <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1.2, marginBottom:12, marginTop:4 }}>{children}</div>
);

const Modal = ({ title, onClose, children, width=480 }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(var(--shadow-rgb),.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"clamp(10px, 2.5vw, 20px)" }}
    onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{ background:C.wht, borderRadius:18, padding:"clamp(18px, 5vw, 30px)", width, maxWidth:"min(92vw, 100%)", maxHeight:"88vh", overflowY:"auto", boxSizing:"border-box" }}>
      <div style={{ display:"flex", justifyContent: title ? "space-between" : "flex-end", alignItems:"center", marginBottom: title ? 22 : 4 }}>
        {title ? <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:19, color:C.txt }}>{title}</h2> : null}
        <button type="button" onClick={onClose} style={{ background:"none", border:"none", fontSize:18, color:C.sub, cursor:"pointer", padding:4, lineHeight:1 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const TabBar = ({ tabs, active, setActive, style: tabStyle = {}, inline = false }) => (
  <div style={{
    display:"flex",
    flexWrap:"wrap",
    gap:3,
    marginBottom:20,
    background:C.wht,
    borderRadius:10,
    padding:4,
    border:`1px solid ${C.bdr}`,
    boxSizing:"border-box",
    ...(inline
      ? { width: "fit-content", maxWidth: "100%", flexShrink: 0, alignSelf: "flex-start" }
      : { width: "min(max-content, 100%)", maxWidth: "100%" }),
    ...tabStyle,
  }}>
    {tabs.map(t=>(
      <button key={t} onClick={()=>setActive(t)} style={{
        padding:"6px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12,
        fontWeight: active===t ? 700 : 400,
        background: active===t ? C.p : "transparent",
        color:      active===t ? "#fff" : C.sub,
        transition:"all .15s",
      }}>{t}</button>
    ))}
  </div>
);

const Verified = () => (
  <span title="Verified" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:16, height:16, borderRadius:"50%", background:"#22c55e", color:"#fff", fontSize:10, fontWeight:800, marginLeft:6 }}>✓</span>
);

const OrgTreeNode = ({ empId, orgManagers, depth = 0, empList = EMPS }) => {
  const e = empById(empId, empList);
  if (!e) return null;
  const reports = empList.filter(x => orgManagers[x.id] === empId);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{
        padding:"12px 16px", borderRadius:14, border:`2px solid ${depth === 0 ? C.p : C.bdr}`, background:C.wht,
        minWidth:128, textAlign:"center", boxShadow:"0 2px 8px rgba(var(--shadow-rgb),.06)",
      }}>
        <Av ini={e.ini} sz={36} bg={e.avatarC} />
        <div style={{ fontSize:11, fontWeight:700, color:C.txt, marginTop:6 }}>{e.name}</div>
        <div style={{ fontSize:10, color:C.sub }}>{e.designation}</div>
        <div style={{ fontSize:9, color:C.bdr, marginTop:4 }}>{e.dept}</div>
      </div>
      {reports.length > 0 && (
        <>
          <div style={{ width:2, height:16, background:C.bdr, flexShrink:0 }} />
          <div style={{ display:"flex", gap:14, alignItems:"flex-start", justifyContent:"center", flexWrap:"wrap" }}>
            {reports.map(r => (
              <OrgTreeNode key={r.id} empId={r.id} orgManagers={orgManagers} depth={depth + 1} empList={empList} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/** Format a timestamp for display in timeline. */
function fmtTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

const TIMELINE_ICONS = {
  joined:       { icon: "⭐", color: "#afc0a5" },
  role_change:  { icon: "💼", color: "#6fa8c4" },
  dept_change:  { icon: "🏢", color: "#a09060" },
  salary_update:{ icon: "💰", color: "#7da890" },
  doc_upload:   { icon: "📄", color: "#9a8fc0" },
  asset_assign: { icon: "💻", color: "#c09060" },
  asset_return: { icon: "↩️",  color: "#9a9a9a" },
  offboarded:   { icon: "🛎️", color: "#d08080" },
};

const ActivityTimeline = ({ events }) => {
  if (!events || events.length === 0) return (
    <div style={{ color:C.sub, fontSize:12, padding:"16px 0" }}>No activity recorded yet.</div>
  );
  const sorted = [...events].sort((a,b) => b.ts - a.ts);
  return (
    <div style={{ position:"relative", paddingLeft:28 }}>
      <div style={{ position:"absolute", left:10, top:4, bottom:4, width:2, background:C.bdr, borderRadius:2 }} />
      {sorted.map((ev, i) => {
        const meta = TIMELINE_ICONS[ev.type] ?? { icon:"📌", color:C.sub };
        return (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:16, position:"relative" }}>
            <div style={{
              position:"absolute", left:-22, top:2, width:18, height:18, borderRadius:"50%",
              background:meta.color, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, boxShadow:`0 0 0 3px ${C.bg}`,
            }}>{meta.icon}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{ev.label}</div>
              <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>{fmtTimestamp(ev.ts)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProfileDetail = ({ e, wrapCard = true, empList = EMPS, narrow = false }) => {
  const mgr = mgrName(e.managerId, empList);
  const isOffboarded = e.status === "offboarded";
  const body = (
    <>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:22, paddingBottom:20, borderBottom:`1px solid ${C.bdr}`, flexWrap:"wrap" }}>
        <Av ini={e.ini} sz={56} bg={e.avatarC} />
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:C.txt }}>{e.name}</div>
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20,
              background: isOffboarded ? "#b04040" : "#4a7c59",
              color:"#fff", letterSpacing:.5 }}>{isOffboarded ? "OFFBOARDED" : "ACTIVE"}</span>
          </div>
          <div style={{ fontSize:12, color:C.sub, marginTop:4 }}>{e.email}</div>
          <div style={{ marginTop:10 }}><Pill txt={e.role} bg={C.surf} c={C.sub} /></div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "160px 1fr", gap:"12px 20px", fontSize:12 }}>
        {[
          ["Phone", e.phone],
          ["Department", e.dept],
          ["Designation", e.designation],
          ["Employment type", e.type],
          ["Joined", e.joined],
          ["Salary", e.salary],
          ["Date of birth", e.dob],
          ["Reporting manager", mgr],
        ].map(([k,v])=>(
          <div key={k} style={{ display:"contents" }}>
            <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5 }}>{k.toUpperCase()}</div>
            <div style={{ color:C.txt }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${C.bdr}` }}>
        <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>ASSIGNED DEVICES</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {(e.devices||[]).map(d => <span key={d} style={{ background:C.surf, padding:"5px 11px", borderRadius:8, fontSize:11, border:`1px solid ${C.bdr}` }}>{d}</span>)}
        </div>
      </div>
      <div style={{ marginTop:16 }}>
        <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>UPLOADED DOCUMENTS</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(e.documents||[]).map((doc,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", fontSize:12, color:C.txt, background:C.surf, padding:"8px 12px", borderRadius:8, border:`1px solid ${C.bdr}` }}>
              <span style={{ flex:1 }}>{doc.n}</span>
              {doc.v ? <Verified /> : <span style={{ fontSize:10, color:C.sub }}>Pending</span>}
            </div>
          ))}
        </div>
      </div>
      {e.emergencyContact?.name && (
        <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${C.bdr}` }}>
          <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>EMERGENCY CONTACT</div>
          <div style={{ fontSize:12, color:C.txt }}>{e.emergencyContact.name} · {e.emergencyContact.phone} · {e.emergencyContact.rel}</div>
        </div>
      )}
      {(e.customFields||[]).length > 0 && (
        <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${C.bdr}` }}>
          <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>CUSTOM FIELDS</div>
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "160px 1fr", gap:"8px 16px", fontSize:12 }}>
            {(e.customFields||[]).map(cf => (
              <div key={cf.k} style={{ display:"contents" }}>
                <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5 }}>{cf.k.toUpperCase()}</div>
                <div style={{ color:C.txt }}>{cf.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(e.timeline||[]).length > 0 && null}
    </>
  );
  return wrapCard ? <Card style={{ maxWidth:640 }}>{body}</Card> : <div>{body}</div>;
};

const PayslipSheet = ({ logoUrl, companyTagline, emp, payslip, breakdown, approverName, narrow = false }) => {
  const b = breakdown;
  const Row = ({ label, value, pct }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"7px 0", fontSize:12, borderBottom:`1px solid ${C.bdr}`, fontFamily:"system-ui,sans-serif" }}>
      <span style={{ color:C.sub }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {pct != null && pct !== "" ? <span style={{ fontSize:10, color:C.bdr }}>{pct}</span> : null}
        <span style={{ fontWeight:600, color:C.txt }}>{value}</span>
      </div>
    </div>
  );
  return (
    <div
      id="payslip-print-root"
      style={{
        background:C.wht, border:`1px solid ${C.bdr}`, borderRadius:12, padding:28, maxWidth:640, margin:"0 auto",
        fontFamily:"Georgia,serif", color:C.txt, boxSizing:"border-box",
        boxShadow:"0 4px 24px rgba(var(--shadow-rgb),.08)",
      }}
    >
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, paddingBottom:18, borderBottom:`2px solid ${C.p}`,
        flexWrap:"wrap", gap:16,
      }}>
        <div style={{ display:"flex", gap:14, alignItems:"center", minWidth:0 }}>
          {logoUrl ? (
            <img src={logoUrl} alt="" style={{ width:54, height:54, borderRadius:10, objectFit:"cover", border:`1px solid ${C.bdr}` }} />
          ) : (
            <div style={{ width:54, height:54, borderRadius:10, background:C.p, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, fontFamily:"system-ui,sans-serif" }}>KS</div>
          )}
          <div>
            <div style={{ fontSize:19, fontWeight:700, letterSpacing:.3 }}>KinSphere</div>
            <div style={{ fontSize:11, color:C.sub, marginTop:3, fontFamily:"system-ui,sans-serif" }}>{companyTagline}</div>
          </div>
        </div>
        <div style={{ textAlign: narrow ? "left" : "right", minWidth: narrow ? "100%" : undefined }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1.2 }}>PAYSLIP</div>
          <div style={{ fontSize:14, fontWeight:700, marginTop:6, fontFamily:"Georgia,serif" }}>{payslip.monthLabel}</div>
          <div style={{ fontSize:10, color:C.sub, marginTop:4, fontFamily:"system-ui,sans-serif" }}>Salary date · {payslip.credited}</div>
        </div>
      </div>

      <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:10 }}>EMPLOYEE</div>
      <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap:12, marginBottom:20, fontSize:12, fontFamily:"system-ui,sans-serif" }}>
        <div><span style={{ color:C.sub, fontSize:10, display:"block" }}>Name</span><span style={{ fontWeight:600 }}>{emp.name}</span></div>
        <div><span style={{ color:C.sub, fontSize:10, display:"block" }}>Designation</span><span>{emp.designation}</span></div>
        <div><span style={{ color:C.sub, fontSize:10, display:"block" }}>Date of joining</span><span>{emp.joined}</span></div>
        <div><span style={{ color:C.sub, fontSize:10, display:"block" }}>Department</span><span>{emp.dept}</span></div>
      </div>

      {b.annual > 0 && (
        <div style={{ fontSize:11, color:C.sub, marginBottom:14, padding:10, background:C.bg, borderRadius:8, border:`1px solid ${C.bdr}`, fontFamily:"system-ui,sans-serif" }}>
          Annual CTC (reference): <strong style={{ color:C.txt }}>{formatInrNum(b.annual)}</strong>
        </div>
      )}

      <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:8 }}>EARNINGS (THIS MONTH)</div>
      <div style={{ marginBottom:16 }}>
        <Row label="Basic salary" value={formatInrNum(b.basic)} pct={b.bp ? `${b.bp}%` : null} />
        <Row label="House rent allowance (HRA)" value={formatInrNum(b.hra)} pct={b.hp ? `${b.hp}%` : null} />
        <Row label="Other allowances" value={formatInrNum(b.other)} pct={b.otherPct != null ? `${b.otherPct}%` : null} />
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0 4px", fontSize:12, fontWeight:700, fontFamily:"system-ui,sans-serif" }}>
          <span>Gross</span>
          <span style={{ color:C.p }}>{b.grossStr}</span>
        </div>
      </div>

      <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:8 }}>DEDUCTIONS (MONTHLY)</div>
      <div style={{ marginBottom:16 }}>
        <Row label="Professional tax" value={formatInrNum(b.pt)} />
        <Row label="Provident fund (PF)" value={formatInrNum(b.pf)} />
        <Row label="TDS" value={formatInrNum(b.tds)} />
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0 4px", fontSize:12, fontWeight:700, fontFamily:"system-ui,sans-serif", color:C.sub }}>
          <span>Total deductions</span>
          <span>− {formatInrNum(b.totalDed)}</span>
        </div>
      </div>

      <div style={{ padding:"14px 16px", borderRadius:10, background:C.surf, border:`1px solid ${C.bdr}`, marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, fontWeight:700, fontFamily:"Georgia,serif" }}>Net pay credited</span>
          <span style={{ fontSize:20, fontWeight:700, color:C.p, fontFamily:"Georgia,serif" }}>{b.netStr}</span>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:12 }}>
        <div style={{ textAlign:"right", minWidth:200 }}>
          <div style={{ borderTop:`1px solid ${C.txt}`, marginTop:36, marginBottom:8, opacity:.85 }} />
          <div style={{ fontSize:12, fontWeight:700, fontFamily:"Georgia,serif" }}>{approverName}</div>
          <div style={{ fontSize:9, color:C.sub, marginTop:4, fontFamily:"system-ui,sans-serif" }}>Authorised signatory</div>
        </div>
      </div>
      <div style={{ marginTop:16, fontSize:9, color:C.bdr, textAlign:"center", fontFamily:"system-ui,sans-serif" }}>
        This is a system-generated document. For queries, contact HR.
      </div>
    </div>
  );
};

export default function App() {
  const [page,       setPage]     = useState("Dashboard");
  const [role,       setRole]     = useState("Super Admin");
  const isSA  = role === "Super Admin";
  
  const [employees, setEmployees] = useState(() => JSON.parse(JSON.stringify(EMPS)));
  const [leaves,     setLeaves]   = useState(INIT_LEAVES);
  const [holidays, setHolidays]   = useState(INIT_HOLIDAYS);

  const [leaveApply, setLeaveApply] = useState({
    forEmpId: ME_ID,
    type: "Sick Leave",
    from: "",
    to: "",
    approver: "",
    reason: "",
    halfDay: false,
    halfDayPart: "First half",
  });

  const [lvTab,      setLvTab]    = useState("All");
  const [pyTab,      setPyTab]    = useState("All Payslips");
  const [payYear,    setPayYear]  = useState(2026);
  const [payMonthFilter, setPayMonthFilter] = useState(null);
  const [showLeave,  setShowLeave]= useState(false);
  const [showToast,  setShowToast]= useState("");
  const [msgs,       setMsgs]     = useState([]);
  const [input,      setInput]    = useState("");
  const [empSearch,  setEmpSearch]= useState("");
  const [profilePick, setProfilePick] = useState(null);
  const [lvViewMode, setLvViewMode]   = useState("Table");
  const [leaveCalMonth, setLeaveCalMonth] = useState(() => new Date(2026, 2, 1));
  const [payrollRows, setPayrollRows] = useState(PAYROLL);
  const [salaryModal, setSalaryModal] = useState(null);
  const [salaryForm, setSalaryForm]   = useState(DEFAULT_SALARY_CFG);
  const [salaryConfigs, setSalaryConfigs] = useState({
    PS: { annualCtc: "1200000", basicPct: "50", hraPct: "20", profTax: "200", pf: "1800", tds: "800" },
  });
  const [orgManagers, setOrgManagers]  = useState({ 1:null, 2:1, 3:1, 4:2, 5:1 });
  const [showOrgEdit, setShowOrgEdit] = useState(false);
  const [saCalTooltip, setSaCalTooltip] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);
  const [companyTagline, setCompanyTagline] = useState("Bipolar Factory");
  const [showTaglineEdit, setShowTaglineEdit] = useState(false);
  const [taglineDraft, setTaglineDraft] = useState("");
  const [payslipPreview, setPayslipPreview] = useState(null);
  const [brandLogoHovered, setBrandLogoHovered] = useState(false);
  
  const [showImportCsv, setShowImportCsv] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayDesc, setNewHolidayDesc] = useState("");
  
  const [payrollStatus, setPayrollStatus] = useState("Draft");
  const [payrollStep, setPayrollStep] = useState(0); // 0: Home, 1: Review, 2: Summary
  const [selectedPayIds, setSelectedPayIds] = useState([]);
  const [editedSalaries, setEditedSalaries] = useState({}); // { [payId]: newNet }
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [processedPayments, setProcessedPayments] = useState({}); // { "monthLabel": true }
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [showAssignDevice, setShowAssignDevice] = useState(false);
  const [showUploadDoc, setShowUploadDoc] = useState(false);
  const [showOffboard, setShowOffboard] = useState(false);

  const handleProcessPayments = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newProcessed = { ...processedPayments };
      const currentPayslips = saPayslipRows.filter(p => selectedPayIds.includes(p.id));
      let totalAmt = 0;
      currentPayslips.forEach(p => {
        newProcessed[p.id] = true;
        totalAmt += parseInr(editedSalaries[p.id] || p.net);
      });
      setProcessedPayments(newProcessed);
      // We don't set payrollStatus to "Paid" globally anymore, just show logs
      setPaymentLogs(prev => [{
        ts: new Date().toLocaleString("en-IN"),
        actor: "Arjun Mehta",
        monthYear: `${MONTHS_SHORT[payMonthFilter ?? new Date().getMonth()]} ${payYear}`,
        amount: `₹${totalAmt.toLocaleString("en-IN")}`,
        count: currentPayslips.length
      }, ...prev]);
      setIsProcessingPayment(false);
      setPayrollStep(0);
      setSelectedPayIds([]);
      toast(`${currentPayslips.length} payments processed successfully ✓`);
    }, 2000);
  };
  const [showTimeline, setShowTimeline] = useState(null); // holds the employee object
  const [devForm, setDevForm] = useState({ name: "", type: "Laptop", model: "", serial: "", tag: "" });
  const [docForm, setDocForm] = useState({ name: "", type: "ID", file: "" });
  const [offForm, setOffForm] = useState({ date: "", reason: "Resignation" });
  const [empListTab, setEmpListTab] = useState("Active");
  const [offboardedEmployees, setOffboardedEmployees] = useState([]);
  const [empCustomFieldKey, setEmpCustomFieldKey] = useState("");
  const [empCustomFieldVal, setEmpCustomFieldVal] = useState("");

  /** Leave Policy: SA-configurable allocations per leave type */
  const [leavePolicy, setLeavePolicy] = useState({
    "Sick Leave":    { total: 12, accrual: "annual" },
    "Earned Leave":  { total: 15, accrual: "annual" },
    "Casual Leave":  { total: 6,  accrual: "annual" },
  });
  const [showLeavePolicy, setShowLeavePolicy] = useState(false);
  const [policyDraft, setPolicyDraft] = useState(null);

  /** Compute used days per leave type for a given empId */
  const usedLeave = (empId, type) => {
    return leaves
      .filter(l => l.empId === empId && l.type === type && l.status !== "rejected")
      .reduce((sum, l) => {
        if (!l.fromISO || !l.toISO) return sum;
        const days = Math.max(1, Math.round((new Date(l.toISO).getTime() - new Date(l.fromISO).getTime()) / 864e5) + 1);
        return sum + (l.halfDay ? 0.5 : days);
      }, 0);
  };

  /** Days being requested in current apply form */
  const applyDayCount = (() => {
    if (!leaveApply?.from || !leaveApply?.to) return 0;
    const d = Math.max(1, Math.round((new Date(leaveApply.to).getTime() - new Date(leaveApply.from).getTime()) / 864e5) + 1);
    return leaveApply?.halfDay ? 0.5 : d;
  })();

  /** Conflict: other approved/pending leaves overlapping applied date range */
  const leaveConflicts = (() => {
    if (!leaveApply?.from || !leaveApply?.to) return [];
    const empId = isSA ? leaveApply.forEmpId : ME_ID;
    return leaves.filter(l =>
      l.empId !== empId &&
      l.status !== "rejected" &&
      l.fromISO && l.toISO &&
      l.fromISO <= leaveApply.to &&
      l.toISO >= leaveApply.from
    );
  })();

  /** Append a timeline event to an employee by id. */
  const logEvent = (empId, type, label, list = employees, setFn = setEmployees) => {
    setFn(prev => prev.map(e => e.id === empId ? {
      ...e,
      timeline: [...(e.timeline || []), { type, label, ts: Date.now() }]
    } : e));
  };

  /** Seed initial timeline events from emp.joined dates. */
  useEffect(() => {
    setEmployees(prev => prev.map(e => (e.timeline ? e : {
      ...e,
      status: "active",
      emergencyContact: { name:"", phone:"", rel:"" },
      customFields: [],
      timeline: [{ type:"joined", label:`Joined the company (${e.joined})`, ts: Date.now() - 1e9 }]
    })));
  }, []);
  const [showEmp,    setShowEmp]  = useState(false);
  const [empForm, setEmpForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "",
    role: "Employee", type: "Full Time", doj: "", designation: "", dept: "Technology", manager: "No Manager"
  });
  useEffect(() => {
    if (showEmp && profilePick) {
      const e = empById(profilePick, employees);
      if (!e) return;
      const [fName, ...lName] = e.name.split(" ");
      setEmpForm({
        firstName: fName || "",
        lastName: lName.join(" "),
        email: e.email || "",
        phone: e.phone || "",
        dob: e.dob || "",
        role: e.role || "Employee",
        type: e.type || "Full Time",
        doj: e.joined || "",
        designation: e.designation || "",
        dept: e.dept || "—",
        manager: empById(e.managerId, employees)?.name || "No Manager"
      });
    } else if (showEmp) {
      setEmpForm({
        firstName: "", lastName: "", email: "", phone: "", dob: "",
        role: "Employee", type: "Full Time", doj: "", designation: "", dept: "Technology", manager: "No Manager"
      });
    }
  }, [showEmp, profilePick]);
  /** Pending leave approve/reject confirmation { id, act } */
  const [leaveActionConfirm, setLeaveActionConfirm] = useState(null);
  const chatRef = useRef(null);
  const logoInputRef = useRef(null);
  const payslipDocRef = useRef(null);
  const importCsvRef = useRef(null);

  const [navOpen, setNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const isAdmin = role === "Admin";
  const navItems = navItemsForRole(isSA);
  useEffect(() => {
    if (isDark) document.documentElement.className = 'dark';
    else document.documentElement.className = '';
  }, [isDark]);
  const [winW, setWinW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1200));
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const narrow = winW < 768;
  const pad = narrow ? 14 : 36;
  const padBottom = narrow ? 24 : 36;
  const heroPadDash = `${narrow ? 22 : 36}px ${pad}px ${narrow ? 24 : 32}px`;
  const heroPadStd = `${narrow ? 22 : 32}px ${pad}px ${narrow ? 22 : 28}px`;

  const h = new Date().getHours();
  const greet = h<12?"Good morning":h<17?"Good afternoon":"Good evening";

  const toast = msg => { setShowToast(msg); setTimeout(()=>setShowToast(""),2800); };
  const downloadPayslipHtml = () => {
    const el = payslipDocRef.current?.querySelector("#payslip-print-root") || payslipDocRef.current;
    if (!el || !payslipPreview) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Payslip</title><style>body{margin:0;padding:24px;background:#f5f5f0;}</style></head><body>${el.outerHTML}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const safe = s => String(s || "doc").replace(/[^\w\-.]+/g, "-");
    a.download = `payslip-${safe(payslipPreview.name)}-${safe(payslipPreview.monthLabel)}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast("Downloaded — open the file and use Print → Save as PDF");
  };
  const actLeave = (id, act) => {
    const row = leaves.find(l => l.id === id);
    setLeaves(p=>p.map(l=>l.id===id ? {...l,status:act} : l));
    if (row) {
      toast(`${act === "approved" ? "Approved" : "Rejected"} leave for ${row.emp} — they have been notified ✓`);
    }
  };
  const promptLeaveAction = (id, act) => setLeaveActionConfirm({ id, act });
  const filteredLeaves = lvTab==="All" ? leaves : leaves.filter(l=>l.status===lvTab.toLowerCase());
  const filteredEmps = (empListTab === "Active" ? employees : offboardedEmployees)
    .filter(e => e.name.toLowerCase().includes(empSearch.toLowerCase()) || (e.dept||"").toLowerCase().includes(empSearch.toLowerCase()));
  const me = employees.find(e=>e.id===ME_ID) ?? employees[0];
  const myPendingTaggedApprovals = leaves.filter(l => canActOnTaggedLeave(l, me.name, employees));
  const allPendingLeaves = leaves.filter(l => l.status === "pending");
  const pendingApprovalsForDashboard = isSA ? allPendingLeaves : myPendingTaggedApprovals;
  const [dummy, setDummy] = useState(null);
  const dashDateLabel = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
  const todayISO = new Date().toISOString().slice(0, 10);
  const onLeaveTodayCount = leaves.filter(
    l => l.status === "approved" && l.fromISO <= todayISO && l.toISO >= todayISO
  ).length;
  const myLeaves = leaves.filter(l => l.empId === ME_ID);
  const saPayslipRows = DEMO_PAYSLIPS.filter(p =>
    p.year === payYear && (payMonthFilter === null || p.month === payMonthFilter)
  ).sort((a, b) => a.month - b.month || a.name.localeCompare(b.name));
  const myPayslipRows = DEMO_PAYSLIPS.filter(p => p.empId === ME_ID && p.year === payYear)
    .sort((a, b) => b.month - a.month);
  const onEmpProfilePage = page === "Employees" || page === "My Profile";

  useEffect(() => {
    if (!isSA && page === "Employees") setPage("My Profile");
    if (isSA && page === "My Profile") setPage("Employees");
  }, [role, isSA, page]);

  useEffect(() => {
    setNavOpen(false);
  }, [page]);

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[msgs]);

  useEffect(() => {
    if (!showLeave) return;
    setLeaveApply({
      forEmpId: ME_ID,
      type: "Sick Leave",
      from: "",
      to: "",
      approver: "",
      reason: "",
      halfDay: false,
      halfDayPart: "First half",
    });
  }, [showLeave]);

  const sendMsg = () => {
    if(!input.trim()) return;
    const q=input; setInput("");
    setMsgs(p=>[...p,{from:"me",txt:q}]);
    setTimeout(()=>setMsgs(p=>[...p,{from:"ai",txt:`I hear you. It sounds like "${q.slice(0,40)}${q.length>40?"...":""}" is weighing on you. Would you like to unpack that a bit more, or just sit with it for now?`}]),800);
  };

  const mobileHeaderTop = "calc(52px + env(safe-area-inset-top, 0px))";

  return (
    <div style={{
      display:"flex",
      flexDirection: narrow ? "column" : "row",
      height:"100vh",
      maxHeight:"100dvh",
      background:C.bg,
      fontFamily:"'Inter',system-ui,sans-serif",
      overflow:"hidden",
      fontSize:13,
      color:C.txt,
      position:"relative",
    }}>
      {narrow && (
        <header
          style={{
            flexShrink:0,
            display:"flex",
            alignItems:"center",
            gap:12,
            minHeight: mobileHeaderTop,
            padding:"8px 14px",
            paddingTop:"max(8px, env(safe-area-inset-top, 0px))",
            background:C.dk,
            borderBottom:`1px solid ${C.dk2}`,
            zIndex:210,
            boxSizing:"border-box",
          }}
        >
          <button
            type="button"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={() => setNavOpen(o => !o)}
            style={{
              width:42,
              height:38,
              borderRadius:9,
              border:`1px solid ${C.dk2}`,
              background:"rgba(255,255,255,.08)",
              color:C.dkAcc,
              fontSize:18,
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              flexShrink:0,
            }}
          >
            {navOpen ? "✕" : "☰"}
          </button>
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15, fontFamily:"Georgia,serif", lineHeight:1.2 }}>KinSphere</div>
            <div style={{ color:C.dkAcc, fontSize:10, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{page}</div>
          </div>
        </header>
      )}
      {narrow && navOpen && (
        <div
          role="presentation"
          aria-hidden
          onClick={() => setNavOpen(false)}
          style={{
            position:"fixed",
            top: mobileHeaderTop,
            left:0,
            right:0,
            bottom:0,
            background:"rgba(var(--shadow-rgb),.45)",
            zIndex:199,
          }}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: narrow ? 268 : 214,
        background:C.dk,
        display:"flex",
        flexDirection:"column",
        flexShrink:0,
        boxSizing:"border-box",
        ...(narrow ? {
          position:"fixed",
          top: mobileHeaderTop,
          left: 0,
          bottom: 0,
          zIndex: 200,
          transform: navOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.22s ease",
          boxShadow: navOpen ? "6px 0 28px rgba(0,0,0,.22)" : "none",
        } : {}),
      }}>
        {/* Brand */}
        <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${C.dk2}` }}>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            style={{ display:"none" }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (!f || !f.type.startsWith("image/")) return;
              const r = new FileReader();
              r.onload = () => setCompanyLogoUrl(String(r.result));
              r.readAsDataURL(f);
              e.target.value = "";
            }}
          />
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div
              style={{ position:"relative", width:36, height:36, borderRadius:8, overflow:"hidden", flexShrink:0, border:`1px solid ${C.dk2}` }}
              onMouseEnter={()=>isSA && setBrandLogoHovered(true)}
              onMouseLeave={()=>setBrandLogoHovered(false)}
            >
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              ) : (
                <div style={{ width:"100%", height:"100%", background:C.p, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:11 }}>KS</div>
              )}
              {isSA && (
                <button
                  type="button"
                  title="Upload company logo"
                  onClick={()=>logoInputRef.current?.click()}
                  style={{
                    position:"absolute", inset:0, border:"none", borderRadius:7, cursor:"pointer",
                    background:"rgba(var(--shadow-rgb),.65)", display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                    opacity: brandLogoHovered ? 1 : 0, transition:"opacity .15s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </button>
              )}
            </div>
            <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", justifyContent:"center", gap:3 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, fontFamily:"Georgia,serif", lineHeight:1.25, margin:0 }}>KinSphere</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, minHeight:14 }}>
                <span style={{ color:C.dkAcc, fontSize:9, letterSpacing:.3, lineHeight:1.25 }}>{companyTagline}</span>
                {isSA && (
                  <button
                    type="button"
                    title="Edit company tagline"
                    onClick={() => { setTaglineDraft(companyTagline); setShowTaglineEdit(true); }}
                    style={{
                      background:"none", border:"none", color:C.p, cursor:"pointer", fontSize:11, padding:0, lineHeight:1, flexShrink:0,
                    }}
                  >✎</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {navItems.map(n => {
            const on = page===n.key;
            return (
              <div key={n.key} onClick={()=>setPage(n.key)} style={{
                display:"flex", alignItems:"center", gap:9, padding:"8px 11px",
                borderRadius:8, marginBottom:2, cursor:"pointer", transition:"all .15s",
                background: on ? C.p   : "transparent",
                color:      on ? "#fff" : C.dkAcc,
                fontWeight: on ? 600   : 400, fontSize:12,
              }}
                onMouseEnter={e=>{ if(!on) e.currentTarget.style.background="rgba(var(--p-rgb),.2)"; }}
                onMouseLeave={e=>{ if(!on) e.currentTarget.style.background="transparent"; }}>
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", width:18, height:18, flexShrink:0 }}>{ICONS[n.key]}</span>
                {n.key}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop:`1px solid ${C.dk2}`, padding:"12px 10px" }}>
          <div style={{ marginBottom:10 }}>
            <div style={{ color:C.dkAcc, fontSize:9, marginBottom:6, letterSpacing:.6 }}>SWITCH ROLE</div>
            <div style={{ display:"flex", background:C.dk2, borderRadius:7, overflow:"hidden" }}>
              {["Super Admin","Admin","Employee"].map(r=>(
                <button key={r} onClick={()=>setRole(r)} title={r} style={{
                  flex:1, padding:"5px 2px", border:"none", cursor:"pointer", transition:"all .15s",
                  background: role===r ? C.p       : "transparent",
                  color:      role===r ? "#fff"    : C.dkAcc,
                  fontSize:8, fontWeight: role===r ? 700 : 400,
                }}>{r==="Super Admin"?"SA":r==="Admin"?"AD":"EE"}</button>
              ))}
            </div>
            <div style={{ color:C.p, fontSize:9, marginTop:4, textAlign:"center" }}>{role}</div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              width:"100%", textAlign:"left", background:"transparent", border:"none", cursor:"pointer",
              padding:"10px 12px", color:C.dkAcc, fontSize:13, fontWeight:600, borderRadius:8,
              display:"flex", alignItems:"center", gap:8, marginBottom:16, marginTop:8,
              transition:"background .12s, color .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.06)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.dkAcc; }}
          >
            <span style={{ fontSize:15 }}>{isDark ? "🔆" : "🌙"}</span>
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Av ini={me.ini} sz={30} bg={me.avatarC} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#fff", fontSize:11, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{me.name}</div>
              <div style={{ color:C.dkAcc, fontSize:9 }}>{role}</div>
            </div>
            <button
              type="button"
              onClick={() => toast("Logged out ✓")}
              title="Log out"
              style={{
                flexShrink:0,
                padding:"6px 10px",
                borderRadius:8,
                border:`1px solid ${C.dk2}`,
                background:"rgba(255,255,255,.06)",
                color:C.dkAcc,
                fontSize:10,
                fontWeight:600,
                cursor:"pointer",
                letterSpacing:0.2,
                transition:"background .12s, border-color .12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(var(--p-rgb),.2)"; e.currentTarget.style.borderColor=C.p; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.06)"; e.currentTarget.style.borderColor=C.dk2; }}
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{
        flex:1,
        minWidth:0,
        minHeight:0,
        overflowY:"auto",
        overflowX:"hidden",
        background:C.bg,
        position:"relative",
        WebkitOverflowScrolling:"touch",
        paddingBottom: narrow ? "env(safe-area-inset-bottom, 0px)" : undefined,
      }}>

        {showToast && (
          <div style={{
            position:"fixed",
            top: narrow ? 12 : 20,
            left: narrow ? 12 : "auto",
            right: 12,
            maxWidth: narrow ? "calc(100vw - 24px)" : 420,
            background:C.dk,
            color:"#fff",
            padding:"10px 16px",
            borderRadius:10,
            zIndex:300,
            fontSize:12,
            fontWeight:600,
            boxSizing:"border-box",
            wordBreak:"break-word",
          }}>{showToast}</div>
        )}

        {saCalTooltip && (
          <div
            style={{
              position:"fixed",
              left: saCalTooltip.left,
              top: saCalTooltip.top,
              zIndex: 400,
              pointerEvents:"none",
              background: C.dk,
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 11,
              lineHeight: 1.45,
              maxWidth: 300,
              boxShadow: "0 8px 24px rgba(0,0,0,.18)",
            }}
          >
            {saCalTooltip.lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        {/* ─ DASHBOARD ─ */}
        {page==="Dashboard" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            {/* Hero */}
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadDash,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
                  fontSize:10, fontWeight:700, letterSpacing:.8, color:C.sub, textTransform:"uppercase" }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:C.p, boxShadow:`0 0 0 3px rgba(var(--p-rgb),.25)` }} />
                  Today
                </div>
                <h1 style={{
                  fontFamily:"Georgia,serif", fontSize:"clamp(28px, 4vw, 34px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.15,
                  letterSpacing:"-.02em",
                }}>{greet}, Arjun</h1>
                <p style={{
                  color:C.sub, margin:"10px 0 0", fontSize:13, maxWidth:480, lineHeight:1.5,
                }}>
                  <span style={{ color:C.txt, fontWeight:600 }}>{dashDateLabel}</span>
                  {" · "}
                  Here’s a snapshot of your workspace — people, time away, and what’s next on the calendar.
                </p>
              </div>
            </div>

            {/* Metric row — pending KPI only for Super Admin (Admin/Employee see pending in the split leave card below) */}
            <div style={{
              display:"grid",
              gridTemplateColumns: narrow
                ? "1fr"
                : `repeat(${2 + (isSA && pendingApprovalsForDashboard.length > 0 ? 1 : 0)}, minmax(0, 1fr))`,
              gap:16,
              marginBottom:20,
            }}>
              {[
                { lbl:"Total employees", val:String(employees.length), sub:"Active directory", icon:ICONS.Users,
                  accent:C.p, iconBg:C.surf },
                ...(isSA && pendingApprovalsForDashboard.length > 0
                  ? [{ lbl:"Pending leave approvals", val:String(pendingApprovalsForDashboard.length), sub:"All pending requests", icon:ICONS.ClipboardList,
                    accent:"#b8860b", iconBg:C.surf }]
                  : []),
                { lbl:"On leave today", val:String(onLeaveTodayCount), sub:"Approved time away", icon:ICONS.CalendarCheck,
                  accent:"#4a6b42", iconBg:C.surf },
              ].map(m=>(
                <div
                  key={m.lbl}
                  style={{
                    position:"relative",
                    background:C.wht,
                    borderRadius:16,
                    border:`1px solid ${C.bdr}`,
                    padding:"20px 20px 18px",
                    boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
                    overflow:"hidden",
                  }}
                >
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:m.accent, borderRadius:"4px 0 0 4px" }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, paddingLeft:6 }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:C.sub, textTransform:"uppercase", marginBottom:8 }}>{m.lbl}</div>
                      <div style={{ fontSize:34, fontWeight:700, color:C.txt, lineHeight:1, fontVariantNumeric:"tabular-nums", letterSpacing:"-.03em" }}>{m.val}</div>
                      <div style={{ fontSize:11, color:C.bdr, marginTop:8 }}>{m.sub}</div>
                    </div>
                    <div style={{
                      width:52, height:52, borderRadius:14, background:m.iconBg || "rgba(var(--p-rgb),.15)",
                      display:"flex", alignItems:"center", justifyContent:"center", color:C.p2,
                      boxShadow:"inset 0 1px 0 rgba(255,255,255,.5), 0 2px 8px rgba(var(--p-rgb),.1)",
                      flexShrink:0, border:`1px solid ${C.bdr}`,
                    }}>{m.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div style={{
              display:"grid",
              gridTemplateColumns: narrow ? "1fr" : "minmax(0, 1.15fr) minmax(0, 0.85fr)",
              gap:16,
              marginBottom:16,
            }}>
              {isSA ? (
              <div style={{
                background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                padding:"22px 24px 20px",
                boxShadow:"0 2px 20px rgba(var(--shadow-rgb),.05)",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>QUEUE</div>
                    <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Pending approvals</h2>
                    <p style={{ margin:"6px 0 0", fontSize:11, color:C.sub, lineHeight:1.45, maxWidth:440 }}>
                      You see <strong style={{ color:C.txt }}>every</strong> pending leave request. Others only see requests where they’re the tagged approver.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={()=>setPage("Time Away")}
                    style={{
                      border:"none", background:"transparent", cursor:"pointer",
                      fontSize:12, fontWeight:600, color:C.p, padding:"6px 0",
                    }}
                  >
                    Open Time Away →
                  </button>
                </div>
                {pendingApprovalsForDashboard.length===0
                  ? (
                    <div style={{
                      textAlign:"center", padding:"28px 16px",
                      borderRadius:12, background:`linear-gradient(180deg, ${C.bg}, ${C.surf})`,
                      border:`1px dashed ${C.bdr}`,
                    }}>
                      <div style={{ fontSize:28, marginBottom:8, opacity:.9 }}>✓</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>All caught up</div>
                      <div style={{ fontSize:12, color:C.sub, marginTop:4 }}>
                        No pending leave requests right now.
                      </div>
                    </div>
                  )
                  : pendingApprovalsForDashboard.map(l=>(
                      <div
                        key={l.id}
                        style={{
                          display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                          padding:"12px 14px", marginBottom:8, borderRadius:12,
                          border:`1px solid ${C.bdr}`,
                          background:C.bg,
                          transition:"box-shadow .15s",
                        }}
                      >
                        <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                          <Av ini={l.ini} sz={34} bg={C.p} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{l.emp}</div>
                            <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>
                              {l.type} · {l.from}–{l.to} · {l.days}
                            </div>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          <Btn variant="outline" onClick={()=>promptLeaveAction(l.id,"approved")} style={{ padding:"6px 12px", fontSize:10 }}>Approve</Btn>
                          <Btn variant="ghost"   onClick={()=>promptLeaveAction(l.id,"rejected")} style={{ padding:"6px 12px", fontSize:10 }}>Reject</Btn>
                        </div>
                      </div>
                    ))}
              </div>
              ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16, minWidth:0 }}>
                {/* KPI-style card — Time away */}
                <div style={{
                  position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                  padding:"20px 22px 22px", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset", overflow:"hidden",
                }}>
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p, borderRadius:"4px 0 0 4px" }} />
                  <div style={{ paddingLeft:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>LEAVES</div>
                        <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Time away</h2>
                        <p style={{ margin:"6px 0 0", fontSize:11, color:C.sub, lineHeight:1.45, maxWidth:440 }}>
                          Your submitted leave requests and status.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={()=>setPage("Time Away")}
                        style={{ border:"none", background:"transparent", cursor:"pointer", fontSize:11, fontWeight:600, color:C.p, padding:"4px 0", flexShrink:0 }}
                      >
                        Time Away →
                      </button>
                    </div>
                    {myLeaves.length === 0 ? (
                      <div style={{ fontSize:12, color:C.sub, lineHeight:1.55, padding:"4px 0 2px" }}>
                        No leave requests yet. Use <strong style={{ color:C.txt }}>Quick actions</strong> to apply when you need time away.
                      </div>
                    ) : (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {myLeaves.map(l => (
                          <div
                            key={l.id}
                            style={{
                              display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
                              padding:"10px 12px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.bg,
                            }}
                          >
                            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                              <Av ini={l.ini} sz={28} bg={C.p} />
                              <div style={{ minWidth:0 }}>
                                <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{l.type}</div>
                                <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>{l.from}–{l.to} · {l.days}</div>
                              </div>
                            </div>
                            <Badge s={l.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* KPI-style card — Pending approvals */}
                <div style={{
                  position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                  padding:"20px 22px 22px", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset", overflow:"hidden",
                }}>
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:"#b8860b", borderRadius:"4px 0 0 4px" }} />
                  <div style={{ paddingLeft:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>APPROVALS</div>
                        <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Pending approvals</h2>
                      </div>
                      {myPendingTaggedApprovals.length > 0 && (
                        <span style={{
                          fontSize:10, fontWeight:800, color:"#7a5a00", background:"#fef3c7", padding:"3px 9px", borderRadius:999,
                        }}>
                          {myPendingTaggedApprovals.length} pending
                        </span>
                      )}
                    </div>
                    <p style={{ margin:"0 0 12px", fontSize:11, color:C.sub, lineHeight:1.45 }}>
                      Admin and Employee requests where you’re the tagged approver.
                    </p>
                    {myPendingTaggedApprovals.length === 0 ? (
                      <div style={{
                        textAlign:"center", padding:"22px 14px",
                        borderRadius:10, background:C.surf, border:`1px dashed ${C.bdr}`, fontSize:12, color:C.sub,
                      }}>
                        Nothing to approve right now.
                      </div>
                    ) : (
                      myPendingTaggedApprovals.map(l => (
                        <div
                          key={l.id}
                          style={{
                            display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
                            padding:"10px 12px", marginBottom:8, borderRadius:12,
                            border:`1px solid ${C.bdr}`, background:C.bg,
                          }}
                        >
                          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                            <Av ini={l.ini} sz={30} bg={C.p} />
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{l.emp}</div>
                              <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>
                                {l.type} · {l.from}–{l.to} · {l.days}
                              </div>
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                            <Btn variant="outline" onClick={()=>promptLeaveAction(l.id,"approved")} style={{ padding:"5px 10px", fontSize:10 }}>Approve</Btn>
                            <Btn variant="ghost"   onClick={()=>promptLeaveAction(l.id,"rejected")} style={{ padding:"5px 10px", fontSize:10 }}>Reject</Btn>
                          </div>
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={()=>setPage("Time Away")}
                      style={{
                        marginTop:12, border:"none", background:"none", cursor:"pointer",
                        fontSize:11, fontWeight:600, color:C.p, padding:0,
                      }}
                    >
                      Open Time Away →
                    </button>
                  </div>
                </div>
              </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{
                  background:`linear-gradient(180deg, ${C.wht} 0%, ${C.bg} 100%)`,
                  borderRadius:16, border:`1px solid ${C.bdr}`,
                  padding:"20px 20px 18px",
                  boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
                }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:6 }}>SHORTCUTS</div>
                  <h2 style={{ margin:"0 0 14px", fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Quick actions</h2>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <button
                      type="button"
                      onClick={()=>setShowLeave(true)}
                      style={{
                        display:"flex", alignItems:"center", gap:12, width:"100%", textAlign:"left",
                        padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`,
                        background:C.wht, cursor:"pointer", fontSize:13, fontWeight:600, color:C.txt,
                        boxShadow:"0 1px 0 rgba(255,255,255,.9) inset",
                      }}
                    >
                      <span style={{ fontSize:20 }}>🗓</span>
                      <span style={{ flex:1 }}>Apply for leave</span>
                      <span style={{ fontSize:16, color:C.bdr }}>→</span>
                    </button>
                    {isSA && (
                      <button
                        type="button"
                        onClick={()=>setShowEmp(true)}
                        style={{
                          display:"flex", alignItems:"center", gap:12, width:"100%", textAlign:"left",
                          padding:"12px 14px", borderRadius:12, border:`1px solid #3a5a40`,
                          background:`linear-gradient(155deg, #7da890 0%, #588157 100%)`,
                          cursor:"pointer", fontSize:13, fontWeight:600, color:"#fff",
                          boxShadow:"0 4px 15px rgba(88,129,87,.4), inset 0 1px 0 rgba(255,255,255,.2)",
                          transform:"translateY(0)", transition:"transform .1s, box-shadow .1s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(88,129,87,.5)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 15px rgba(88,129,87,.4)"; }}
                      >
                        <span style={{ display:"flex", alignItems:"center", opacity:.95 }}>{ICONS["Add Employee"]}</span>
                        <span style={{ flex:1 }}>Add employee</span>
                        <span style={{ fontSize:16, opacity:.9 }}>→</span>
                      </button>
                    )}
                  </div>
                </div>

                <div style={{
                  flex:1, background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                  padding:"20px 20px 16px",
                  boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
                }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Upcoming holidays</h2>
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:.5, color:C.sub, textTransform:"uppercase" }}>India</span>
                  </div>
                  {[...holidays].sort((a,b)=>a.dISO.localeCompare(b.dISO)).map((h,i,a)=>(
                    <div
                      key={h.n}
                      style={{
                        display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12,
                        padding:"10px 0",
                        borderBottom:i < a.length - 1 ? `1px solid ${C.surf}` : "none",
                      }}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                        <span style={{
                          width:8, height:8, borderRadius:"50%", background:C.p, flexShrink:0,
                          boxShadow:`0 0 0 3px ${C.surf}`,
                        }} />
                        <span style={{ color:C.txt, fontWeight:600, fontSize:12 }}>{h.n}</span>
                      </div>
                      <span style={{ fontSize:11, color:C.sub, fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap" }}>{h.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* People row */}
            <div style={{
              display:"grid",
              gridTemplateColumns: narrow ? "1fr" : "repeat(2, minmax(0, 1fr))",
              gap:16,
            }}>
              <div style={{
                background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                padding:"20px 22px", minHeight:120,
                boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
                backgroundImage:`linear-gradient(135deg, ${C.wht} 0%, var(--mid) 55%, ${C.surf} 100%)`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:22 }}>🎂</span>
                  <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Birthdays this month</h2>
                </div>
                <p style={{ margin:0, fontSize:12, color:C.sub, lineHeight:1.55 }}>
                  None in the next 30 days. When someone’s day is near, it’ll show up here so the team can celebrate.
                </p>
              </div>
              <div style={{
                background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                padding:"20px 22px", minHeight:120,
                boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:22 }}>🎉</span>
                  <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Work anniversaries</h2>
                </div>
                <div style={{
                  display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
                  borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg,
                }}>
                  <Av ini="NA" sz={40} bg="#588157" />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>Nihit Agarwal</div>
                    <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>3 years with the team · joined Apr 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─ EMPLOYEES / MY PROFILE ─ */}
        {onEmpProfilePage && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 42%, var(--mid) 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-28, top:-32, width:200, height:200,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.2) 0%, transparent 68%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ maxWidth:640 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.72)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>
                    {isSA ? "◉ Directory" : "◉ You"}
                  </div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>{isSA ? "Employees" : "My Profile"}</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:520 }}>
                    {isSA ? `${employees.length} people at Bipolar Factory — open a row for the full profile.` : "Your details stay private; only you can see this page."}
                  </p>
                </div>
            {isSA && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"flex-end" }}>
                    <Btn variant="outline" onClick={() => { const csv = employeesToCSV(employees); downloadTextFile(`kinsphere-employees-${new Date().toISOString().slice(0,10)}.csv`, csv); toast("CSV exported ✓"); }}>Export CSV</Btn>
                    <Btn variant="outline" onClick={() => setShowImportCsv(true)}>Import CSV</Btn>
                    <Btn onClick={()=>setShowEmp(true)}>+ Add Employee</Btn>
                </div>
            )}
              </div>
            </div>
            {!isSA ? (
              <SettingsPanel label="Profile" title="Your details" accent={C.p}>
                <ProfileDetail e={me} empList={employees} wrapCard={false} narrow={narrow} />
              </SettingsPanel>
            ) : (
              <SettingsPanel label="Directory" title="Team members" accent={C.p}>
                {isSA && (
                  <div style={{ marginBottom:16 }}>
                    <TabBar inline tabs={["Active","Offboarded"]} active={empListTab} setActive={setEmpListTab} style={{ marginBottom:0 }} />
                  </div>
                )}
                <input
                  value={empSearch}
                  onChange={e=>setEmpSearch(e.target.value)}
                  placeholder="Search by name or department…"
                  style={{
                    width:"100%", padding:"11px 16px", borderRadius:12, border:`1px solid ${C.bdr}`,
                    background:C.wht, fontSize:13, color:C.txt, outline:"none", marginBottom:16, boxSizing:"border-box",
                    boxShadow:"inset 0 1px 2px rgba(var(--shadow-rgb),.04)",
                  }}
                />
                <div style={{ borderRadius:14, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(var(--shadow-rgb),.05)" }}>
                  <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                  <table style={{ width:"100%", minWidth: narrow ? 560 : undefined, borderCollapse:"collapse", fontSize:12 }}>
                    <thead>
                      <tr style={{ background:C.surf }}>
                        {["Employee","Department","Role","Type","Joined","Salary"].map(h=>(
                          <th key={h} style={{ padding:"11px 14px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
              {filteredEmps.map(e=>(
                        <tr key={e.id} style={{ borderBottom:`1px solid ${C.surf}`, cursor:"pointer", transition:"background .1s" }}
                          onClick={()=>setProfilePick(e.id)}
                          onMouseEnter={ev=>ev.currentTarget.style.background=C.bg}
                          onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"13px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                              <Av ini={e.ini} sz={32} />
                              <div>
                                <div style={{ fontWeight:600, color:C.txt, display:"flex", alignItems:"center", gap:4 }}>
                                  {e.name}
                                  {isSA && <span style={{ color:C.sub, fontSize:12 }}>↗</span>}
                                </div>
                                <div style={{ fontSize:10, color:C.sub }}>{e.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"13px 14px", color:C.sub }}>{e.dept}</td>
                          <td style={{ padding:"13px 14px" }}><Pill txt={e.role} bg={C.surf} c={C.sub} /></td>
                          <td style={{ padding:"13px 14px", color:C.sub }}>{e.type}</td>
                          <td style={{ padding:"13px 14px", color:C.sub }}>{e.joined}</td>
                          <td style={{ padding:"13px 14px", color:C.txt, fontWeight:500 }}>{e.salary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </SettingsPanel>
            )}
          </div>
        )}

        {/* ─ TIME AWAY ─ */}
        {page==="Time Away" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 42%, var(--mid) 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", left:"8%", bottom:-40, width:180, height:180,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.16) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ maxWidth:560 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.72)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>◷ Leave</div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>Time Away</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55 }}>
                    {isSA ? "Team calendar and approvals — hover a coloured date to see who’s out." : "Your leave in calendar and list views — apply when you need time off."}
                  </p>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {isSA && (
                    <Btn variant="outline" onClick={()=>{ setPolicyDraft(JSON.parse(JSON.stringify(leavePolicy))); setShowLeavePolicy(true); }} style={{ padding:"10px 18px", color:C.sub, borderColor:C.bdr }}>Leave Policy</Btn>
                  )}
                  <Btn variant="outline" onClick={()=>setShowHolidays(true)} style={{ padding:"10px 18px", color:C.p, borderColor:C.p }}>
                    {isSA ? "+ Add/View Holidays" : "View Holidays"}
                  </Btn>
                  <Btn onClick={()=>setShowLeave(true)} style={{ padding:"10px 18px" }}>+ Apply Leave</Btn>
                </div>
              </div>
            </div>
            {isSA ? (
              <>
                <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, padding:"14px 18px", marginBottom:18, boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                    <div style={{ display:"flex", justifyContent:"flex-start", flexShrink:0 }}>
                      <TabBar inline tabs={["Calendar","Table"]} active={lvViewMode} setActive={setLvViewMode} style={{ marginBottom:0 }} />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                      <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Legend:</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fef08a", border:`1px solid ${C.bdr}` }} /> Pending</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:C.surf, border:`1px solid ${C.bdr}` }} /> Approved</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#e5e7eb", border:`1px solid ${C.bdr}` }} /> Rejected</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fde68a", border:`1px solid ${C.bdr}` }} /> Mixed</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#e8e8e4" }} /> Sunday (off)</span>
                    </div>
                  </div>
                </div>
                {lvViewMode === "Calendar" ? (
                  <div style={{ position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 20px rgba(var(--shadow-rgb),.06)" }}>
                    <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p, borderRadius:"4px 0 0 4px" }} />
                    <div style={{ padding:"22px 22px 24px 26px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                      <Btn variant="outline" onClick={()=>setLeaveCalMonth(d=>new Date(d.getFullYear(), d.getMonth()-1, 1))} style={{ padding:"6px 12px" }}>←</Btn>
                      <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:C.txt }}>
                        {leaveCalMonth.toLocaleString("en-IN", { month:"long", year:"numeric" })}
                      </div>
                      <Btn variant="outline" onClick={()=>setLeaveCalMonth(d=>new Date(d.getFullYear(), d.getMonth()+1, 1))} style={{ padding:"6px 12px" }}>→</Btn>
                    </div>
                    <p style={{ fontSize:11, color:C.sub, margin:"0 0 14px" }}>Hover any coloured date to see every person on leave that day (name, type, status).</p>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                        <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:C.sub, padding:6 }}>{d}</div>
                      ))}
                      {(() => {
                        const y = leaveCalMonth.getFullYear();
                        const m = leaveCalMonth.getMonth();
                        const first = new Date(y, m, 1).getDay();
                        const dim = daysInMonth(y, m);
                        const cells = [];
                        for (let i = 0; i < first; i++) cells.push(<div key={`sa-e${i}`} />);
                        for (let day = 1; day <= dim; day++) {
                          const cellDate = new Date(y, m, day);
                          const isOff = isWeeklyOff(cellDate);
                          const dayLeaves = leavesOnDate(leaves, cellDate);
                          const bg = saDayCellBg(isOff, dayLeaves);
                          const tipLines = dayLeaves.map(l => `${l.emp} — ${l.type} (${l.status})`);
                          cells.push(
                            <div
                              key={`sa-${day}`}
                              style={{
                                position:"relative",
                                minHeight:52, borderRadius:8, border:`1px solid ${C.bdr}`,
                                background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                                fontSize:12, fontWeight:600, color:isOff ? C.bdr : C.txt,
                                cursor: dayLeaves.length ? "pointer" : "default",
                                transition:"box-shadow .12s",
                              }}
                              onMouseEnter={e=>{
                                if (!dayLeaves.length) return;
                                setSaCalTooltip({
                                  left: e.clientX + 12,
                                  top: e.clientY + 12,
                                  lines: tipLines,
                                });
                                e.currentTarget.style.boxShadow=`0 0 0 2px ${C.p}`;
                              }}
                              onMouseMove={e=>{
                                if (!dayLeaves.length) return;
                                setSaCalTooltip({
                                  left: e.clientX + 12,
                                  top: e.clientY + 12,
                                  lines: tipLines,
                                });
                              }}
                              onMouseLeave={e=>{
                                setSaCalTooltip(null);
                                e.currentTarget.style.boxShadow="none";
                              }}
                            >
                              {day}
                              {dayLeaves.length > 0 && !isOff && (
                                <span style={{ fontSize:9, color:C.sub, marginTop:3, fontWeight:700 }}>
                                  {dayLeaves.length === 1 ? dayLeaves[0].emp.split(" ")[0] : `${dayLeaves.length} people`}
                                </span>
                              )}
                            </div>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:12 }}>
                      <TabBar inline tabs={["All","Pending","Approved","Rejected"]} active={lvTab} setActive={setLvTab} style={{ marginBottom:0 }} />
                    </div>
                    <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06)" }}>
                      <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                      <table style={{ width:"100%", minWidth: narrow ? 720 : undefined, borderCollapse:"collapse", fontSize:12 }}>
                        <thead>
                          <tr style={{ background:C.surf }}>
                            {["Employee","Type","From","To","Days","Reason","Approver","Status","Action"].map(h=>(
                              <th key={h} style={{ padding:"10px 13px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeaves.map(l=>(
                            <tr key={l.id} style={{ borderBottom:`1px solid ${C.surf}` }}>
                              <td style={{ padding:"12px 13px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <Av ini={l.ini} sz={26} bg={C.p} />
                                  <span style={{ fontWeight:600, color:C.txt }}>{l.emp}</span>
                                </div>
                              </td>
                              <td style={{ padding:"12px 13px", color:C.txt }}>{l.type}</td>
                              <td style={{ padding:"12px 13px", color:C.sub }}>{l.from}</td>
                              <td style={{ padding:"12px 13px", color:C.sub }}>{l.to}</td>
                              <td style={{ padding:"12px 13px", fontWeight:600, color:C.txt }}>{l.days}</td>
                              <td style={{ padding:"12px 13px", color:C.sub }}>{l.reason}</td>
                              <td style={{ padding:"12px 13px" }}><Pill txt={l.approver} bg={C.surf} c={C.sub} /></td>
                              <td style={{ padding:"12px 13px" }}><Badge s={l.status} /></td>
                              <td style={{ padding:"12px 13px" }}>
                                {l.status==="pending" && canApproveLeaveRow(l, me.name, employees, isSA)
                                  ? <div style={{ display:"flex", gap:5 }}>
                                      <Btn variant="outline" onClick={()=>promptLeaveAction(l.id,"approved")} style={{ padding:"3px 9px", fontSize:10 }}>Approve</Btn>
                                      <Btn variant="ghost"   onClick={()=>promptLeaveAction(l.id,"rejected")} style={{ padding:"3px 9px", fontSize:10 }}>Reject</Btn>
                                    </div>
                                  : <span style={{ color:C.bdr, fontSize:11 }}>—</span>
                                }
                              </td>
                            </tr>
                          ))}
                          {filteredLeaves.length===0 && (
                            <tr><td colSpan={9} style={{ padding:40, textAlign:"center", color:C.sub, fontSize:12 }}>No records found.</td></tr>
                          )}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, padding:"14px 18px", marginBottom:18, boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                    <div style={{ display:"flex", justifyContent:"flex-start", flexShrink:0 }}>
                      <TabBar inline tabs={["Calendar","Table"]} active={lvViewMode} setActive={setLvViewMode} style={{ marginBottom:0 }} />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Legend:</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fef08a", border:`1px solid ${C.bdr}` }} /> Pending</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:C.surf, border:`1px solid ${C.bdr}` }} /> Approved</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#e8e8e4" }} /> Sunday (off)</span>
                    </div>
                  </div>
                </div>
                {lvViewMode === "Calendar" ? (
                  <div style={{ position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 20px rgba(var(--shadow-rgb),.06)" }}>
                    <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p, borderRadius:"4px 0 0 4px" }} />
                    <div style={{ padding:"22px 22px 24px 26px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                      <Btn variant="outline" onClick={()=>setLeaveCalMonth(d=>new Date(d.getFullYear(), d.getMonth()-1, 1))} style={{ padding:"6px 12px" }}>←</Btn>
                      <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:C.txt }}>
                        {leaveCalMonth.toLocaleString("en-IN", { month:"long", year:"numeric" })}
                      </div>
                      <Btn variant="outline" onClick={()=>setLeaveCalMonth(d=>new Date(d.getFullYear(), d.getMonth()+1, 1))} style={{ padding:"6px 12px" }}>→</Btn>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
                        <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:C.sub, padding:6 }}>{d}</div>
                      ))}
                  {(() => {
                        const y = leaveCalMonth.getFullYear();
                        const m = leaveCalMonth.getMonth();
                        const first = new Date(y, m, 1).getDay();
                        const dim = daysInMonth(y, m);
                        const cells = [];
                        for (let i = 0; i < first; i++) cells.push(<div key={`e${i}`} />);
                        for (let day = 1; day <= dim; day++) {
                          const cellDate = new Date(y, m, day);
                          const isoStr = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                          const isOff = isWeeklyOff(cellDate);
                          const isHoliday = holidays.some(h => h.dISO === isoStr);
                          const hit = myLeaves.find(l => dateInRange(cellDate, l.fromISO, l.toISO));
                          let bg = C.wht;
                          if (isOff) bg = "#e8e8e4";
                          else if (isHoliday) bg = "rgba(175,192,165,.35)";
                          else if (hit) bg = leaveColor(hit.status);
                          const holidayObj = holidays.find(h => h.dISO === isoStr);
                          const cellTooltip = isHoliday ? `${holidayObj?.n}${holidayObj?.desc ? `: ${holidayObj.desc}` : ""}` : undefined;
                          cells.push(
                            <div key={day} title={cellTooltip} style={{
                              minHeight:44, borderRadius:8, border:`1px solid ${C.bdr}`,
                              background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                              fontSize:12, fontWeight:600, color:isOff ? C.bdr : C.txt,
                            }}>
                              {day}
                              {isHoliday && !isOff && <span style={{ fontSize:7, color:C.p, marginTop:1, textAlign:"center" }}>🏖</span>}
                              {hit && !isOff && !isHoliday && <span style={{ fontSize:8, color:C.sub, marginTop:2, textAlign:"center", lineHeight:1.2 }}>{hit.type}</span>}
                            </div>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:12 }}>
                      <TabBar inline tabs={["All","Pending","Approved","Rejected"]} active={lvTab} setActive={setLvTab} style={{ marginBottom:0 }} />
                    </div>
                    <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06)" }}>
                      <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                      <table style={{ width:"100%", minWidth: narrow ? 560 : undefined, borderCollapse:"collapse", fontSize:12 }}>
                        <thead>
                          <tr style={{ background:C.surf }}>
                            {["Type","From","To","Days","Reason","Approver","Status"].map(h=>(
                              <th key={h} style={{ padding:"10px 13px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {myLeaves.filter(l=>lvTab==="All"||l.status===lvTab.toLowerCase()).map(l=>(
                            <tr key={l.id} style={{ borderBottom:`1px solid ${C.surf}` }}>
                              <td style={{ padding:"12px 13px", color:C.txt }}>{l.type}</td>
                              <td style={{ padding:"12px 13px", color:C.sub }}>{l.from}</td>
                              <td style={{ padding:"12px 13px", color:C.sub }}>{l.to}</td>
                              <td style={{ padding:"12px 13px", fontWeight:600 }}>{l.days}</td>
                              <td style={{ padding:"12px 13px", color:C.sub }}>{l.reason}</td>
                              <td style={{ padding:"12px 13px" }}><Pill txt={l.approver} bg={C.surf} c={C.sub} /></td>
                              <td style={{ padding:"12px 13px" }}><Badge s={l.status} /></td>
                            </tr>
                          ))}
                          {myLeaves.length===0 && (
                            <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:C.sub }}>No leave yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ─ PAYDAYS ─ */}
        {page==="Paydays" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 42%, var(--mid) 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-36, top:-40, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.18) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:20, flexWrap:"wrap" }}>
                <div style={{ maxWidth:520 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.72)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>₹ Payroll</div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>Paydays</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:480 }}>
                    {isSA ? "Company payslips, salary configuration, and net pay — credited on the 15th." : "Your payslips for the selected year — download when you need them."}
                  </p>
                </div>
                <div style={{ display:"flex", gap:12, alignItems:"flex-end", flexWrap:"wrap" }}>
                  {isSA && pyTab === "All Payslips" && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.6, marginBottom:6 }}>MONTH</div>
                      <select
                        value={payMonthFilter === null ? "all" : String(payMonthFilter)}
                        onChange={e => {
                          const v = e.target.value;
                          setPayMonthFilter(v === "all" ? null : Number(v));
                        }}
                        style={{ ...payFilterSelectStyle, minWidth: 132 }}
                      >
                        <option value="all">All months</option>
                        {MONTHS_SHORT.map((m, i) => (
                          <option key={m} value={i}>{m}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.6, marginBottom:6 }}>YEAR</div>
                    <select
                      value={payYear}
                      onChange={e => setPayYear(Number(e.target.value))}
                      style={payFilterSelectStyle}
                    >
                      <option value={2026}>2026</option>
                      <option value={2025}>2025</option>
                    </select>
                  </div>
                  {isSA && pyTab === "All Payslips" && (
                    <Btn 
                      style={{ padding: "8px 18px", fontSize: 13, background: C.p, color: "#fff", border: "none", boxShadow: "0 4px 12px rgba(var(--p-rgb),.25)" }} 
                      onClick={() => {
                        setPayrollStep(1);
                        setSelectedPayIds(saPayslipRows.map(p => p.id));
                      }}
                    >
                      Start Payroll
                    </Btn>
                  )}
                </div>
              </div>
              

            </div>
            <div style={{ display:"flex", justifyContent:"flex-start", width:"100%", marginBottom:18 }}>
              <TabBar
                inline
                tabs={isSA ? ["All Payslips", "Salary Configuration"] : ["My Payslips"]}
                active={pyTab}
                setActive={setPyTab}
                style={{ marginBottom:0 }}
              />
            </div>
            {(pyTab==="All Payslips"||pyTab==="My Payslips") ? (
              isSA ? (
                <>
                  <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06)" }}>
                  <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                  <table style={{ width:"100%", minWidth: narrow ? 600 : undefined, borderCollapse:"collapse", fontSize:12 }}>
                    <thead>
                      <tr style={{ background:C.surf }}>
                        {["Employee","Period","Credited","Gross","Net pay","Status","Action"].map(h=>(
                          <th key={h} style={{ padding:"11px 14px", textAlign:h==="Action"?"right":"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {saPayslipRows.map(p => (
                        <tr key={p.id} style={{ borderBottom:`1px solid ${C.surf}`, transition:"background .1s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"13px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                              <Av ini={p.ini} sz={30} bg={employees.find(e=>e.id===p.empId)?.avatarC||C.p} />
                              <div>
                                <div style={{ fontWeight:600, color:C.txt }}>{p.name}</div>
                                {p.dept && p.dept !== "—" ? <div style={{ fontSize:10, color:C.sub }}>{p.dept}</div> : null}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"13px 14px", fontWeight:600, color:C.txt }}>{p.monthLabel}</td>
                          <td style={{ padding:"13px 14px", color:C.sub }}>{p.credited}</td>
                          <td style={{ padding:"13px 14px", color:C.txt }}>{p.gross}</td>
                          <td style={{ padding:"13px 14px", fontWeight:700, color:C.p }}>{editedSalaries[p.id] || p.net}</td>
                          <td style={{ padding:"13px 14px" }}>
                            {processedPayments[p.id] ? (
                              <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", background:"#dcfce7", padding:"3px 8px", borderRadius:4 }}>PAID</span>
                            ) : (
                              <span style={{ fontSize:10, fontWeight:700, color:C.sub, background:C.surf, padding:"3px 8px", borderRadius:4 }}>UNPAID</span>
                            )}
                          </td>
                          <td style={{ padding:"13px 14px", textAlign:"right" }}>
                            <Btn variant="ghost" style={{ padding:"4px 10px", fontSize:10 }} onClick={()=>setPayslipPreview(p)}>PDF</Btn>
                          </td>
                        </tr>
                      ))}
                      {saPayslipRows.length===0 && (
                        <tr><td colSpan={7} style={{ padding:44, textAlign:"center", color:C.sub, fontSize:12 }}>No payslips for this year and month.</td></tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
                
                {paymentLogs.length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, letterSpacing: 0.8, marginBottom: 12 }}>PAYMENT AUDIT LOGS</div>
                    <div style={{ background: C.wht, borderRadius: 16, border: `1px solid ${C.bdr}`, overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: C.surf }}>
                            {["Date", "Actor", "Period", "Total Amount", "Status"].map(h => (
                              <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.sub, fontWeight: 700, fontSize: 10, borderBottom: `1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paymentLogs.map((log, idx) => (
                            <tr key={idx} style={{ borderBottom: `1px solid ${C.surf}` }}>
                              <td style={{ padding: "12px 14px", color: C.sub }}>{log.ts}</td>
                              <td style={{ padding: "12px 14px", fontWeight: 600 }}>{log.actor}</td>
                              <td style={{ padding: "12px 14px" }}>{log.monthYear}</td>
                              <td style={{ padding: "12px 14px", fontWeight: 700 }}>{log.amount}</td>
                              <td style={{ padding: "12px 14px" }}><span style={{ color: "#16a34a", fontWeight: 700 }}>PAID</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {myPayslipRows.map(p => (
                    <Card key={p.id} style={{
                      position:"relative", padding:"16px 20px 16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap",
                      borderRadius:16, overflow:"hidden", boxShadow:"0 2px 14px rgba(var(--shadow-rgb),.06)",
                    }}>
                      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p, borderRadius:"4px 0 0 4px" }} />
                      <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:C.surf, border:`1px solid ${C.bdr}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📄</div>
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:4 }}>{p.monthLabel.toUpperCase()}</div>
                          <div style={{ fontSize:10, color:C.sub }}>Credited {p.credited}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>NET</div>
                          <div style={{ fontSize:16, fontWeight:700, color:C.p }}>{p.net}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>GROSS</div>
                          <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{p.gross}</div>
                        </div>
                        <Btn variant="outline" style={{ padding:"6px 12px", fontSize:10 }} onClick={()=>setPayslipPreview(p)}>Download</Btn>
                      </div>
                    </Card>
                  ))}
                  {myPayslipRows.length===0 && (
                    <Card style={{ textAlign:"center", padding:40, color:C.sub, fontSize:12, borderRadius:16, boxShadow:"0 2px 12px rgba(var(--shadow-rgb),.05)" }}>No payslips for {payYear}.</Card>
                  )}
                </div>
              )
            ) : (
              <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06)" }}>
                <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                <table style={{ width:"100%", minWidth: narrow ? 640 : undefined, borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ background:C.surf }}>
                      {["Employee","Annual CTC","Basic","HRA","Other","Net/Month",""].map(h=>(
                        <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payrollRows.map((p,i)=>(
                      <tr key={i} style={{ borderBottom:`1px solid ${C.surf}`, transition:"background .1s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"13px 14px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <Av ini={p.ini} sz={30} bg={employees.find(e=>e.ini===p.ini)?.avatarC||C.p} />
                            <div>
                              <div style={{ fontWeight:600, color:C.txt }}>{p.name}</div>
                              {p.dept && <div style={{ fontSize:10, color:C.sub }}>{p.dept}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"13px 14px", color:p.set?C.txt:C.bdr, fontWeight:p.set?600:400 }}>{p.ctc}</td>
                        <td style={{ padding:"13px 14px" }}>{p.basic!=="—"?<Pill txt={p.basic} bg={C.surf}    c={C.sub} />:<span style={{color:C.bdr}}>—</span>}</td>
                        <td style={{ padding:"13px 14px" }}>{p.hra  !=="—"?<Pill txt={p.hra}   bg="#fef9e7"   c="#7a6000" />:<span style={{color:C.bdr}}>—</span>}</td>
                        <td style={{ padding:"13px 14px" }}>{p.other!=="—"?<Pill txt={p.other} bg={C.mid}     c={C.sub} />:<span style={{color:C.bdr}}>—</span>}</td>
                        <td style={{ padding:"13px 14px", color:p.set?C.p:C.bdr, fontWeight:p.set?700:400 }}>{p.net}</td>
                        <td style={{ padding:"13px 14px" }}>
                          <Btn 
                            variant={p.set?"ghost":"outline"} 
                            style={{ padding:"4px 12px", fontSize:10, opacity: (payrollStatus === "Locked" || payrollStatus === "Paid") ? 0.5 : 1 }}
                            disabled={payrollStatus === "Locked" || payrollStatus === "Paid"}
                            onClick={()=>{ setSalaryModal({ ini:p.ini, name:p.name, set:p.set }); setSalaryForm(salaryConfigs[p.ini] ? { ...DEFAULT_SALARY_CFG(), ...salaryConfigs[p.ini] } : DEFAULT_SALARY_CFG()); }}>
                            {p.set?"Edit":"Set up"}
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─ RECOGNITION ─ */}
        {page==="Recognition" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 42%, var(--mid) 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-36, top:-40, width:240, height:240,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.22) 0%, transparent 68%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:640 }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.7)", border:`1px solid ${C.bdr}`,
                  fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                }}>
                  <span style={{ fontSize:12, lineHeight:1 }}>✦</span>
                  Community
                </div>
                <h1 style={{
                  fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12,
                  letterSpacing:"-.02em",
                }}>Recognition</h1>
                <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:520 }}>
                  Public shout-outs for everyone to see. Call out great work and keep momentum visible across the team.
                </p>
              </div>
            </div>

            <div style={{
              position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
              padding:"22px 24px 24px", marginBottom:22,
              boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
              overflow:"hidden",
            }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p, borderRadius:"4px 0 0 4px" }} />
              <div style={{ paddingLeft:8 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.1, color:C.p, marginBottom:4 }}>COMPOSE</div>
                <h2 style={{ margin:"0 0 16px", fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>New shout-out</h2>
                <Inp label="Recognise someone" opts={["Choose a teammate…",...employees.filter(e=>e.name!=="Arjun Mehta").map(e=>e.name)]} />
                <Inp label="What did they do?" type="textarea" placeholder="Share what they did that made a difference…" />
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8, paddingTop:8, borderTop:`1px solid ${C.surf}` }}>
                  <Btn onClick={()=>toast("Recognition posted! ✦")} style={{ padding:"10px 22px", minWidth:140 }}>Post shout-out</Btn>
                </div>
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:12, marginBottom:14, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>FEED</div>
                <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Recent</h2>
              </div>
              <span style={{ fontSize:11, color:C.sub }}>Newest first</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {RECOGS.map((r,i)=>(
                <div
                  key={i}
                  style={{
                    position:"relative",
                    background:C.wht,
                    borderRadius:16,
                    border:`1px solid ${C.bdr}`,
                    overflow:"hidden",
                    boxShadow:"0 2px 14px rgba(var(--shadow-rgb),.06)",
                  }}
                >
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:i % 2 === 0 ? C.p : C.p2, borderRadius:"4px 0 0 4px" }} />
                  <div style={{ padding:"16px 18px 18px 22px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p }}>SHOUT-OUT</div>
                      <span style={{
                        fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.3,
                        padding:"5px 11px", borderRadius:999, background:C.bg, border:`1px solid ${C.bdr}`,
                      }}>{r.time}</span>
                    </div>
                    <div style={{
                      display:"flex",
                      flexWrap:"wrap",
                      alignItems:"center",
                      gap:12,
                      marginBottom:14,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av ini={r.fIni} sz={44} bg={C.p} />
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:2 }}>FROM</div>
                          <div style={{ fontWeight:700, color:C.txt, fontSize:14 }}>{r.from}</div>
                        </div>
                      </div>
                      <div style={{
                        width:32, height:32, borderRadius:"50%", background:C.surf, border:`1px solid ${C.bdr}`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.p, fontWeight:800, flexShrink:0,
                      }}>→</div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av ini={r.tIni} sz={44} bg={C.p2} />
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:2 }}>TO</div>
                          <div style={{ fontWeight:700, color:C.txt, fontSize:14 }}>{r.to}</div>
                        </div>
                      </div>
                    </div>
                    <blockquote
                      style={{
                        margin:0,
                        padding:"14px 16px 14px 18px",
                        fontSize:14,
                        color:C.txt,
                        lineHeight:1.65,
                        fontStyle:"normal",
                        background:`linear-gradient(180deg, ${C.bg} 0%, ${C.wht} 55%)`,
                        borderRadius:12,
                        border:`1px solid ${C.surf}`,
                        borderLeft:`4px solid ${C.p}`,
                        boxShadow:"inset 0 1px 0 rgba(255,255,255,.6)",
                      }}
                    >
                      {r.msg}
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ ORG CHART ─ */}
        {page==="Org Chart" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 42%, var(--mid) 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", left:"15%", bottom:-48, width:200, height:200,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(90,110,80,.12) 0%, transparent 72%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ maxWidth:560 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.72)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>⊹ Structure</div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>Org Chart</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55 }}>
                    Reporting lines only — managers above their reports. {isSA ? "Edit who reports to whom to reshape the tree." : "Contact a Super Admin to update hierarchy."}
                  </p>
                </div>
                {isSA && <Btn variant="outline" onClick={()=>setShowOrgEdit(true)} style={{ padding:"10px 18px" }}>Edit hierarchy</Btn>}
              </div>
            </div>
            <div style={{
              position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
              padding:"22px 24px 28px 28px", overflowX:"auto",
              boxShadow:"0 2px 20px rgba(var(--shadow-rgb),.06)",
            }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p2, borderRadius:"4px 0 0 4px" }} />
              <div style={{ paddingLeft:8, minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>VISUALIZATION</div>
                <h2 style={{ margin:"0 0 18px", fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Reporting tree</h2>
                {employees.filter(e => orgManagers[e.id] == null).length === 0 ? (
                  <div style={{ textAlign:"center", color:C.sub, padding:"40px 20px", fontSize:13, borderRadius:12, background:C.bg, border:`1px dashed ${C.bdr}` }}>
                    No top-level role defined. {isSA ? <>Use <strong style={{ color:C.txt }}>Edit hierarchy</strong> and set at least one person to “Top level”.</> : <>Ask a Super Admin to assign top-level roles.</>}
                  </div>
                ) : (
                  <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:24, flexWrap:"wrap", minWidth:0 }}>
                    {employees.filter(e => orgManagers[e.id] == null).map(root => (
                      <OrgTreeNode key={root.id} empId={root.id} orgManagers={orgManagers} depth={0} empList={employees} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─ LISTENING ROOM ─ */}
        {page==="Listening Room" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, #f7f9f4 0%, ${C.surf} 40%, #dde8cf 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", left:"12%", top:-50, width:200, height:200,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(90,110,80,.12) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:640 }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.75)", border:`1px solid ${C.bdr}`,
                  fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                }}>
                  <span style={{ fontSize:13, lineHeight:1, opacity:.9 }}>◎</span>
                  Private
                </div>
                <h1 style={{
                  fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12,
                  letterSpacing:"-.02em",
                }}>The Listening Room</h1>
                <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:520 }}>
                  A calm place to slow down and put words to what you’re carrying — work stress, tough days, or anything that needs air.
                </p>
              </div>
            </div>

            <div style={{
              position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
              padding:"16px 18px 16px 22px", marginBottom:16,
              boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06)",
              overflow:"hidden",
            }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p2, borderRadius:"4px 0 0 4px" }} />
              <div style={{ display:"flex", alignItems:"flex-start", gap:12, paddingLeft:6 }}>
                <div style={{
                  width:36, height:36, borderRadius:10, background:C.surf, border:`1px solid ${C.bdr}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0,
                }}>🔒</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.txt, marginBottom:3 }}>Only you can see this</div>
                  <p style={{ margin:0, fontSize:12, color:C.sub, lineHeight:1.5 }}>
                    Nothing here is shared with your team or HR. It’s a prototype space for reflection and gentle prompts.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
              boxShadow:"0 2px 20px rgba(var(--shadow-rgb),.05)",
              overflow:"hidden", marginBottom:16,
            }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p, borderRadius:"4px 0 0 4px" }} />
              <div style={{ padding:"16px 20px 12px 24px", borderBottom:`1px solid ${C.surf}` }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:4 }}>CONVERSATION</div>
                <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:16, fontWeight:700, color:C.txt }}>Your thread</h2>
              </div>
              <div
                ref={chatRef}
                style={{
                  minHeight:280, maxHeight:400, overflowY:"auto", padding:"18px 20px 20px 24px",
                  display:"flex", flexDirection:"column", gap:12,
                  background:`linear-gradient(180deg, ${C.bg} 0%, ${C.wht} 35%)`,
                }}
              >
                {msgs.length===0
                  ? (
                    <div style={{
                      flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      textAlign:"center", padding:"48px 20px", minHeight:220,
                    }}>
                      <div style={{
                        width:56, height:56, borderRadius:16, background:C.surf, border:`1px solid ${C.bdr}`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:14,
                        boxShadow:"inset 0 1px 0 rgba(255,255,255,.6)",
                      }}>💬</div>
                      <div style={{ fontSize:14, fontWeight:600, color:C.txt, marginBottom:6 }}>Start when you’re ready</div>
                      <div style={{ fontSize:12, color:C.sub, lineHeight:1.5, maxWidth:280 }}>
                        Type below or tap a starter. There’s no wrong way to begin.
                      </div>
                    </div>
                  )
                  : msgs.map((m,i)=>(
                      <div
                        key={i}
                        style={{
                          padding:"11px 14px", borderRadius:14, maxWidth:"78%", fontSize:12, lineHeight:1.55,
                          background: m.from==="me" ? C.p : C.wht,
                          color: m.from==="me" ? "#fff" : C.txt,
                          marginLeft: m.from==="me" ? "auto" : 0,
                          marginRight: m.from==="me" ? 0 : "auto",
                          border: m.from==="me" ? "none" : `1px solid ${C.bdr}`,
                          boxShadow: m.from==="me" ? "0 4px 14px rgba(122,142,110,.25)" : "0 1px 3px rgba(var(--shadow-rgb),.06)",
                        }}
                      >
                        {m.txt}
                      </div>
                    ))
                }
              </div>
            </div>

            <div style={{
              position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
              padding:"18px 20px 20px", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
              overflow:"hidden",
            }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:"#8a9a80", borderRadius:"4px 0 0 4px", opacity:.85 }} />
              <div style={{ paddingLeft:8 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:10 }}>STARTERS</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                  {["I feel overwhelmed","Work has been stressful lately","I had a difficult conversation","I can't switch off from work"].map(p=>(
                    <button
                      key={p}
                      type="button"
                      onClick={()=>setInput(p)}
                      style={{
                        padding:"8px 14px", borderRadius:999, border:`1px solid ${C.bdr}`, background:C.bg, color:C.txt,
                        fontSize:11, fontWeight:600, cursor:"pointer", transition:"background .12s, border-color .12s",
                      }}
                      onMouseEnter={e=>{ e.currentTarget.style.background=C.surf; e.currentTarget.style.borderColor=C.p; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=C.bg; e.currentTarget.style.borderColor=C.bdr; }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p, marginBottom:8 }}>MESSAGE</div>
                <div style={{ display:"flex", flexDirection: narrow ? "column" : "row", gap:10, alignItems:"stretch" }}>
                  <input
                    value={input}
                    onChange={e=>setInput(e.target.value)}
                    placeholder="Type how you're feeling…"
                    onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                    style={{
                      flex:1, padding:"12px 16px", borderRadius:12, border:`1px solid ${C.bdr}`, fontSize:13, color:C.txt,
                      outline:"none", background:C.wht, boxShadow:"inset 0 1px 2px rgba(var(--shadow-rgb),.04)",
                      minWidth:0,
                    }}
                  />
                  <Btn onClick={sendMsg} style={{ padding:"12px 22px", alignSelf:"stretch" }}>Send</Btn>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─ SETTINGS ─ */}
        {page==="Settings" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 42%, var(--mid) 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-32, top:-36, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.2) 0%, transparent 68%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:720 }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(255,255,255,.7)", border:`1px solid ${C.bdr}`,
                  fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                }}>
                  ⚙ Account
                </div>
                <h1 style={{
                  fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12,
                  letterSpacing:"-.02em",
                }}>Settings</h1>
                <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:560 }}>
                  {isSA
                    ? "Organisation controls, security, and your personal account — all in one place."
                    : isAdmin
                      ? "Manage notifications and credentials for your administrator workspace."
                      : "Your profile preferences and sign-in security."}
                </p>
              </div>
            </div>

            <SettingsPanel label="Signed in as" title={me.name} accent={C.p}>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:14 }}>
                <Av ini={me.ini} sz={48} bg={me.avatarC} />
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontSize:12, color:C.sub, marginBottom:4 }}>{me.email}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <Pill txt={me.dept} bg={C.surf} c={C.sub} />
                    <Pill txt={role} bg={C.bg} c={C.txt} />
                  </div>
                </div>
              </div>
              <p style={{ margin:0, fontSize:12, color:C.sub, lineHeight:1.5 }}>
                Role is preview-only here — use <strong style={{ color:C.txt }}>Switch role</strong> in the sidebar to try Employee, Admin, or Super Admin in this prototype.
              </p>
            </SettingsPanel>

            {isSA && (
              <>
                <SettingsPanel label="Organisation" title="Workspace & directory" accent={C.p}>
                  <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    High-level context for KinSphere. Tagline appears under the logo in the sidebar and on payslip headers.
                  </p>
                  <div style={{
                    display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14, marginBottom:14,
                  }}>
                    <div style={{ padding:14, borderRadius:12, background:C.bg, border:`1px solid ${C.bdr}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:6 }}>COMPANY TAGLINE</div>
                      <div style={{ fontSize:14, fontWeight:600, color:C.txt }}>{companyTagline}</div>
                    </div>
                    <div style={{ padding:14, borderRadius:12, background:C.bg, border:`1px solid ${C.bdr}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:6 }}>EMPLOYEES</div>
                      <div style={{ fontSize:22, fontWeight:700, color:C.txt, fontVariantNumeric:"tabular-nums" }}>{employees.length}</div>
                      <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>Active profiles in directory</div>
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:C.sub, lineHeight:1.45 }}>
                    Edit tagline via the <strong style={{ color:C.txt }}>✎</strong> control next to the company name in the sidebar. Upload the company logo by hovering the KinSphere mark (Super Admin).
                  </div>
                </SettingsPanel>

                <SettingsPanel label="Branding" title="Logo & payslips" accent="#6b7d5e">
                  <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Logo and tagline flow into payslip PDFs and the app shell. CSV employee export uses the same directory you manage under Employees.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <Btn variant="outline" onClick={()=>toast("Opens Employees export (prototype) ✓")}>Review export format</Btn>
                    <Btn variant="ghost" onClick={()=>setPage("Paydays")}>Open Paydays</Btn>
                  </div>
                </SettingsPanel>

                <SettingsPanel label="Security" title="Organisation security" accent="#b8860b">
                  <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Hardening options for production: enforce SSO, session length, and approver rules for leave.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>Two-factor authentication (org)</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>Require 2FA for all Super Admins</div>
                      </div>
                      <Btn variant="outline" onClick={()=>toast("2FA policy — coming in production ✓")} style={{ padding:"6px 12px", fontSize:11 }}>Configure</Btn>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>Session policy</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>Idle timeout and re-auth for sensitive actions</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Default · 8h</span>
                    </div>
                  </div>
                </SettingsPanel>

                <SettingsPanel label="Data" title="Exports & backups" accent={C.p2}>
                  <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Bulk people data and payroll-related exports should follow your retention policy.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                    <Btn variant="outline" onClick={()=>setPage("Employees")}>Employees CSV</Btn>
                    <Btn variant="ghost" onClick={()=>toast("Backup scheduled — prototype ✓")}>Schedule backup</Btn>
                  </div>
                  <div style={{ fontSize:11, color:C.bdr, lineHeight:1.45 }}>
                    Prototype only — no data leaves your browser.
                  </div>
                </SettingsPanel>

                <SettingsPanel label="Audit" title="Recent admin actions" accent={C.dk}>
                  <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Immutable log of sensitive changes (illustrative rows).
                  </p>
                  <div style={{ borderRadius:12, border:`1px solid ${C.bdr}`, overflow:"hidden", background:C.wht }}>
                    <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                    <table style={{ width:"100%", minWidth: narrow ? 400 : undefined, borderCollapse:"collapse", fontSize:12 }}>
                      <thead>
                        <tr style={{ background:C.surf }}>
                          {["When","Actor","Action"].map(h => (
                            <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Today · 09:14", "Arjun Mehta", "Updated company tagline"],
                          ["Mon · 16:02", "Arjun Mehta", "Exported employee directory (CSV)"],
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom:`1px solid ${C.surf}` }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding:"11px 12px", color:j === 0 ? C.sub : C.txt }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </SettingsPanel>

                <SettingsPanel label="Integrations" title="Connected services" accent="#7a8e6e">
                  <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Hook KinSphere into HRIS, Slack, or your IdP when you move beyond the prototype.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <Btn variant="outline" onClick={()=>toast("Slack — connect in production ✓")}>Slack</Btn>
                    <Btn variant="ghost" onClick={()=>toast("HRIS sync — coming soon ✓")}>HRIS</Btn>
                    <Btn variant="ghost" onClick={()=>toast("SCIM — enterprise ✓")}>SCIM</Btn>
                  </div>
                </SettingsPanel>
              </>
            )}

            {isAdmin && !isSA && (
              <>
                <SettingsPanel label="Administrator" title="Your workspace scope" accent="#b8860b">
                  <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    As an admin you can review leave and time-away data for people you support, and help keep calendars accurate. You do not manage the full employee directory or org-wide payroll configuration.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <Btn variant="outline" onClick={()=>setPage("Time Away")}>Open Time Away</Btn>
                    <Btn variant="ghost" onClick={()=>setPage("Paydays")}>Paydays</Btn>
                  </div>
                </SettingsPanel>
              </>
            )}

            {role === "Employee" && (
              <SettingsPanel label="You" title="Profile & visibility" accent={C.p2}>
                <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                  Your profile card is visible to HR and managers as needed. Update personal details through your People team if anything looks wrong.
                </p>
                <Btn variant="outline" onClick={()=>setPage("My Profile")}>View My Profile</Btn>
              </SettingsPanel>
            )}

            {(isAdmin || role === "Employee") && !isSA && (
              <SettingsPanel label="Notifications" title="Email & alerts" accent={C.p}>
                <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                  Choose what we email you about. In-app toasts always show for urgent approvals.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    ["Leave updates", "When requests you approved or submitted change status"],
                    ["Payroll reminders", "Payslip available and tax statement windows"],
                    ...(isAdmin ? [["Team calendar", "Weekly summary of leave on your teams"]] : []),
                  ].map(([t, d]) => (
                    <div key={t} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{t}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{d}</div>
                      </div>
                      <Btn variant="outline" onClick={()=>toast(`${t} — preference saved ✓`)} style={{ padding:"5px 12px", fontSize:10 }}>On</Btn>
                    </div>
                  ))}
                </div>
              </SettingsPanel>
            )}

            {isSA && (
              <SettingsPanel label="Notifications" title="Your alerts" accent={C.p}>
                <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                  Super Admins receive org-wide signals: pending leave, payroll anomalies, and directory changes.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    ["Directory changes", "Imports, role changes, and new joiners"],
                    ["Payroll & payslips", "Salary config edits and payslip generation"],
                    ["Security", "Failed sign-ins and policy updates"],
                  ].map(([t, d]) => (
                    <div key={t} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{t}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{d}</div>
                      </div>
                      <Btn variant="outline" onClick={()=>toast(`${t} — subscribed ✓`)} style={{ padding:"5px 12px", fontSize:10 }}>On</Btn>
                    </div>
                  ))}
                </div>
              </SettingsPanel>
            )}

            {role === "Employee" && (
              <SettingsPanel label="Privacy" title="Your data" accent="#6b7d5e">
                <p style={{ margin:0, fontSize:12, color:C.sub, lineHeight:1.55 }}>
                  The <strong style={{ color:C.txt }}>Listening Room</strong> is private to you. Recognition posts are public to the company. For data requests, contact your People team.
                </p>
              </SettingsPanel>
            )}

            <SettingsPanel label="Security" title="Change password" accent="#8a9a80">
              <p style={{ margin:"0 0 16px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                Use a unique passphrase. {isSA ? "Org-wide SSO may override this in production." : "Your organisation may enforce rotation and SSO."}
              </p>
              <Inp label="Current Password" type="password" />
              <Inp label="New Password" type="password" />
              <Inp label="Confirm New Password" type="password" />
              <Btn onClick={()=>toast("Password updated ✓")} style={{ width:"100%", padding:"11px", marginTop:4 }}>Update password</Btn>
            </SettingsPanel>
          </div>
        )}
      </main>

      {/* ─ SALARY CONFIG (SA) ─ */}
      {salaryModal && (
        <Modal onClose={()=>setSalaryModal(null)} width={540}>
          {(() => {
            const se = employees.find(e => e.ini === salaryModal.ini);
            return (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:8 }}>
                  <div style={{ display:"flex", gap:14, alignItems:"center", flex:1, minWidth:0 }}>
                    {se && <Av ini={se.ini} sz={48} bg={se.avatarC} />}
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1.2 }}>SALARY CONFIGURATION</div>
                      <h2 style={{ margin:"4px 0 2px", fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:C.txt, lineHeight:1.2 }}>
                        {salaryModal.set ? "Edit package" : "Set up package"}
                      </h2>
                      <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{salaryModal.name}</div>
                      <p style={{ margin:"6px 0 0", fontSize:11, color:C.sub, lineHeight:1.45 }}>
                        {salaryModal.set ? "Adjust annual CTC, component split, and monthly statutory deductions." : "Enter figures below. Rupee fields show ₹; Basic and HRA use % of CTC."}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{
                  display:"grid",
                  gridTemplateColumns: narrow ? "1fr" : "1fr 1fr",
                  gap:"14px 18px",
                  marginTop:8,
                  padding:18,
                  borderRadius:14,
                  border:`1px solid ${C.bdr}`,
                  background:`linear-gradient(180deg, ${C.wht} 0%, ${C.bg} 100%)`,
                }}>
                  <div style={{ gridColumn:"1 / -1" }}>
                    <ModalSectionLabel>ANNUAL PACKAGE</ModalSectionLabel>
                  </div>
                  <AffixField
                    style={{ gridColumn:"1 / -1" }}
                    label="Annual CTC"
                    hint="Total cost to company per year (before monthly deductions at line level)."
                    prefix="₹"
                    type="number"
                    value={salaryForm.annualCtc}
                    onChange={e=>setSalaryForm(f=>({ ...f, annualCtc:e.target.value }))}
                  />

                  <div style={{ gridColumn:"1 / -1", marginTop:4 }}>
                    <ModalSectionLabel>COMPONENT SPLIT (% OF CTC)</ModalSectionLabel>
                  </div>
                  <AffixField
                    label="Basic"
                    hint="Typically 40–50% of annual CTC."
                    suffix="%"
                    type="number"
                    value={salaryForm.basicPct}
                    onChange={e=>setSalaryForm(f=>({ ...f, basicPct:e.target.value }))}
                  />
                  <AffixField
                    label="HRA"
                    hint="House rent allowance % of CTC."
                    suffix="%"
                    type="number"
                    value={salaryForm.hraPct}
                    onChange={e=>setSalaryForm(f=>({ ...f, hraPct:e.target.value }))}
                  />

                  <div style={{ gridColumn:"1 / -1", marginTop:4 }}>
                    <ModalSectionLabel>MONTHLY STATUTORY & TAX (₹)</ModalSectionLabel>
                  </div>
                  <AffixField
                    label="Professional tax"
                    hint="Per month, as per state rules."
                    prefix="₹"
                    type="number"
                    value={salaryForm.profTax}
                    onChange={e=>setSalaryForm(f=>({ ...f, profTax:e.target.value }))}
                  />
                  <AffixField
                    label="PF (employee)"
                    hint="Provident fund contribution per month."
                    prefix="₹"
                    type="number"
                    value={salaryForm.pf}
                    onChange={e=>setSalaryForm(f=>({ ...f, pf:e.target.value }))}
                  />
                  <AffixField
                    style={{ gridColumn:"1 / -1" }}
                    label="TDS"
                    hint="Estimated tax deducted at source per month."
                    prefix="₹"
                    type="number"
                    value={salaryForm.tds}
                    onChange={e=>setSalaryForm(f=>({ ...f, tds:e.target.value }))}
                  />
                </div>

                <div style={{
                  display:"flex",
                  gap:10,
                  marginTop:22,
                  paddingTop:18,
                  borderTop:`1px solid ${C.bdr}`,
                  justifyContent:"flex-end",
                  alignItems:"center",
                  flexWrap:"wrap",
                }}>
                  <Btn variant="ghost" onClick={()=>setSalaryModal(null)}>Cancel</Btn>
                  <Btn onClick={()=>{
                    const ini = salaryModal.ini;
                    const a = Number(salaryForm.annualCtc) || 0;
                    setSalaryConfigs(c => ({ ...c, [ini]: { ...salaryForm } }));
                    setPayrollRows(rows => rows.map(r => r.ini !== ini ? r : {
                      ...r,
                      set: true,
                      ctc: a ? `₹${a.toLocaleString("en-IN")}` : "Not set",
                      basic: salaryForm.basicPct ? `${salaryForm.basicPct}%` : "—",
                      hra: salaryForm.hraPct ? `${salaryForm.hraPct}%` : "—",
                      other: (() => {
                        const b = Number(salaryForm.basicPct) || 0;
                        const h = Number(salaryForm.hraPct) || 0;
                        const o = Math.max(0, 100 - b - h);
                        return o ? `${o}%` : "—";
                      })(),
                      net: a ? `₹${Math.round(a / 12).toLocaleString("en-IN")}` : "—",
                    }));
                    setSalaryModal(null);
                    toast("Salary configuration saved ✓");
                  }}>Save configuration</Btn>
                </div>
              </>
            );
          })()}
        </Modal>
      )}

      {/* ─ PAYSLIP PREVIEW ─ */}
      {payslipPreview && (() => {
        const emp = empById(payslipPreview.empId, employees);
        if (!emp) return null;
        const br = getPayslipBreakdown(emp.ini, salaryConfigs, payslipPreview);
        const approver = empById(1, employees)?.name ?? "Arjun Mehta";
        return (
          <div
            style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(var(--shadow-rgb),.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
            onClick={()=>setPayslipPreview(null)}
          >
            <div
              onClick={e=>e.stopPropagation()}
              style={{
                background:C.bg, borderRadius:16, maxWidth:720, width:"100%", maxHeight:"92vh", overflow:"hidden",
                display:"flex", flexDirection:"column", boxShadow:"0 24px 60px rgba(0,0,0,.25)", border:`1px solid ${C.bdr}`,
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom:`1px solid ${C.bdr}`, background:C.wht, flexShrink:0 }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.sub, letterSpacing:.5 }}>Payslip preview</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <button
                    type="button"
                    onClick={downloadPayslipHtml}
                    title="Download"
                    style={{
                      width:40, height:36, borderRadius:8, border:`1px solid ${C.bdr}`, background:C.surf, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.txt} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={()=>setPayslipPreview(null)}
                    title="Close"
                    style={{
                      width:40, height:36, borderRadius:8, border:`1px solid ${C.bdr}`, background:C.wht, cursor:"pointer",
                      fontSize:16, color:C.sub, lineHeight:1, padding:0,
                    }}
                  >✕</button>
                </div>
              </div>
              <div style={{ overflowY:"auto", padding:18, flex:1 }}>
                <div ref={payslipDocRef}>
                  <PayslipSheet
                    logoUrl={companyLogoUrl}
                    companyTagline={companyTagline}
                    emp={emp}
                    payslip={payslipPreview}
                    breakdown={br}
                    approverName={approver}
                    narrow={narrow}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─ COMPANY TAGLINE (SA) ─ */}
      {showTaglineEdit && isSA && (
        <Modal title="Company tagline" onClose={()=>setShowTaglineEdit(false)} width={420}>
          <p style={{ fontSize:12, color:C.sub, marginTop:0, lineHeight:1.5 }}>Shown under KinSphere in the sidebar and on payslip headers.</p>
          <Inp label="Tagline" value={taglineDraft} onChange={e=>setTaglineDraft(e.target.value)} placeholder="e.g. Bipolar Factory" />
          <div style={{ display:"flex", gap:9, justifyContent:"flex-end", marginTop:18 }}>
            <Btn variant="ghost" onClick={()=>setShowTaglineEdit(false)}>Cancel</Btn>
            <Btn onClick={()=>{ setCompanyTagline(taglineDraft.trim() || "Bipolar Factory"); setShowTaglineEdit(false); toast("Tagline updated ✓"); }}>Save</Btn>
          </div>
        </Modal>
      )}

      {/* ─ ORG HIERARCHY EDITOR (SA) ─ */}
      {showOrgEdit && (
        <Modal title="Edit reporting hierarchy" onClose={()=>setShowOrgEdit(false)} width={520}>
          <p style={{ fontSize:12, color:C.sub, marginTop:0, lineHeight:1.5 }}>Pick each person’s manager. Leave as top level for the root role. The org chart redraws from these assignments.</p>
          {employees.map(e=>(
            <div key={e.id} style={{ display:"flex", flexDirection: narrow ? "column" : "row", alignItems: narrow ? "stretch" : "center", gap:12, marginBottom:12 }}>
              <div style={{ width: narrow ? "auto" : 140, minWidth: 0, fontSize:12, fontWeight:600, color:C.txt }}>{e.name}</div>
              <select
                value={orgManagers[e.id] ?? ""}
                onChange={ev=>{
                  const v = ev.target.value === "" ? null : Number(ev.target.value);
                  setOrgManagers(m => ({ ...m, [e.id]: v }));
                }}
                style={{ flex:1, padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12, color:C.txt }}
              >
                <option value="">— Top level (no manager) —</option>
                {employees.filter(x => x.id !== e.id).map(x => (
                  <option key={x.id} value={x.id}>{x.name}</option>
                ))}
              </select>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
            <Btn onClick={()=>{ setShowOrgEdit(false); toast("Org hierarchy updated ✓"); }}>Done</Btn>
          </div>
        </Modal>
      )}

      {payrollStep > 0 && (
        <Modal 
          title={payrollStep === 1 ? "Step 1: Review & Edit" : payrollStep === 2 ? "Step 2: Payment Summary" : "Step 3: Processing"} 
          onClose={() => setPayrollStep(0)} 
          width={payrollStep === 1 ? 920 : 500}
        >
          {payrollStep === 1 && (
            <div style={{ padding: "4px 0" }}>
              <div style={{ maxHeight: 500, overflowY: "auto", border: `1px solid ${C.bdr}`, borderRadius: 12, marginBottom: 20 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead style={{ position: "sticky", top: 0, background: C.surf, zIndex: 1, borderBottom: `1px solid ${C.bdr}` }}>
                    <tr>
                      <th style={{ padding: "12px 14px", textAlign: "left" }}>
                        <input 
                          type="checkbox" 
                          checked={selectedPayIds.length === saPayslipRows.length && saPayslipRows.length > 0} 
                          onChange={e => setSelectedPayIds(e.target.checked ? saPayslipRows.map(p => p.id) : [])}
                        />
                      </th>
                      <th style={{ padding: "12px 14px", textAlign: "left", color: C.sub, fontWeight: 700, fontSize: 10 }}>EMPLOYEE</th>
                      <th style={{ padding: "12px 14px", textAlign: "left", color: C.sub, fontWeight: 700, fontSize: 10 }}>NET PAY</th>
                      <th style={{ padding: "12px 14px", textAlign: "left", color: C.sub, fontWeight: 700, fontSize: 10 }}>ACCOUNT NUMBER</th>
                      <th style={{ padding: "12px 14px", textAlign: "left", color: C.sub, fontWeight: 700, fontSize: 10 }}>IFSC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saPayslipRows.map(p => {
                      const emp = employees.find(e => e.id === p.empId);
                      const isSelected = selectedPayIds.includes(p.id);
                      const hasBank = !!emp?.bankInfo?.accountNumber && !!emp?.bankInfo?.ifsc;
                      return (
                        <tr key={p.id} style={{ borderBottom: `1px solid ${C.surf}`, opacity: isSelected ? 1 : 0.6 }}>
                          <td style={{ padding: "12px 14px" }}>
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => setSelectedPayIds(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                            />
                          </td>
                          <td style={{ padding: "12px 14px", fontWeight: 600 }}>{p.name}</td>
                          <td style={{ padding: "8px 14px" }}>
                            <input 
                              defaultValue={editedSalaries[p.id] || p.net} 
                              onBlur={e => {
                                setEditedSalaries(prev => ({ ...prev, [p.id]: e.target.value }));
                              }}
                              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: `1px solid ${C.bdr}`, fontSize: 13 }}
                            />
                          </td>
                          <td style={{ padding: "8px 14px" }}>
                            <input 
                              placeholder="Account No"
                              defaultValue={emp?.bankInfo?.accountNumber || ""} 
                              style={{ 
                                width: "100%", padding: "6px 8px", borderRadius: 6, 
                                border: `1px solid ${!emp?.bankInfo?.accountNumber ? "#f59e0b" : C.bdr}`, 
                                background: !emp?.bankInfo?.accountNumber ? "#fffbeb" : "#fff",
                                fontSize: 13 
                              }}
                              onBlur={e => {
                                const val = e.target.value;
                                setEmployees(prev => prev.map(x => x.id === p.empId ? { ...x, bankInfo: { ...x.bankInfo, accountNumber: val } } : x));
                              }}
                            />
                          </td>
                          <td style={{ padding: "8px 14px" }}>
                            <input 
                              placeholder="IFSC"
                              defaultValue={emp?.bankInfo?.ifsc || ""} 
                              style={{ 
                                width: "100%", padding: "6px 8px", borderRadius: 6, 
                                border: `1px solid ${!emp?.bankInfo?.ifsc ? "#f59e0b" : C.bdr}`, 
                                background: !emp?.bankInfo?.ifsc ? "#fffbeb" : "#fff",
                                fontSize: 13 
                              }}
                              onBlur={e => {
                                const val = e.target.value;
                                setEmployees(prev => prev.map(x => x.id === p.empId ? { ...x, bankInfo: { ...x.bankInfo, ifsc: val } } : x));
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <Btn variant="ghost" onClick={() => setPayrollStep(0)}>Cancel</Btn>
                <Btn style={{ padding: "10px 24px", background: C.p, color: "#fff" }} onClick={() => setPayrollStep(2)} disabled={selectedPayIds.length === 0}>
                  Next: Payment Summary
                </Btn>
              </div>
            </div>
          )}

          {payrollStep === 2 && (
            <div style={{ padding: "12px 0" }}>
              <div style={{ background: C.surf, padding: 20, borderRadius: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, letterSpacing: 1, marginBottom: 16 }}>PAYMENT BREAKDOWN</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: C.sub, fontSize: 13 }}>Employees Selected</span>
                  <span style={{ fontWeight: 700, color: C.txt }}>{selectedPayIds.length} / {saPayslipRows.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: `1px dotted ${C.bdr}` }}>
                  <span style={{ color: C.sub, fontSize: 13, fontWeight: 600 }}>Total Payout</span>
                  <span style={{ fontWeight: 800, color: C.p, fontSize: 18 }}>
                    ₹{saPayslipRows.filter(p => selectedPayIds.includes(p.id)).reduce((acc, curr) => acc + parseInr(editedSalaries[curr.id] || curr.net), 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {(() => {
                const missing = saPayslipRows.filter(p => {
                  if (!selectedPayIds.includes(p.id)) return false;
                  const e = employees.find(x => x.id === p.empId);
                  return !e?.bankInfo?.accountNumber || !e?.bankInfo?.ifsc;
                });
                if (missing.length > 0) {
                  return (
                    <div style={{ padding: 14, background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 12, marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>⚠️ BLOCKED: MISSING BANK DETAILS</div>
                      <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>
                        {missing.length} employee(s) cannot be paid due to incomplete bank information. Please go back and correct them.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="ghost" onClick={() => setPayrollStep(1)} style={{ flex: 1 }}>Back</Btn>
                <Btn 
                  style={{ flex: 2, padding: "12px", background: "#16a34a", color: "#fff", borderColor: "#16a34a" }} 
                  onClick={handleProcessPayments}
                  disabled={isProcessingPayment || saPayslipRows.filter(p => {
                    if (!selectedPayIds.includes(p.id)) return false;
                    const e = employees.find(x => x.id === p.empId);
                    return !e?.bankInfo?.accountNumber || !e?.bankInfo?.ifsc;
                  }).length > 0}
                >
                  {isProcessingPayment ? "Processing..." : "Proceed to Payment"}
                </Btn>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* showPaymentConfirm removed as replaced by wizard */}

      {/* ─ EMPLOYEE PROFILE (SA) ─ */}
      {profilePick != null && empById(profilePick, employees) && (
        <Modal title="Employee profile" onClose={()=>setProfilePick(null)} width={640}>
          <ProfileDetail e={empById(profilePick, employees)} wrapCard={false} empList={employees} narrow={narrow} />
          
          {isSA && (
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.bdr}`, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Btn variant="outline" onClick={() => setShowEmp(true)} style={{ borderColor: "#4a7c59", color: "#4a7c59" }}>Edit Details</Btn>
              <Btn variant="outline" onClick={() => setShowAssignDevice(true)} style={{ borderColor: "#4a7c59", color: "#4a7c59" }}>Assign Device</Btn>
              <Btn variant="outline" onClick={() => setShowUploadDoc(true)} style={{ borderColor: "#4a7c59", color: "#4a7c59" }}>Upload Document</Btn>
              <Btn variant="outline" onClick={() => setShowTimeline(empById(profilePick, employees))} style={{ borderColor: "#4a7c59", color: "#4a7c59" }}>Activity Timeline</Btn>
              <Btn variant="outline" onClick={() => setShowOffboard(true)} style={{ borderColor: "#dc2626", color: "#dc2626" }}>Offboard Employee</Btn>
              <div style={{ flex: 1 }} />
              <Btn variant="ghost" onClick={()=>setProfilePick(null)}>Close</Btn>
            </div>
          )}
          {!isSA && (
            <div style={{ marginTop:16, textAlign:"right" }}>
              <Btn variant="ghost" onClick={()=>setProfilePick(null)}>Close</Btn>
            </div>
          )}
        </Modal>
      )}

      {showTimeline && (
        <Modal title={`Activity Timeline — ${showTimeline.name}`} onClose={()=>setShowTimeline(null)} width={560}>
          <ActivityTimeline events={showTimeline.timeline || []} />
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20, paddingTop:16, borderTop:`1px solid ${C.bdr}` }}>
            <Btn variant="ghost" onClick={()=>setShowTimeline(null)}>Close</Btn>
          </div>
        </Modal>
      )}

      {showAssignDevice && (
        <Modal title="Assign Device" onClose={()=>setShowAssignDevice(false)} width={400}>
          <Inp label="Device Name" value={devForm.name} onChange={e=>setDevForm(f=>({...f, name: e.target.value}))} placeholder="e.g. MacBook Pro M3" />
          <Inp label="Device Type" opts={["Laptop", "Phone", "Accessories", "Other"]} value={devForm.type} onChange={e=>setDevForm(f=>({...f, type: e.target.value}))} />
          <Inp label="Model Number" value={devForm.model} onChange={e=>setDevForm(f=>({...f, model: e.target.value}))} />
          <Inp label="Serial Number" value={devForm.serial} onChange={e=>setDevForm(f=>({...f, serial: e.target.value}))} />
          <Inp label="Asset Tag (if any)" value={devForm.tag} onChange={e=>setDevForm(f=>({...f, tag: e.target.value}))} />
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <Btn variant="ghost" onClick={()=>setShowAssignDevice(false)} style={{ flex:1 }}>Cancel</Btn>
            <Btn style={{ flex:1 }} onClick={() => {
              if(!devForm.name) return toast("Enter a device name");
              setEmployees(emps => emps.map(e => e.id === profilePick ? { ...e, devices: [...e.devices, `${devForm.name} (${devForm.type})`] } : e));
              setShowAssignDevice(false);
              setDevForm({ name: "", type: "Laptop", model: "", serial: "", tag: "" });
              toast("Device assigned successfully ✓");
            }}>Assign device</Btn>
          </div>
        </Modal>
      )}

      {showUploadDoc && (
        <Modal title="Upload Document" onClose={()=>setShowUploadDoc(false)} width={400}>
          <Inp label="Document Name" value={docForm.name} onChange={e=>setDocForm(f=>({...f, name: e.target.value}))} placeholder="e.g. Identity Card" />
          <Inp label="Document Type" opts={["ID", "Company documents", "Other"]} value={docForm.type} onChange={e=>setDocForm(f=>({...f, type: e.target.value}))} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>SELECT FILE FROM SYSTEM</label>
            <input type="file" onChange={e=>setDocForm(f=>({...f, file: e.target.value}))} style={{ fontSize: 12, width: "100%", padding: "10px", background: C.surf, borderRadius: 8, border: `1px solid ${C.bdr}` }} />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <Btn variant="ghost" onClick={()=>setShowUploadDoc(false)} style={{ flex:1 }}>Cancel</Btn>
            <Btn style={{ flex:1 }} onClick={() => {
              if(!docForm.name) return toast("Enter a document name");
              setEmployees(emps => emps.map(e => e.id === profilePick ? { ...e, documents: [...e.documents, { n: docForm.name, v: false }] } : e));
              setShowUploadDoc(false);
              setDocForm({ name: "", type: "ID", file: "" });
              toast("Document uploaded successfully ✓");
            }}>Upload</Btn>
          </div>
        </Modal>
      )}

      {showOffboard && (
        <Modal title="Offboard Employee" onClose={()=>setShowOffboard(false)} width={400}>
          <p style={{ fontSize: 12, color: C.sub, marginTop: 0, marginBottom: 16 }}>This will move the employee to the Offboarded list.</p>
          <Inp label="Relieving Date" type="date" value={offForm.date} onChange={e=>setOffForm(f=>({...f, date: e.target.value}))} />
          <Inp label="Reason" opts={["Termination", "Resignation", "Mutual"]} value={offForm.reason} onChange={e=>setOffForm(f=>({...f, reason: e.target.value}))} />
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            <Btn variant="ghost" onClick={()=>setShowOffboard(false)} style={{ flex:1 }}>Cancel</Btn>
            <Btn style={{ flex:1, background: "#dc2626", color: "#fff", borderColor: "#dc2626" }} onClick={() => {
              if(!offForm.date) return toast("Provide a relieving date");
              const target = empById(profilePick, employees);
              if (target) {
                const offEmp = { ...target, status: "offboarded", relievingDate: offForm.date, offboardReason: offForm.reason,
                  timeline: [...(target.timeline||[]), { type:"offboarded", label:`Offboarded \u2014 ${offForm.reason} (Effective: ${offForm.date})`, ts: Date.now() }]
                };
                setOffboardedEmployees(prev => [...prev, offEmp]);
              }
              setEmployees(emps => emps.filter(e => e.id !== profilePick));
              setShowOffboard(false);
              setProfilePick(null);
              setOffForm({ date: "", reason: "Resignation" });
              toast("Employee offboarded successfully \u2713");
            }}>Offboard</Btn>
          </div>
        </Modal>
      )}

      {/* ─ LEAVE APPROVE / REJECT CONFIRM ─ */}
      {leaveActionConfirm && (() => {
        const row = leaves.find(l => l.id === leaveActionConfirm.id);
        const isAppr = leaveActionConfirm.act === "approved";
        return (
          <Modal
            title={isAppr ? "Approve this leave?" : "Reject this leave?"}
            onClose={() => setLeaveActionConfirm(null)}
            width={440}
          >
            {row ? (
              <div style={{
                marginBottom:16,
                padding:14,
                borderRadius:12,
                background:C.bg,
                border:`1px solid ${C.bdr}`,
                fontSize:12,
                color:C.txt,
                lineHeight:1.5,
              }}>
                <div style={{ fontWeight:700, marginBottom:8 }}>{row.emp}</div>
                <div style={{ color:C.sub }}>
                  {row.type} · {row.from}–{row.to} ({row.days})
                </div>
                {row.reason && row.reason !== "—" ? (
                  <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.surf}`, color:C.txt }}>
                    “{row.reason}”
                  </div>
                ) : null}
              </div>
            ) : (
              <p style={{ fontSize:12, color:C.sub }}>This request is no longer available.</p>
            )}
            <p style={{ fontSize:12, color:C.sub, marginTop:0, lineHeight:1.5 }}>
              {isAppr
                ? "The employee will be notified that their leave is approved."
                : "The employee will be notified that this request was declined."}
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8, flexWrap:"wrap" }}>
              <Btn variant="ghost" onClick={() => setLeaveActionConfirm(null)}>Cancel</Btn>
              <Btn
                variant={isAppr ? "primary" : "outline"}
                onClick={() => {
                  if (row) actLeave(leaveActionConfirm.id, leaveActionConfirm.act);
                  setLeaveActionConfirm(null);
                }}
              >
                {isAppr ? "Approve leave" : "Reject leave"}
              </Btn>
            </div>
          </Modal>
        );
      })()}

      {/* ─ ADD / VIEW HOLIDAYS MODAL ─ */}
      {showHolidays && (
        <Modal title={isSA ? "Add/View Holidays" : "View Holidays"} onClose={()=>setShowHolidays(false)} width={480}>
          <p style={{ fontSize:12, color:C.sub, marginTop:0, marginBottom:16, lineHeight:1.5 }}>
            {isSA ? "Manage company recognised holidays here. They will appear on everyone's dashboard." : "Here are the upcoming company recognised holidays."}
          </p>
          
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom: isSA ? 20 : 0, maxHeight: 240, overflowY:"auto", paddingRight: 4 }}>
            {[...holidays].sort((a,b)=>a.dISO.localeCompare(b.dISO)).map(h => (
              <div key={h.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.bg }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{h.n}</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{h.d} {h.desc ? `· ${h.desc}` : ""}</div>
                </div>
                {isSA && (
                  <Btn variant="ghost" onClick={() => {
                    setHolidays(p => p.filter(x => x.id !== h.id));
                    toast("Holiday deleted");
                  }} style={{ padding:"4px 10px", fontSize:11, color:"#dc2626" }}>Delete</Btn>
                )}
              </div>
            ))}
            {holidays.length === 0 && (
              <div style={{ textAlign:"center", padding:"20px", color:C.sub, fontSize:12, border:`1px dashed ${C.bdr}`, borderRadius:10 }}>No holidays added yet.</div>
            )}
          </div>

          {isSA && (
            <div style={{ padding:"16px", background:C.surf, borderRadius:12, border:`1px solid ${C.bdr}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.p, marginBottom:10, letterSpacing:1 }}>ADD NEW HOLIDAY</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <Inp 
                  label="Holiday Name" 
                  placeholder="e.g. Diwali" 
                  value={newHolidayName} 
                  onChange={e => setNewHolidayName(e.target.value)} 
                />
                <Inp 
                  label="Date" 
                  type="date" 
                  value={newHolidayDate} 
                  onChange={e => setNewHolidayDate(e.target.value)} 
                />
              </div>
              <div style={{ marginTop:10 }}>
                <Inp 
                  label="Optional Description" 
                  placeholder="Details about this holiday..." 
                  value={newHolidayDesc} 
                  onChange={e => setNewHolidayDesc(e.target.value)} 
                />
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:6 }}>
                <Btn onClick={() => {
                  if (!newHolidayName.trim() || !newHolidayDate) {
                    toast("Please enter a name and date");
                    return;
                  }
                  const dateObj = parseISODate(newHolidayDate);
                  if (isNaN(dateObj.getTime())) {
                    toast("Invalid date");
                    return;
                  }
                  const formattedDate = `${dateObj.getDate()} ${MONTHS_SHORT[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
                  setHolidays(p => [...p, {
                    id: Date.now(),
                    n: newHolidayName.trim(),
                    d: formattedDate,
                    dISO: newHolidayDate,
                    desc: newHolidayDesc.trim()
                  }]);
                  setNewHolidayName("");
                  setNewHolidayDate("");
                  setNewHolidayDesc("");
                  toast("Holiday added ✓");
                }}>+ Add Holiday</Btn>
              </div>
            </div>
          )}
          
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:isSA ? 16 : 0 }}>
            <Btn variant="outline" onClick={()=>setShowHolidays(false)}>Close</Btn>
          </div>
        </Modal>
      )}

      {/* ─ LEAVE POLICY MODAL (SA) ─ */}
      {showLeavePolicy && policyDraft && (
        <Modal title="Leave Policy Configuration" onClose={()=>setShowLeavePolicy(false)} width={460}>
          <p style={{ fontSize:12, color:C.sub, marginTop:0, marginBottom:16, lineHeight:1.5 }}>
            Set how many days each leave type allocates per calendar year. Changes apply to all employees.
          </p>
          {Object.entries(policyDraft).map(([type, cfg]) => (
            <div key={type} style={{ marginBottom:16, padding:"12px 16px", background:C.surf, borderRadius:10, border:`1px solid ${C.bdr}` }}>
              <div style={{ fontWeight:700, fontSize:12, color:C.txt, marginBottom:10 }}>{type}</div>
              <div style={{ display:"flex", gap:12, alignItems:"flex-end" }}>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>TOTAL DAYS / YEAR</label>
                  <input
                    type="number" min="0" max="365"
                    value={cfg.total}
                    onChange={e => setPolicyDraft(d => ({ ...d, [type]: { ...d[type], total: Number(e.target.value) } }))}
                    style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:13, color:C.txt, boxSizing:"border-box" }}
                  />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>ACCRUAL RULE</label>
                  <select
                    value={cfg.accrual}
                    onChange={e => setPolicyDraft(d => ({ ...d, [type]: { ...d[type], accrual: e.target.value } }))}
                    style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:12, color:C.txt, boxSizing:"border-box" }}
                  >
                    <option value="annual">Annual (lump sum)</option>
                    <option value="monthly">Monthly (accrued)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:9, marginTop:20 }}>
            <Btn variant="ghost" onClick={()=>setShowLeavePolicy(false)} style={{ flex:1 }}>Cancel</Btn>
            <Btn onClick={()=>{ setLeavePolicy(policyDraft); setShowLeavePolicy(false); toast("Leave policy updated \u2713"); }} style={{ flex:2 }}>Save Policy</Btn>
          </div>
        </Modal>
      )}

      {/* ─ APPLY LEAVE MODAL ─ */}
      {showLeave && (
        <Modal title={isSA ? "Raise leave" : "Apply for Leave"} onClose={()=>setShowLeave(false)} width={480}>
          {isSA && (
            <p style={{ fontSize:12, color:C.sub, marginTop:0, marginBottom:14, lineHeight:1.5 }}>
              Submit leave for <strong style={{ color:C.txt }}>yourself</strong> or <strong style={{ color:C.txt }}>any employee</strong>. Requests go to the approver you tag below.
            </p>
          )}
          {isSA && (
            <div style={{ marginBottom:13 }}>
              <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>EMPLOYEE</label>
              <select
                value={leaveApply.forEmpId}
                onChange={e => setLeaveApply(f => ({ ...f, forEmpId: Number(e.target.value) }))}
                style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12, color:C.txt, boxSizing:"border-box" }}
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          )}
          <Inp
            label="Leave Type"
            opts={Object.keys(leavePolicy)}
            value={leaveApply.type}
            onChange={e => setLeaveApply(f => ({ ...f, type: e.target.value }))}
          />
          {/* Leave Balance Block */}
          {(() => {
            const empId = isSA ? leaveApply.forEmpId : ME_ID;
            const pol = leavePolicy[leaveApply.type];
            if (!pol) return null;
            const used = usedLeave(empId, leaveApply.type);
            const remaining = Math.max(0, pol.total - used);
            const insufficient = applyDayCount > 0 && applyDayCount > remaining;
            return (
              <div style={{ padding:"10px 14px", borderRadius:9, background: insufficient ? "#4a1a1a" : C.surf, border:`1px solid ${insufficient ? "#dc2626" : C.bdr}`, marginBottom:13, fontSize:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:C.sub }}>Balance · {leaveApply.type}</span>
                  <span style={{ fontWeight:700, color: remaining <= 2 ? "#ef4444" : C.p }}>{remaining} / {pol.total} days remaining</span>
                </div>
                {applyDayCount > 0 && (
                  <div style={{ marginTop:5, fontSize:11, color: insufficient ? "#ef4444" : C.sub }}>
                    {insufficient
                      ? `⚠ Insufficient balance — requesting ${applyDayCount}d, only ${remaining}d left.`
                      : `Requesting ${applyDayCount}d — ${remaining - applyDayCount}d will remain after.`}
                  </div>
                )}
              </div>
            );
          })()}
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap:12 }}>
            <Inp label="From" type="date" value={leaveApply.from} onChange={e => setLeaveApply(f => ({ ...f, from: e.target.value }))} />
            <Inp label="To"   type="date" value={leaveApply.to}   onChange={e => setLeaveApply(f => ({ ...f, to: e.target.value }))} />
          </div>
          {/* Half-day toggle */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:13, flexWrap:"wrap" }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.sub, letterSpacing:.4 }}>DURATION</label>
            {["Full Day","Half Day"].map(opt => (
              <button key={opt} onClick={()=>setLeaveApply(f=>({...f, halfDay: opt==="Half Day"}))} style={{
                padding:"5px 14px", borderRadius:8, border:`1px solid ${leaveApply.halfDay===(opt==="Half Day") ? C.p : C.bdr}`,
                background: leaveApply.halfDay===(opt==="Half Day") ? `rgba(var(--p-rgb),.15)` : "transparent",
                cursor:"pointer", fontSize:12, fontWeight:600,
                color: leaveApply.halfDay===(opt==="Half Day") ? C.p : C.sub,
              }}>{opt}</button>
            ))}
            {leaveApply.halfDay && [
              "First half","Second half"
            ].map(opt => (
              <button key={opt} onClick={()=>setLeaveApply(f=>({...f, halfDayPart: opt}))} style={{
                padding:"5px 14px", borderRadius:8, border:`1px solid ${leaveApply.halfDayPart===opt ? C.p : C.bdr}`,
                background: leaveApply.halfDayPart===opt ? `rgba(var(--p-rgb),.15)` : "transparent",
                cursor:"pointer", fontSize:11, fontWeight:600,
                color: leaveApply.halfDayPart===opt ? C.p : C.sub,
              }}>{opt}</button>
            ))}
          </div>
          {/* Conflict Warning */}
          {(() => {
            const hConflict = holidays.filter(h =>
              leaveApply.from && leaveApply.to &&
              h.dISO >= leaveApply.from && h.dISO <= leaveApply.to
            );
            if (hConflict.length > 0) {
              return (
                <div style={{ padding:"9px 14px", borderRadius:9, background:"rgba(59,130,246,.12)", border:"1px solid #2563eb", marginBottom:13, fontSize:12, color:"#1d4ed8" }}>
                  ℹ Selected dates include company holiday{hConflict.length>1?"s":""}: {hConflict.map(h => h.n).join(", ")}.
                </div>
              );
            }
            return null;
          })()}
          {leaveConflicts.length > 0 && (
            <div style={{ padding:"9px 14px", borderRadius:9, background:"rgba(251,191,36,.12)", border:"1px solid #b45309", marginBottom:13, fontSize:12, color:"#92400e" }}>
              ℹ {leaveConflicts.length} team member{leaveConflicts.length>1?"s are":" is"} already on leave during this period.
            </div>
          )}
          <Inp
            label="Tag Approvers"
            opts={["Select approver…",...employees.filter(e => e.id !== (isSA ? leaveApply.forEmpId : ME_ID)).map(e => e.name)]}
            value={leaveApply.approver && leaveApply.approver !== "" ? leaveApply.approver : "Select approver…"}
            onChange={e => setLeaveApply(f => ({ ...f, approver: e.target.value === "Select approver…" ? "" : e.target.value }))}
          />
          <Inp
            label="Reason"
            type="textarea"
            placeholder="Brief reason for leave…"
            value={leaveApply.reason}
            onChange={e => setLeaveApply(f => ({ ...f, reason: e.target.value }))}
          />
          <div style={{ display:"flex", gap:9, marginTop:18 }}>
            <Btn variant="ghost" onClick={()=>setShowLeave(false)} style={{ flex:1, padding:"10px" }}>Cancel</Btn>
            <Btn
              onClick={() => {
                const empId = isSA ? leaveApply.forEmpId : ME_ID;
                const pol = leavePolicy[leaveApply.type];
                if (pol) {
                  const used = usedLeave(empId, leaveApply.type);
                  const remaining = Math.max(0, pol.total - used);
                  if (applyDayCount > remaining) {
                    toast(`Insufficient ${leaveApply.type} balance (${remaining}d left).`);
                    return;
                  }
                }
                const res = leaveRowFromApplyForm(leaves, employees, leaveApply, ME_ID, isSA);
                if (res.error) { toast(res.error); return; }
                const newRow = { ...res.row, halfDay: leaveApply.halfDay, halfDayPart: leaveApply.halfDayPart };
                setLeaves(p => [...p, newRow]);
                // Notification hook: notify approver
                toast(`Leave request submitted ✓ — ${res.row.approver} has been notified.`);
                setShowLeave(false);
              }}
              style={{ flex:2, padding:"10px" }}
            >
              Submit request
            </Btn>
          </div>
        </Modal>
      )}

      {/* ─ ADD/EDIT EMPLOYEE MODAL ─ */}
      {showEmp && (
        <Modal title={profilePick ? "Edit Employee details" : "Add Employee"} onClose={()=>setShowEmp(false)} width={520}>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, marginBottom:10, letterSpacing:1 }}>PERSONAL DETAILS</div>
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap:12 }}>
            <Inp label="First Name *" value={empForm.firstName} onChange={e=>setEmpForm({...empForm, firstName:e.target.value})} />
            <Inp label="Last Name *" value={empForm.lastName} onChange={e=>setEmpForm({...empForm, lastName:e.target.value})} />
            <Inp label="Email *" type="email" value={empForm.email} onChange={e=>setEmpForm({...empForm, email:e.target.value})} />
            <Inp label="Phone Number" type="tel" value={empForm.phone} onChange={e=>setEmpForm({...empForm, phone:e.target.value})} />
            <Inp label="Date of Birth" value={empForm.dob} onChange={e=>setEmpForm({...empForm, dob:e.target.value})} />
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, margin:"16px 0 10px", letterSpacing:1 }}>EMPLOYMENT DETAILS</div>
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap:12 }}>
            <Inp label="Role" opts={["Employee","Admin","Super Admin"]} value={empForm.role} onChange={e=>setEmpForm({...empForm, role:e.target.value})} />
            <Inp label="Employment Type" opts={["Full Time","Part Time","Contract"]} value={empForm.type} onChange={e=>setEmpForm({...empForm, type:e.target.value})} />
            <Inp label="Date of Joining *" value={empForm.doj} onChange={e=>setEmpForm({...empForm, doj:e.target.value})} />
            <Inp label="Designation" value={empForm.designation} onChange={e=>setEmpForm({...empForm, designation:e.target.value})} />
            <Inp label="Department" opts={["—","Technology","Design","Marketing","Operations","HR"]} value={empForm.dept} onChange={e=>setEmpForm({...empForm, dept:e.target.value})} />
            <Inp label="Manager" opts={["No Manager",...employees.map(e=>e.name)]} value={empForm.manager} onChange={e=>setEmpForm({...empForm, manager:e.target.value})} />
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, margin:"16px 0 10px", letterSpacing:1 }}>EMERGENCY CONTACT</div>
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr 1fr", gap:12 }}>
            <Inp label="Name" value={empForm.ecName||""} onChange={e=>setEmpForm({...empForm, ecName:e.target.value})} />
            <Inp label="Phone" type="tel" value={empForm.ecPhone||""} onChange={e=>setEmpForm({...empForm, ecPhone:e.target.value})} />
            <Inp label="Relationship" value={empForm.ecRel||""} onChange={e=>setEmpForm({...empForm, ecRel:e.target.value})} />
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, margin:"16px 0 10px", letterSpacing:1 }}>CUSTOM FIELDS</div>
          <div style={{ display:"flex", gap:8, alignItems:"flex-end", marginBottom:10 }}>
            <Inp label="Field Name" value={empCustomFieldKey} onChange={e=>setEmpCustomFieldKey(e.target.value)} />
            <Inp label="Value" value={empCustomFieldVal} onChange={e=>setEmpCustomFieldVal(e.target.value)} />
            <Btn variant="outline" onClick={()=>{
              if(!empCustomFieldKey) return;
              setEmpForm(f=>({...f, customFields:[...(f.customFields||[]), {k:empCustomFieldKey, v:empCustomFieldVal}]}));
              setEmpCustomFieldKey(""); setEmpCustomFieldVal("");
            }} style={{ marginBottom:13 }}>+ Add</Btn>
          </div>
          {(empForm.customFields||[]).map((cf,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.txt, padding:"5px 10px", background:C.surf, borderRadius:8, marginBottom:6, border:`1px solid ${C.bdr}` }}>
              <span><strong>{cf.k}:</strong> {cf.v}</span>
              <button onClick={()=>setEmpForm(f=>({...f, customFields:f.customFields.filter((_,j)=>j!==i)}))} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, fontSize:13 }}>✕</button>
            </div>
          ))}
          <div style={{ display:"flex", gap:9, marginTop:20 }}>
            <Btn variant="ghost" onClick={()=>setShowEmp(false)} style={{ flex:1, padding:"10px" }}>Cancel</Btn>
            <Btn onClick={()=>{
              if (!empForm.firstName || !empForm.email) return toast("Missing required fields");
              const targetName = `${empForm.firstName} ${empForm.lastName}`.trim();
              const managerObj = employees.find(e => e.name === empForm.manager);
              const ec = { name: empForm.ecName||"", phone: empForm.ecPhone||"", rel: empForm.ecRel||"" };
              if (profilePick) {
                const prev = empById(profilePick, employees);
                const changes = [];
                if (prev && prev.role !== empForm.role) changes.push({ type:"role_change", label:`Role changed: ${prev.role} → ${empForm.role}`, ts: Date.now() });
                if (prev && prev.dept !== empForm.dept) changes.push({ type:"dept_change", label:`Department changed: ${prev.dept} → ${empForm.dept}`, ts: Date.now() });
                setEmployees(emps => emps.map(e => e.id === profilePick ? {
                  ...e,
                  name: targetName,
                  email: empForm.email,
                  phone: empForm.phone,
                  dob: empForm.dob,
                  role: empForm.role,
                  type: empForm.type,
                  joined: empForm.doj,
                  designation: empForm.designation,
                  dept: empForm.dept,
                  managerId: managerObj ? managerObj.id : null,
                  ini: empForm.firstName[0].toUpperCase() + (empForm.lastName ? empForm.lastName[0].toUpperCase() : ""),
                  emergencyContact: ec,
                  customFields: empForm.customFields || [],
                  timeline: [...(e.timeline||[]), ...changes]
                } : e));
                toast("Changes saved successfully ✓");
              } else {
                toast("Employee created & invite sent ✓");
              }
              setShowEmp(false);
            }} style={{ flex:2, padding:"10px" }}>{profilePick ? "Make changes →" : "Create Employee →"}</Btn>
          </div>
        </Modal>
      )}

      {showImportCsv && (
        <Modal title="Import employees from CSV" onClose={() => setShowImportCsv(false)} width={520}>
          <p style={{ fontSize:12, color:C.sub, marginTop:0, lineHeight:1.55 }}>
            Include a header row. Column names are case-insensitive; use underscores (e.g.{" "}
            <span style={{ fontFamily:"ui-monospace,monospace", fontSize:11, color:C.txt }}>date_of_joining</span>
            ). Use <strong style={{ color:C.txt }}>Export CSV</strong> to download a compatible template.
          </p>
          <div style={{ marginBottom:13, fontSize:12 }}>
            <div style={{ fontWeight:700, color:C.txt, marginBottom:6 }}>Required columns</div>
            <ul style={{ margin:0, paddingLeft:18, color:C.sub, lineHeight:1.65 }}>
              {["name", "email", "role", "department", "employment_type", "date_of_joining"].map(c => (
                <li key={c}><span style={{ fontFamily:"ui-monospace,monospace", fontSize:11, color:C.txt }}>{c}</span></li>
              ))}
            </ul>
          </div>
          <div style={{ marginBottom:18, fontSize:12 }}>
            <div style={{ fontWeight:700, color:C.txt, marginBottom:6 }}>Optional columns</div>
            <ul style={{ margin:0, paddingLeft:18, color:C.sub, lineHeight:1.65 }}>
              {[
                ["phone", "Contact number"],
                ["designation", "Job title"],
                ["salary", "Shown in directory"],
                ["dob", "Date of birth"],
                ["ini", "Two-letter initials; derived from name if omitted"],
                ["avatar_color", "CSS colour, e.g. #99a98f"],
                ["manager_email", "Must match an existing or newly imported employee’s email"],
              ].map(([c, hint]) => (
                <li key={c}>
                  <span style={{ fontFamily:"ui-monospace,monospace", fontSize:11, color:C.txt }}>{c}</span>
                  {" — "}{hint}
                </li>
              ))}
            </ul>
          </div>
          <input
            ref={importCsvRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display:"none" }}
            onChange={async e => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              try {
                const text = await f.text();
                const additions = parseEmployeesFromCSV(text, employees);
                if (additions.length === 0) {
                  toast("No new rows imported (duplicate emails or empty rows).");
                  return;
                }
                setEmployees(prev => [...prev, ...additions]);
                setOrgManagers(m => {
                  const next = { ...m };
                  additions.forEach(a => { next[a.id] = a.managerId ?? null; });
                  return next;
                });
                setShowImportCsv(false);
                toast(`Imported ${additions.length} employee(s) ✓`);
              } catch (err) {
                toast(String(err?.message || err));
              }
            }}
          />
          <div style={{ display:"flex", gap:9, justifyContent:"flex-end", flexWrap:"wrap" }}>
            <Btn variant="ghost" onClick={() => setShowImportCsv(false)}>Cancel</Btn>
            <Btn onClick={() => importCsvRef.current?.click()}>Choose CSV file…</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
