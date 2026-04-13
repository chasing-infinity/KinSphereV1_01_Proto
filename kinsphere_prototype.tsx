import React, { useState, useRef, useEffect } from "react";

const THEMES = {
  Original: {
    p: "#afc0a5",
    p_rgb: "175, 192, 165",
    p2: "#8a9a80",
    bg: "#fffef8",
    mid: "#dce3c7",
    surf: "#dbead2",
    bdr: "#c1d0b5",
    dk: "#3a4832",
    sb: "#4d5e41",
    txt: "#2a3326",
    sub: "#5a6e52",
  },
  Sombre: {
    p: "#92ADA4",
    p_rgb: "146, 173, 164",
    p2: "#A1B5A8",
    bg: "#f2f4f1",
    mid: "#959E96",
    surf: "#d0d9d6",
    bdr: "#b4c2be",
    dk: "#35403e",
    sb: "#455653",
    txt: "#1d2624",
    sub: "#495954",
  },
  "Classi-que": {
    p: "#9B7D61",
    p_rgb: "155, 125, 97",
    p2: "#CBB093",
    bg: "#f8f6f3",
    mid: "#B9AF91",
    surf: "#e4ded4",
    bdr: "#d3c9ba",
    dk: "#483a2d",
    sb: "#5e4b3a",
    txt: "#2c231a",
    sub: "#695646",
  },
  Peppy: {
    p: "#DAA38F",
    p_rgb: "218, 163, 143",
    p2: "#E8C4A9",
    bg: "#fcf8f6",
    mid: "#DDBEA9",
    surf: "#f2e1d7",
    bdr: "#e7cec0",
    dk: "#5d3d32",
    sb: "#7a5245",
    txt: "#3b2620",
    sub: "#8c6455",
  }
};


const getThemeCss = (themeName: string, isDark: boolean) => {
  const t = THEMES[themeName] || THEMES.Original;
  if (isDark) {
    return `:root {
  --p: ${t.p};
  --p-rgb: ${t.p_rgb};
  --p2: ${t.p2};
  --acc: ${t.p};
  --bg: #161814;
  --mid: #252922;
  --surf: #2b3028;
  --bdr: #3d4538;
  --dk: #0d100d;
  --dk2: #161814;
  --sb: #1c2420;
  --dkAcc: ${t.p2};
  --txt: #e8ece6;
  --sub: #a1afa0;
  --wht: #1d211b;
  --shadow-rgb: 0, 0, 0;
}
body { background: var(--bg); color: var(--txt); transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s; margin:0; padding:0; }`;
  }
  return `:root {
  --p: ${t.p};
  --p-rgb: ${t.p_rgb};
  --p2: ${t.p2};
  --acc: ${t.p};
  --bg: ${t.bg};
  --mid: ${t.mid};
  --surf: ${t.surf};
  --bdr: ${t.bdr};
  --dk: ${t.dk};
  --dk2: #2d3a28;
  --sb: ${t.sb};
  --dkAcc: ${t.bdr};
  --txt: ${t.txt};
  --sub: ${t.sub};
  --wht: #ffffff;
  --shadow-rgb: ${t.p_rgb};
}
body { background: var(--bg); color: var(--txt); transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s; margin:0; padding:0; }`;
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.id = "kinsphere-theme-vars";
  style.innerHTML = getThemeCss("Original", false) + `
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
  `;
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
  sb:    "var(--sb)",
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
    bankInfo:{ holder:"Arjun Mehta", acc:"1234567890", ifsc:"HDFC0001234" }, paydaysAccess: true },
  { id:2, ini:"NA", name:"Nihit Agarwal",  email:"nihit@bipolarfactory.com",  role:"Super Admin", dept:"Technology",  type:"Full Time", joined:"Apr 2023", salary:"—",
    phone:"+91 98100 11223", designation:"Head of Engineering", dob:"03 Feb 1992",
    devices:["MacBook Air M2"], documents:[{ n:"Aadhaar", v:true },{ n:"PAN", v:false }], managerId:1,
    bankInfo:{ holder:"Nihit Agarwal", acc:"9876543210", ifsc:"ICIC0005678" }, paydaysAccess: true },
  { id:3, ini:"PS", name:"Priya Sharma",   email:"priya@bipolarfactory.com",  role:"Employee",    dept:"Design",      type:"Full Time", joined:"15 Jun 2023", salary:"₹1,00,000",
    phone:"+91 91234 55667", designation:"Product Designer", dob:"27 Mar 1995",
    devices:["MacBook Pro 14"], documents:[{ n:"Aadhaar", v:true },{ n:"NDA", v:true }], managerId:1,
    bankInfo:{ holder:"Priya Sharma", acc:"5566778899", ifsc:"SBIN0009988" }, paydaysAccess: false },
  { id:4, ini:"RA", name:"Ridwanul Alam",  email:"ridwan@bipolarfactory.com", role:"Super Admin", dept:"Technology",  type:"Full Time", joined:"29 Mar 2025", salary:"₹1",
    phone:"+91 90000 44112", designation:"Software Engineer", dob:"01 Jan 1999",
    devices:["Dell XPS 15"], documents:[{ n:"PAN", v:true }], managerId:2,
    bankInfo:null /* Missing for testing */, paydaysAccess: true },
  { id:5, ini:"S",  name:"Sahil .",        email:"sahil@bipolarfactory.com",  role:"Super Admin", dept:"Technology",  type:"Full Time", joined:"10 Oct 2022", salary:"—",
    phone:"+91 98888 77665", designation:"Tech Lead", dob:"30 Mar 1990",
    devices:["ThinkPad P1"], documents:[{ n:"Aadhaar", v:true },{ n:"Contract", v:true }], managerId:1,
    bankInfo:{ holder:"Sahil", acc:"1122334455", ifsc:"KKBK0004433" }, paydaysAccess: true },
];

const VACANCIES = [
  { id:"v1", name:"(Open Role)", role:"Senior Frontend Engineer", dept:"Technology", managerId:5 },
  { id:"v2", name:"(Open Role)", role:"UI Designer", dept:"Design", managerId:1 },
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
    { y: 2026, months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
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

/**
 * Notification visibility:
 *  forEmpIds: [] means SA-only; a list targets those specific employee IDs.
 *  forAll: true means every role sees it.
 */
const INIT_NOTIFICATIONS = [
  { id:1,  icon:"🗓", title:"Leave request pending",       body:"Arjun Mehta applied for Sick Leave · 25 Mar",             time:"2h ago",  read:false, forSA:true,  forAll:false, forEmpIds:[] },
  { id:2,  icon:"🗓", title:"Leave request pending",       body:"Priya Sharma applied for Casual Leave · 28 Mar",           time:"3h ago",  read:false, forSA:true,  forAll:false, forEmpIds:[] },
  { id:3,  icon:"✅", title:"Your leave was approved",     body:"Sick Leave 10–11 Mar has been approved",                   time:"1d ago",  read:false, forSA:false, forAll:false, forEmpIds:[3] },
  { id:4,  icon:"📄", title:"Document needs verification", body:"Nihit Agarwal · PAN Card uploaded · pending review",       time:"4h ago",  read:false, forSA:true,  forAll:false, forEmpIds:[] },
  { id:5,  icon:"💰", title:"Payslip released",            body:"Your Mar 2026 payslip is now available in Paydays",        time:"2d ago",  read:true,  forSA:false, forAll:true,  forEmpIds:[] },
  { id:6,  icon:"🎉", title:"You received a shout-out!",   body:"Arjun Mehta recognised you for Teamwork 🙌",              time:"5h ago",  read:false, forSA:false, forAll:false, forEmpIds:[3] },
  { id:7,  icon:"👤", title:"New employee onboarded",      body:"Ridwanul Alam joined Technology · Software Engineer",     time:"1w ago",  read:true,  forSA:true,  forAll:false, forEmpIds:[] },
  { id:8,  icon:"💳", title:"Payroll run completed",       body:"Mar 2026 payroll processed · 5 employees paid",           time:"2d ago",  read:true,  forSA:true,  forAll:false, forEmpIds:[] },
  { id:9,  icon:"📋", title:"Onboarding task pending",     body:"3 employees have incomplete onboarding tasks",            time:"3d ago",  read:true,  forSA:true,  forAll:false, forEmpIds:[] },
  { id:10, icon:"🗓", title:"Leave balance low",           body:"Your Earned Leave balance is below 3 days",               time:"3d ago",  read:true,  forSA:false, forAll:false, forEmpIds:[1] },
];

/** Templates with {{placeholder}} support for Step 2 dynamic fill. */
const PAPER_TEMPLATES = [
  {
    id: "tpl-offer",
    name: "Offer Letter",
    type: "Offer Letter",
    fields: ["name","role","salary","start_date","manager","deadline"],
    body: `Dear {{name}},

We are pleased to offer you the position of {{role}} at Bipolar Factory, reporting to {{manager}}.

Start Date: {{start_date}}
Annual CTC: {{salary}}

This offer is subject to the successful completion of background verification and signing of our standard confidentiality agreement.

Kindly sign and return this letter by {{deadline}} to confirm your acceptance.

Warm regards,
Arjun Mehta
Co-founder & CEO, Bipolar Factory`,
  },
  {
    id: "tpl-appointment",
    name: "Appointment Letter",
    type: "Appointment Letter",
    fields: ["name","role","salary","start_date","manager"],
    body: `Dear {{name}},

With reference to the discussions held, we are pleased to formally appoint you as {{role}} effective {{start_date}}.

Your employment will be governed by the terms and conditions of employment as communicated during your onboarding.

Your annual CTC is {{salary}} as per the compensation structure agreed upon.

Please report to {{manager}} on your joining date. This letter serves as your official appointment confirmation.

We look forward to your contributions to the team.

Sincerely,
Arjun Mehta
Co-founder & CEO, Bipolar Factory`,
  },
];

const FIELD_LABELS: Record<string,string> = {
  name: "Full Name", role: "Job Title / Role", salary: "Annual CTC",
  start_date: "Start Date", manager: "Reporting Manager", deadline: "Acceptance Deadline",
};

function fillTemplate(body: string, vals: Record<string,string>) {
  return body.replace(/\{\{(\w+)\}\}/g, (_,k) => vals[k] || `{{${k}}}`);
}

/** Detect handlebars placeholders dynamically from a string. */
function getPlaceholders(text: string) {
  const matches = text.match(/\{\{(\w+)\}\}/g) || [];
  return [...new Set(matches.map(m => m.replace(/[\{\}]/g, "")))];
}

/** Demo documents pre-seeded in Paperwork Hub. */
const INIT_PAPERS = [
  { id:"doc-1", name:"Offer Letter",       empId:3, candidateId:null, type:"Offer Letter",       date:"15 Jun 2023", fileName:"offer-priya.pdf",   status:"draft", sendLink:null, filledBody:null },
  { id:"doc-2", name:"NDA",                empId:3, candidateId:null, type:"Other",              date:"15 Jun 2023", fileName:"nda-priya.pdf",     status:"draft", sendLink:null, filledBody:null },
  { id:"doc-3", name:"Appointment Letter", empId:4, candidateId:null, type:"Appointment Letter", date:"29 Mar 2025", fileName:"appt-ridwan.pdf",   status:"draft", sendLink:null, filledBody:null },
  { id:"doc-4", name:"Offer Letter",       empId:5, candidateId:null, type:"Offer Letter",       date:"10 Oct 2022", fileName:"offer-sahil.pdf",   status:"draft", sendLink:null, filledBody:null },
  { id:"doc-5", name:"Contract",           empId:5, candidateId:null, type:"Other",              date:"10 Oct 2022", fileName:"contract-sahil.pdf",status:"draft", sendLink:null, filledBody:null },
  { id:"doc-6", name:"Offer Letter",       empId:1, candidateId:null, type:"Offer Letter",       date:"01 Jan 2022", fileName:"offer-arjun.pdf",   status:"draft", sendLink:null, filledBody:null },
];

const INIT_CANDIDATES = [
  { id:"cand-1", name:"Riya Nair",      email:"riya.nair@gmail.com",    role:"Product Manager",    salary:"₹18,00,000", startDate:"01 May 2026", notes:"Strong PM background" },
  { id:"cand-2", name:"Aman Verma",     email:"aman.v@outlook.com",     role:"Backend Engineer",   salary:"₹14,00,000", startDate:"15 May 2026", notes:"3 yrs Go experience" },
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

/** Calculate days until next birthday/anniversary (ignoring year). Includes 0, 1, 2, 3 only. */
function getEventDays(dateStr) {
  if (!dateStr || dateStr === "—") return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Parse "DD Month YYYY" or "Month YYYY"
  const parts = dateStr.trim().split(/\s+/);
  let day = 1;
  let monthStr = "";
  
  if (parts.length === 2) { // "Month YYYY"
    monthStr = parts[0];
  } else if (parts.length === 3) { // "DD Month YYYY"
    day = parseInt(parts[0]);
    monthStr = parts[1];
  } else {
    return null;
  }

  const monthIdx = MONTHS_SHORT.indexOf(monthStr.slice(0, 3));
  if (monthIdx === -1) return null;

  let target = new Date(now.getFullYear(), monthIdx, day);
  
  // If the event was earlier this year, look at next year
  if (target < now) {
    target.setFullYear(now.getFullYear() + 1);
  }
  
  const diff = target.getTime() - now.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  
  return (days >= 0 && days <= 3) ? days : null;
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
  "Paperwork Hub": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Employees: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  "Time Away": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2"/></svg>,
  Paydays: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Recognition: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  "Org Chart": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>,
  "People Chapters": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  "Listening Room": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  Settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  "My Profile": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  "Add Employee": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ClipboardList: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="12" y1="11" x2="16" y2="11"/><line x1="12" y1="16" x2="16" y2="16"/><line x1="8" y1="11" x2="8.01" y2="11"/><line x1="8" y1="16" x2="8.01" y2="16"/></svg>,
  Presence: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  "Vibe Check": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 14h6"/></svg>,
  "Reports & Analytics": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

const NAV = [
  { key:"Dashboard" },
  { key:"Presence" },
  { key:"Employees" },
  { key:"Time Away" },
  { key:"Paydays" },
  { key:"Paperwork Hub" },
  { key:"People Chapters" },
  { key:"Recognition" },
  { key:"Org Chart" },
  { key:"Listening Room" },
  { key:"Vibe Check" },
  { key:"Reports & Analytics" },
  { key:"Settings" },
];

const navItemsForRole = (isSA, isAdmin) =>
  NAV.filter(n => (isAdmin || n.key !== "People Chapters") && (isSA || n.key !== "Reports & Analytics"))
     .map(n => (n.key === "Employees" ? (isAdmin ? n : { key:"My Profile" }) : n));

function daysInMonth(y, m0) {
  return new Date(y, m0 + 1, 0).getDate();
}
function parseISODate(s: string) {
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
  if (status === "pending") return "#fef9c3";
  if (status === "approved") return "#dcfce7";
  if (status === "rejected") return "#fee2e2";
  return "#ffffff";
}

/** All leave rows active on a calendar day (inclusive range). */
function leavesOnDate(allLeaves, d) {
  return allLeaves.filter(l => dateInRange(d, l.fromISO, l.toISO));
}

function saDayCellBg(isOff, dayLeaves) {
  if (isOff) return "#f3f4f6";
  if (!dayLeaves.length) return "#ffffff";
  const hasP = dayLeaves.some(l => l.status === "pending");
  const hasA = dayLeaves.some(l => l.status === "approved");
  if (hasP && hasA) return "#ffedd5"; // Mixed
  if (hasP) return "#fef9c3";
  if (hasA) return "#dcfce7";
  return "#fee2e2"; // Rejected
}

const RECOGS = [
  { 
    id: 1, from:"Arjun Mehta", fIni:"AM", to:"Ridwanul Alam", tIni:"RA", 
    msg:"Thanks for the quick turnaround on the API fix!", time:"10h ago", 
    tags: ["Ownership", "Teamwork"], 
    reactions: { like: 5, celebrate: 2 }, 
    isPrivate: false, 
    comments: [
      { from: "Priya Sharma", ini: "PS", txt: "Totally agree, Ridwanul is a lifesaver!", time: "8h ago" }
    ]
  },
  { 
    id: 2, from:"Arjun Mehta", fIni:"AM", to:"Priya Sharma",  tIni:"PS", 
    msg:"Great work on the design system docs!", time:"4d ago", 
    tags: ["Creativity"], 
    reactions: { like: 12, celebrate: 8 }, 
    isPrivate: false, 
    comments: [] 
  },
];

const THEMED_AV_COLORS = [
  "var(--p)", "var(--p2)", "var(--acc)", "rgba(var(--p-rgb), 0.8)", "rgba(var(--p-rgb), 0.7)", "rgba(var(--p-rgb), 0.9)"
];

const getThemedAvatarColor = (seed) => {
  if (!seed) return THEMED_AV_COLORS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return THEMED_AV_COLORS[Math.abs(hash) % THEMED_AV_COLORS.length];
};

const Av = ({ ini, sz=34, bg }: { ini: any; sz?: number; bg?: any }) => {
  const finalBg = bg && bg !== "var(--p)" ? bg : getThemedAvatarColor(ini);
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

const Btn = ({ children, onClick, variant="primary", style:s={}, disabled=false }: { children: any; onClick?: any; variant?: string; style?: any; disabled?: boolean }) => {
  const base = { border:"none", borderRadius:9, fontSize:12, fontWeight:600, cursor: disabled ? "not-allowed" : "pointer", padding:"8px 18px", transition:"opacity .15s", opacity: disabled ? 0.6 : 1, ...s };
  const v = variant==="primary" ? { background:C.p,   color:"#fff" }
          : variant==="ghost"   ? { background:"transparent", border:`1px solid ${C.bdr}`, color:C.sub }
          : variant==="outline" ? { background:C.surf, border:`1px solid ${C.bdr}`, color:C.txt }
          :                       { background:C.mid,  border:`1px solid ${C.bdr}`, color:C.txt };
  return (
    <button onClick={onClick} style={{...base,...v}} disabled={disabled}
      onMouseEnter={e=>{ if(!disabled) e.currentTarget.style.opacity=".82"}}
      onMouseLeave={e=>{ if(!disabled) e.currentTarget.style.opacity="1"}}>{children}</button>
  );
};

const Card = ({ children, style: s = {}, ...props }: any) => (
  <div {...props} style={{
    background:C.wht, borderRadius:14, border:`1px solid ${C.bdr}`,
    padding:"clamp(16px, 3.5vw, 22px) clamp(16px, 4vw, 24px)",
    ...s,
  }}>{children}</div>
);

// --- Icons (Premium / Minimalist) ---
const IconPlus = ({ size=16, strokeWidth=2.5, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconTrash = ({ size=16, strokeWidth=2, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const IconEdit = ({ size=16, strokeWidth=2, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
);
const IconCheck = ({ size=14, strokeWidth=3, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const IconChevronLeft = ({ size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const IconBox = ({ size=48, color=C.bdr }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
);
const IconUser = ({ size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const IconExternal = ({ size=12, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);
const IconSettings = ({ size=16, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);
// --- end icons ---

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
        {opts.map((o, idx) => {
          const l = typeof o === 'object' ? o.label : o;
          const v = typeof o === 'object' ? o.value : o;
          return <option key={idx} value={v}>{l}</option>;
        })}
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

const OrgPreviewCard = ({ node, isEmp, onReassign, isAdmin, employees, onClose }) => {
  if (!node) return null;
  const managerName = isEmp ? employees.find(x => x.id === node.managerId)?.name : employees.find(x => x.id === node.managerId)?.name;

  return (
    <div style={{
      position:"fixed", bottom:24, right:24, width:280, background:C.wht, borderRadius:20,
      border:`1px solid ${C.bdr}`, boxShadow:"0 10px 40px rgba(0,0,0,.15)", padding:20, zIndex:1000,
      animation:"slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          {isEmp ? <Av ini={node.ini} sz={44} bg={node.avatarC || C.p} /> : <div style={{ width:44, height:44, borderRadius:"50%", background:C.surf, border:`1px dashed ${C.bdr}`, display:"flex", alignItems:"center", justifyContent:"center" }}>?</div>}
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.txt }}>{node.name}</div>
            <div style={{ fontSize:12, color:C.sub }}>{isEmp ? node.designation : node.role}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, fontSize:18 }}>×</button>
      </div>

      <div style={{ display:"grid", gap:10, marginBottom:16 }}>
        <div style={{ fontSize:12, color:C.sub }}>
          <span style={{ fontWeight:600, color:C.txt }}>Dept:</span> {node.dept}
        </div>
        <div style={{ fontSize:12, color:C.sub }}>
          <span style={{ fontWeight:600, color:C.txt }}>Manager:</span> {managerName || "Top Level"}
        </div>
      </div>

      {isAdmin && isEmp && (
        <div style={{ borderTop:`1px solid ${C.bdr}`, paddingTop:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, marginBottom:8, letterSpacing:0.5 }}>REASSIGN MANAGER</div>
          <select 
            onChange={(e) => onReassign(node.id, e.target.value === "null" ? null : parseInt(e.target.value))}
            value={node.managerId ?? "null"}
            style={{ 
              width:"100%", padding:"8px", borderRadius:8, border:`1px solid ${C.bdr}`, 
              fontSize:12, outline:"none", background:C.bg, cursor:"pointer"
            }}
          >
            <option value="null">None (Top Level)</option>
            {employees.filter(x => x.id !== node.id).map(x => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const Verified = () => (

  <span title="Verified" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:16, height:16, borderRadius:"50%", background:"#22c55e", color:"#fff", fontSize:10, fontWeight:800, marginLeft:6 }}>✓</span>
);

const OrgTreeNode = ({ 
  nodeId, nodeType="emp", orgManagers, depth = 0, empList = EMPS, 
  orgSearch="", collapsedNodes = new Set(), onToggleCollapse, onPreview, orgPreviewId,
  vacancies = []
}) => {
  const isEmp = nodeType === "emp";
  const e = isEmp ? empList.find(x => x.id === nodeId) : vacancies.find(x => x.id === nodeId);
  if (!e) return null;

  const isCollapsed = collapsedNodes.has(nodeId);
  const reports = isEmp ? empList.filter(x => orgManagers[x.id] === nodeId) : [];
  const vacancyReports = isEmp ? vacancies.filter(v => v.managerId === nodeId) : [];
  const allReports = [...reports, ...vacancyReports];
  
  const matchesSearch = orgSearch && (
    e.name.toLowerCase().includes(orgSearch.toLowerCase()) || 
    (e.role || e.designation || "").toLowerCase().includes(orgSearch.toLowerCase()) ||
    e.dept.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const isSelected = orgPreviewId === nodeId;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
      {/* Node Card */}
      <div 
        onClick={() => onPreview(nodeId)}
        style={{
          padding:"12px 14px", borderRadius:14, 
          border:`2px solid ${isSelected ? C.p : (matchesSearch ? C.p2 : (depth === 0 ? C.p : C.bdr))}`, 
          background:C.wht,
          minWidth:134, textAlign:"center", cursor:"pointer",
          boxShadow: isSelected ? `0 0 0 4px rgba(var(--p-rgb),.15), 0 4px 12px rgba(0,0,0,.08)` : "0 2px 8px rgba(var(--shadow-rgb),.06)",
          transition:"all .2s ease",
          borderStyle: isEmp ? "solid" : "dashed",
          opacity: matchesSearch || !orgSearch ? 1 : 0.4,
          transform: isSelected ? "scale(1.05)" : "scale(1)",
          zIndex: isSelected ? 10 : 1,
        }}
      >
        {isEmp ? <Av ini={e.ini} sz={36} bg={e.avatarC || C.p} /> : <div style={{ width:36, height:36, borderRadius:"50%", background:C.surf, border:`1px dashed ${C.bdr}`, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>?</div>}
        <div style={{ fontSize:11, fontWeight:700, color:C.txt, marginTop:6 }}>{e.name}</div>
        <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>{isEmp ? e.designation : e.role}</div>
        <div style={{ 
          fontSize:9, fontWeight:700, color:C.p, marginTop:6, 
          padding:"2px 6px", borderRadius:4, background:`rgba(var(--p-rgb),.08)`, display:"inline-block" 
        }}>{e.dept}</div>
        
        {/* Expand/Collapse Toggle */}
        {allReports.length > 0 && (
          <button
            onClick={(ev) => { ev.stopPropagation(); onToggleCollapse(nodeId); }}
            style={{
              position:"absolute", bottom:-10, left:"50%", transform:"translateX(-50%)",
              width:20, height:20, borderRadius:"50%", background:C.wht, border:`1px solid ${C.bdr}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800,
              cursor:"pointer", boxShadow:"0 2px 4px rgba(0,0,0,.1)", color:C.p, zIndex:5,
            }}
          >
            {isCollapsed ? "+" : "−"}
          </button>
        )}
      </div>

      {!isCollapsed && allReports.length > 0 && (
        <>
          <div style={{ width:2, height:24, background:C.bdr, flexShrink:0 }} />
          <div style={{ display:"flex", gap:20, alignItems:"flex-start", justifyContent:"center", flexWrap:"wrap", padding:"0 10px" }}>
            {reports.map(r => (
              <OrgTreeNode 
                key={r.id} nodeId={r.id} nodeType="emp" orgManagers={orgManagers} depth={depth + 1} empList={empList} 
                orgSearch={orgSearch} collapsedNodes={collapsedNodes} onToggleCollapse={onToggleCollapse} 
                onPreview={onPreview} orgPreviewId={orgPreviewId} vacancies={vacancies}
              />
            ))}
            {vacancyReports.map(v => (
              <OrgTreeNode 
                key={v.id} nodeId={v.id} nodeType="vacancy" orgManagers={orgManagers} depth={depth + 1} empList={empList} 
                orgSearch={orgSearch} collapsedNodes={collapsedNodes} onToggleCollapse={onToggleCollapse} 
                onPreview={onPreview} orgPreviewId={orgPreviewId} vacancies={vacancies}
              />
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

const ProfileDetail = ({ e, wrapCard = true, empList = EMPS, narrow = false, onEditBank, onApproveDoc = null, onRejectDoc = null, onPreviewDoc = null }) => {
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom:8 }}>
          <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5 }}>BANK DETAILS</div>
          {onEditBank && <button onClick={onEditBank} style={{ background:"none", border:`1px solid ${C.p}`, color:C.p, borderRadius:4, padding:"3px 8px", fontSize:10, fontWeight:700, cursor:"pointer" }}>Edit bank info</button>}
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
      <div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${C.bdr}` }}>
        <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>ASSIGNED DEVICES</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {(e.devices||[]).map(d => <span key={d} style={{ background:C.surf, padding:"5px 11px", borderRadius:8, border:`1px solid ${C.bdr}` }}>{d}</span>)}
        </div>
      </div>
      <div style={{ marginTop:16 }}>
        <div style={{ color:C.sub, fontWeight:600, fontSize:10, letterSpacing:.5, marginBottom:8 }}>UPLOADED DOCUMENTS</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(e.documents||[]).length === 0 && (
            <div style={{ fontSize:12, color:C.sub, fontStyle:"italic" }}>No documents uploaded.</div>
          )}
          {(e.documents||[]).map((doc,i) => (
            <div
              key={i}
              onClick={() => onPreviewDoc && onPreviewDoc(doc, e)}
              style={{
                display:"flex", alignItems:"center", fontSize:12, color:C.txt,
                background:C.surf, padding:"8px 12px", borderRadius:8,
                border:`1px solid ${doc.v ? C.bdr : "#b45309"}`,
                cursor: onPreviewDoc ? "pointer" : "default",
                transition:"box-shadow .15s",
              }}
              onMouseEnter={e => { if (onPreviewDoc) e.currentTarget.style.boxShadow = `0 0 0 2px ${C.p}`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={{ fontSize:16, marginRight:8 }}>📄</span>
              <span style={{ flex:1 }}>{doc.n}</span>
              {onPreviewDoc && <span style={{ fontSize:10, color:C.sub, marginRight:8 }}>View ↗</span>}
              {doc.v ? (
                <Verified />
              ) : onApproveDoc ? (
                <div style={{ display:"flex", gap:6, alignItems:"center" }} onClick={ev => ev.stopPropagation()}>
                  <span style={{ fontSize:10, color:"#b45309", fontWeight:600, marginRight:4 }}>Pending</span>
                  <button
                    onClick={() => onApproveDoc(i)}
                    style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:6, border:"none", background:"#4a7c59", color:"#fff", cursor:"pointer" }}
                  >Approve</button>
                  <button
                    onClick={() => onRejectDoc(i)}
                    style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:6, border:"none", background:"#dc2626", color:"#fff", cursor:"pointer" }}
                  >Reject</button>
                </div>
              ) : (
                <span style={{ fontSize:10, color:"#b45309", fontWeight:600 }}>Pending</span>
              )}
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
  return wrapCard ? <Card style={{ maxWidth:640, boxShadow:"0 2px 14px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset", position:"relative" }}>{body}</Card> : <div>{body}</div>;
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


const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 180 };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init();
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", handleResize);
    canvas.parentElement.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.parentElement.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    class Particle {
      constructor(x, y, speedX, speedY, size, opacity, parallax) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.size = size;
        this.baseOpacity = opacity;
        this.opacity = opacity;
        this.parallax = parallax;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.015;
      }
      draw() {
        // Main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();

        // Faster glow (simulated shadowBlur)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.2})`;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            if (distance < 50) {
              const angle = Math.atan2(dy, dx);
              this.x -= Math.cos(angle) * 1.2;
              this.y -= Math.sin(angle) * 1.2;
            } else {
              this.x += dx * 0.003;
              this.y += dy * 0.003;
            }
          }
        }

        this.x += this.speedX * this.parallax;
        this.y += this.speedY * this.parallax;
        
        this.pulse += this.pulseSpeed;
        this.opacity = this.baseOpacity * (0.6 + Math.sin(this.pulse) * 0.4);

        this.draw();
      }
    }

    const init = () => {
      particlesArray = [];
      // Foreground layer
      let fgCount = (canvas.width * canvas.height) / 35000;
      for (let i = 0; i < fgCount; i++) {
        let size = Math.random() * 2 + 1.2;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let vx = (Math.random() - 0.5) * 0.4;
        let vy = (Math.random() - 0.5) * 0.4;
        particlesArray.push(new Particle(x, y, vx, vy, size, 0.5, 1.2));
      }
      // Background layer
      let bgCount = (canvas.width * canvas.height) / 18000;
      for (let i = 0; i < bgCount; i++) {
        let size = Math.random() * 1.2 + 0.4;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let vx = (Math.random() - 0.5) * 0.15;
        let vy = (Math.random() - 0.5) * 0.15;
        particlesArray.push(new Particle(x, y, vx, vy, size, 0.2, 0.6));
      }
    };

    const drawAmbience = (time) => {
      const g = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.0004) * 50,
        canvas.height * 0.4 + Math.cos(time * 0.0003) * 50,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        Math.min(canvas.width, canvas.height) * 0.8
      );
      g.addColorStop(0, "rgba(255, 255, 255, 0.02)");
      g.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const connect = () => {
      ctx.lineWidth = 0.7;
      const maxDist = (canvas.width > 800 ? 150 : 110);
      
      // Group lines by opacity/state for fewer path cycles if possible, 
      // but sharing a single stroke() for now.
      ctx.beginPath();
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDist) {
            let opacityValue = (1 - (distance / maxDist)) * 0.15;
            
            // Interaction highlight check
            let isHighlight = false;
            if (mouse.x !== null && mouse.y !== null) {
              let mdx = mouse.x - (particlesArray[a].x + particlesArray[b].x) / 2;
              let mdy = mouse.y - (particlesArray[a].y + particlesArray[b].y) / 2;
              if (Math.sqrt(mdx * mdx + mdy * mdy) < 80) isHighlight = true;
            }

            if (isHighlight) {
              // Stroke highlighted lines immediately to change color
              ctx.stroke(); 
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 2.5})`;
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
              ctx.beginPath();
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            }
          }
        }
      }
      ctx.stroke();
    };

    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAmbience(time);
      
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
      ctx.globalCompositeOperation = 'source-over';
    };

    handleResize();
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas.parentElement) {
        canvas.parentElement.removeEventListener("mousemove", handleMouseMove);
        canvas.parentElement.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", opacity: 0.95 }} />
    </div>
  );
};

const LoginScreen = ({ onLogin, logoUrl, tagline }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusInput, setFocusInput] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      onLogin("Employee");
    }, 1500);
  };

  const handleRoleLogin = (role) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(role);
    }, 1200);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", width:"100vw", background:C.wht, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @media (max-width: 768px) { .login-left { display: none !important; } }
      `}</style>
      
      {/* Left side */}
      <div className="login-left" style={{ flex:1.5, display:"flex", background:`linear-gradient(135deg, ${C.p} 0%, #1e2c22 100%)`, flexDirection:"column", justifyContent:"center", alignItems:"flex-start", padding:60, position:"relative", overflow:"hidden" }}>
        
        {/* Particle Animation Background */}
        <ParticlesBackground />
        
        {/* Subtle decorative circles for depth */}
        <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)` }}/>
        <div style={{ position:"absolute", bottom:-50, left:-50, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)` }}/>

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}>
            {logoUrl ? <img src={logoUrl} alt="Logo" style={{ height:40, width:"auto", objectFit:"contain" }} /> : <div style={{ width:40, height:40, borderRadius:8, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", color:C.p, fontSize:20, fontWeight:700, fontFamily:"Georgia,serif" }}>K</div>}
            <div style={{ fontSize:24, fontWeight:700, fontFamily:"Georgia,serif", color:"#fff" }}>KinSphere</div>
          </div>
          <h1 style={{ fontSize:"clamp(34px, 4vw, 48px)", fontWeight:700, color:"#fff", margin:0, fontFamily:"Georgia,serif", lineHeight:1.1, letterSpacing:"-0.02em" }}>
            {tagline || "People-first. Always."}
          </h1>
          <p style={{ marginTop:24, fontSize:16, color:"rgba(255,255,255,0.75)", maxWidth:400, lineHeight:1.6 }}>
            Experience seamless HR management, fast performance, and a unified workspace for your entire team.
          </p>
        </div>
      </div>
      
      {/* Right side */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:40, width:"100%" }}>
        <div style={{ width:"100%", maxWidth:360 }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:C.txt, margin:"0 0 8px", fontFamily:"Georgia,serif" }}>Welcome back</h2>
          <p style={{ fontSize:14, color:C.sub, margin:"0 0 32px" }}>Enter your details to access your workspace.</p>
          
          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.sub, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Work Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocusInput('email')} onBlur={()=>setFocusInput(null)} placeholder="name@company.com" style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:10, border:`1px solid ${focusInput==='email'?C.p:C.bdr}`, outline:"none", fontSize:14, background:focusInput==='email'?C.wht:C.bg, boxShadow:focusInput==='email'?`0 0 0 3px rgba(var(--p-rgb),.15)`:"", transition:"all 0.2s" }} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.sub, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocusInput('pass')} onBlur={()=>setFocusInput(null)} placeholder="••••••••" style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:10, border:`1px solid ${focusInput==='pass'?C.p:C.bdr}`, outline:"none", fontSize:14, background:focusInput==='pass'?C.wht:C.bg, boxShadow:focusInput==='pass'?`0 0 0 3px rgba(var(--p-rgb),.15)`:"", transition:"all 0.2s" }} />
            </div>
            <button type="submit" disabled={loading || !(email && password)} style={{ marginTop:8, width:"100%", padding:"14px", borderRadius:10, background:loading?C.sub:(email && password ? C.p : C.bg), color:(email && password)?"#fff":C.sub, border:(email && password)?"none":`1px solid ${C.bdr}`, fontSize:15, fontWeight:700, cursor:(loading || !(email && password))?"not-allowed":"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
            <div style={{ flex:1, height:1, background:C.bdr }} />
            <span style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:0.5 }}>Demo As</span>
            <div style={{ flex:1, height:1, background:C.bdr }} />
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button type="button" onClick={()=>handleRoleLogin("Super Admin")} disabled={loading} style={{ padding:12, borderRadius:10, background:C.bg, border:`1px solid ${C.bdr}`, color:C.txt, fontSize:13, fontWeight:600, cursor:loading?"wait":"pointer", transition:"all 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background=C.wht} onMouseLeave={e=>e.currentTarget.style.background=C.bg}>Login as Super Admin</button>
            <button type="button" onClick={()=>handleRoleLogin("Admin")}       disabled={loading} style={{ padding:12, borderRadius:10, background:C.bg, border:`1px solid ${C.bdr}`, color:C.txt, fontSize:13, fontWeight:600, cursor:loading?"wait":"pointer", transition:"all 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background=C.wht} onMouseLeave={e=>e.currentTarget.style.background=C.bg}>Login as Admin</button>
            <button type="button" onClick={()=>handleRoleLogin("Employee")}    disabled={loading} style={{ padding:12, borderRadius:10, background:C.bg, border:`1px solid ${C.bdr}`, color:C.txt, fontSize:13, fontWeight:600, cursor:loading?"wait":"pointer", transition:"all 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background=C.wht} onMouseLeave={e=>e.currentTarget.style.background=C.bg}>Login as Employee</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Offboard Default Steps ──────────────────────────────────────────────────
const OFFBOARD_DEFAULT_STEPS = [
  { name: "Resignation/Termination/Retirement email shared", status: "Pending", group: "Phase 1: Communication" },
  { name: "Notice Period discussed and finalized", status: "Pending", group: "Phase 1: Communication" },
  { name: "KT Sessions started", status: "Pending", group: "Phase 2: Transition" },
  { name: "Replacement hiring initiated", status: "Pending", group: "Phase 2: Transition" },
  { name: "Documents shared from company side", status: "Pending", group: "Phase 2: Transition" },
  { name: "Exit Feedback conducted", status: "Pending", group: "Phase 3: Operations" },
  { name: "Devices / Property returned", status: "Pending", group: "Phase 3: Operations" },
  { name: "Taken off Workspace (Slack + Gmail)", status: "Pending", group: "Phase 3: Operations" },
  { name: "F&F Settlement completed", status: "Pending", group: "Phase 4: Closure" },
];

// ─── Onboard Default Steps ───────────────────────────────────────────────────
const ONBOARD_DEFAULT_STEPS = [
  { name: "Offer Letter Sent", status: "Pending", group: "Phase 1: Documents" },
  { name: "Offer Letter Signed", status: "Pending", group: "Phase 1: Documents" },
  { name: "Verification Documents Collected", status: "Pending", group: "Phase 1: Documents" },
  { name: "Background Verification Complete", status: "Pending", group: "Phase 1: Documents" },
  { name: "Company Email Created", status: "Pending", group: "Phase 2: Digital Identity" },
  { name: "Slack / Teams Set up", status: "Pending", group: "Phase 2: Digital Identity" },
  { name: "Jira / Key Tools Provisioned", status: "Pending", group: "Phase 2: Digital Identity" },
  { name: "HRMS Invite Sent", status: "Pending", group: "Phase 2: Digital Identity" },
  { name: "Main Laptop / Desktop Assigned", status: "Pending", group: "Phase 3: IT & Hardware" },
  { name: "Peripherals Provided", status: "Pending", group: "Phase 3: IT & Hardware" },
  { name: "Security Keys / VPN Configured", status: "Pending", group: "Phase 3: IT & Hardware" },
  { name: "Office ID Badge Issued", status: "Pending", group: "Phase 3: IT & Hardware" },
  { name: "Manager Intro & Buddy Assigned", status: "Pending", group: "Phase 4: Culture & Org" },
  { name: "Added to Org Chart & Groups", status: "Pending", group: "Phase 4: Culture & Org" },
  { name: "30-60-90 Day Plan Shared", status: "Pending", group: "Phase 4: Culture & Org" },
  { name: "Salary Structure & Tax Setup", status: "Pending", group: "Phase 5: Compliance" },
  { name: "Bank Account Details Verified", status: "Pending", group: "Phase 5: Compliance" },
  { name: "Policy Manual Acknowledged", status: "Pending", group: "Phase 5: Compliance" },
  { name: "Appointment Letter Issued", status: "Pending", group: "Phase 5: Compliance" },
];

let GLOBAL_ONBOARDINGS = [
  {
    id: "ob1",
    hireType: "New",
    name: "Aman Verma",
    role: "Backend Engineer",
    email: "aman@bipolarfactory.com",
    doj: "2026-05-15",
    checklist: [
      { name: "Offer Letter Sent", status: "Completed", group: "Phase 1: Documents" },
      { name: "Offer Letter Signed", status: "Completed", group: "Phase 1: Documents" },
      { name: "Verification Documents Collected", status: "Completed", group: "Phase 1: Documents" },
      { name: "Background Verification Complete", status: "Completed", group: "Phase 1: Documents" },
      { name: "Company Email Created", status: "Pending", group: "Phase 2: Digital Identity" },
      { name: "Slack / Teams Set up", status: "Pending", group: "Phase 2: Digital Identity" },
      { name: "Jira / Key Tools Provisioned", status: "Pending", group: "Phase 2: Digital Identity" },
      { name: "HRMS Invite Sent", status: "Pending", group: "Phase 2: Digital Identity" },
      { name: "Main Laptop / Desktop Assigned", status: "Pending", group: "Phase 3: IT & Hardware" },
      { name: "Peripherals Provided", status: "Pending", group: "Phase 3: IT & Hardware" },
      { name: "Manager Intro & Buddy Assigned", status: "Pending", group: "Phase 4: Culture & Org" },
      { name: "Salary Structure & Tax Setup", status: "Pending", group: "Phase 5: Compliance" },
      { name: "Appointment Letter Issued", status: "Pending", group: "Phase 5: Compliance" },
    ]
  }
];

// ─── Shared Lifecycle UI Components ─────────────────────────────────────────
const KpiPill = ({ label, value, color = null }: any) => (
  <div style={{ textAlign:"center", padding:"14px 18px", borderRadius:12, background:C.surf, border:`1px solid ${C.bdr}`, flex:1, minWidth:72 }}>
    <div style={{ fontSize:20, fontWeight:800, color: color || C.p, letterSpacing:-0.5 }}>{value}</div>
    <div style={{ fontSize:9, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:0.8, marginTop:3 }}>{label}</div>
  </div>
);

const PhaseHeader = ({ label, done, total, isEditMode }: any) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, paddingBottom:8, borderBottom:`1px solid ${C.bdr}` }}>
    <h3 style={{ fontSize:10, fontWeight:800, margin:0, color: isEditMode ? C.p : C.sub, textTransform:"uppercase", letterSpacing:1.8 }}>{label}</h3>
    {!isEditMode && <span style={{ fontSize:10, fontWeight:700, color:C.sub, background:C.bg, padding:"2px 8px", borderRadius:99 }}>{done}/{total}</span>}
  </div>
);

const LifecycleRow = ({ item, onToggle, onEdit, onDelete, isEditMode, cta, onCtaClick }: any) => {
  const checked = item.status === "Completed";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:checked ? `rgba(var(--p-rgb),0.03)` : C.surf, borderRadius:10, border:`1px solid ${checked ? C.p : C.bdr}`, marginBottom:6, transition:"all 0.18s" }}>
      {!isEditMode && (
        <div onClick={onToggle} style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${checked ? C.p : C.bdr}`, background:checked ? C.p : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.18s", flexShrink:0 }}>
          {checked && <IconCheck color="#fff" size={10} />}
        </div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        {isEditMode ? (
          <input value={item.name} onChange={e => onEdit(e.target.value)} style={{ width:"100%", border:"none", background:"transparent", fontSize:13, color:C.txt, outline:"none", borderBottom:`1px solid ${C.bdr}`, padding:"2px 0" }} />
        ) : (
          <span style={{ fontSize:13, color: checked ? C.p : C.txt, fontWeight: checked ? 600 : 400 }}>{item.name}</span>
        )}
      </div>
      {cta && !isEditMode && (
        <button onClick={e => { e.stopPropagation(); onCtaClick(); }} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:7, border:`1px solid ${C.bdr}`, background:C.wht, color:C.sub, fontSize:10, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
          {cta} <IconExternal size={9} color={C.sub} />
        </button>
      )}
      {isEditMode && (
        <button onClick={onDelete} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, padding:4, display:"flex", alignItems:"center", opacity:0.6 }}>
          <IconTrash size={13} />
        </button>
      )}
    </div>
  );
};

const OnboardingFlow = ({ setPage, onBack, employees }) => {
  const [obs, setObs] = useState(GLOBAL_ONBOARDINGS);
  const [activeId, setActiveId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [hireType, setHireType] = useState("New");
  const [newHire, setNewHire] = useState({ name:"", email:"", role:"" });
  const [existingId, setExistingId] = useState("");
  const [doj, setDoj] = useState("");

  useEffect(() => { GLOBAL_ONBOARDINGS = obs; }, [obs]);

  const handleCreate = () => {
    let name = "", email = "", role = "";
    if (hireType === "New") { name = newHire.name; email = newHire.email; role = newHire.role; }
    else { const e = employees.find(x => x.name === existingId); if (e) { name=e.name; email=e.email; role=e.role; } else { name=existingId; } }
    const ob = { id:"ob"+Date.now(), hireType, name, email, role, doj, checklist: JSON.parse(JSON.stringify(ONBOARD_DEFAULT_STEPS)) };
    setObs([ob,...obs]); setShowNew(false); setActiveId(ob.id);
    setNewHire({name:"",email:"",role:""}); setExistingId(""); setDoj("");
  };

  const toggleTask = (obId, idx) => setObs(obs.map(o => { if(o.id!==obId)return o; const c=[...o.checklist]; c[idx]={...c[idx],status:c[idx].status==="Completed"?"Pending":"Completed"}; return {...o,checklist:c}; }));
  const deleteStep = (obId, idx) => setObs(obs.map(o => o.id!==obId?o:{...o,checklist:o.checklist.filter((_,i)=>i!==idx)}));
  const updateStepName = (obId, idx, val) => setObs(obs.map(o => { if(o.id!==obId)return o; const c=[...o.checklist]; c[idx]={...c[idx],name:val}; return {...o,checklist:c}; }));
  const addStep = (obId) => setObs(obs.map(o => o.id!==obId?o:{...o,checklist:[...o.checklist,{name:"New Milestone",status:"Pending",group:"Custom"}]}));

  if (showNew) return (
    <div style={{ maxWidth:600, margin:"0 auto", width:"100%", animation:"fadeIn 0.3s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <button onClick={()=>setShowNew(false)} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, display:"flex" }}><IconChevronLeft /></button>
        <div><h2 style={{ fontSize:20, fontWeight:700, margin:0, color:C.txt, fontFamily:"Georgia,serif" }}>New Onboarding Journey</h2><p style={{ margin:0, fontSize:13, color:C.sub, marginTop:2 }}>Set up a guided checklist for a new or existing hire.</p></div>
      </div>
      <Card style={{ padding:28 }}>
        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          {[{v:"New",l:"New Hire",s:"External candidate"},{v:"Existing",l:"Internal",s:"Existing employee"}].map(({v,l,s})=>(
            <label key={v} style={{ flex:1, padding:"14px 16px", borderRadius:12, background:hireType===v?`rgba(var(--p-rgb),0.05)`:C.surf, border:`2px solid ${hireType===v?C.p:C.bdr}`, cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}>
              <input type="radio" checked={hireType===v} onChange={()=>setHireType(v)} style={{ accentColor:C.p }} />
              <div><div style={{ fontWeight:700, fontSize:14, color:C.txt }}>{l}</div><div style={{ fontSize:11, color:C.sub }}>{s}</div></div>
            </label>
          ))}
        </div>
        {hireType==="New" ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
            <Inp label="Full Name" value={newHire.name} onChange={e=>setNewHire({...newHire,name:e.target.value})} />
            <Inp label="Email" value={newHire.email} onChange={e=>setNewHire({...newHire,email:e.target.value})} />
            <Inp label="Role / Title" value={newHire.role} onChange={e=>setNewHire({...newHire,role:e.target.value})} />
            <Inp label="Date of Joining" type="date" value={doj} onChange={e=>setDoj(e.target.value)} />
          </div>
        ) : (
          <div style={{ display:"grid", gap:12 }}>
            <Inp label="Select Teammate" value={existingId} onChange={e=>setExistingId(e.target.value)} opts={["Choose...",...employees.map(e=>e.name)]} />
            <Inp label="Start Date" type="date" value={doj} onChange={e=>setDoj(e.target.value)} />
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:24, gap:10 }}>
          <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={handleCreate} disabled={!doj} style={{ padding:"10px 24px" }}>Launch Journey</Btn>
        </div>
      </Card>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );

  if (activeId) {
    const ob = obs.find(o=>o.id===activeId);
    if (!ob) return null;
    const checklist = ob.checklist;
    const done = checklist.filter(c=>c.status==="Completed").length;
    const total = checklist.length;
    const progress = total>0?Math.round((done/total)*100):0;
    const groups = [...new Set(checklist.map(c=>c.group))];
    return (
      <div style={{ maxWidth:820, margin:"0 auto", width:"100%", animation:"fadeIn 0.3s" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
          <button onClick={()=>setActiveId(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, marginTop:4, display:"flex" }}><IconChevronLeft /></button>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${C.p},${C.p2||"#818cf8"})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:800 }}>{ob.name.charAt(0)}</div>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, margin:0, color:C.txt, fontFamily:"Georgia,serif" }}>{ob.name}</h2>
                <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{ob.role} &nbsp;·&nbsp; Joining {ob.doj}</div>
              </div>
            </div>
          </div>
          <button onClick={()=>setIsEditingSteps(!isEditingSteps)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:`1px solid ${isEditingSteps?C.p:C.bdr}`, background:isEditingSteps?`rgba(var(--p-rgb),0.06)`:"transparent", color:isEditingSteps?C.p:C.sub, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
            <IconSettings size={13} color={isEditingSteps?C.p:C.sub} /> {isEditingSteps?"Done Editing":"Manage Steps"}
          </button>
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          <KpiPill label="Completed" value={done} color="#22c55e" />
          <KpiPill label="Remaining" value={total-done} color={C.p} />
          <KpiPill label="Total Steps" value={total} />
          <KpiPill label="Progress" value={`${progress}%`} color={progress===100?"#22c55e":C.p} />
        </div>
        <div style={{ height:6, background:C.surf, borderRadius:99, overflow:"hidden", marginBottom:32, border:`1px solid ${C.bdr}` }}>
          <div style={{ height:"100%", background:progress===100?"#22c55e":`linear-gradient(90deg,${C.p},${C.p2||"#818cf8"})`, width:`${progress}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius:99 }} />
        </div>
        <div style={{ display:"grid", gap:24 }}>
          {groups.map(g=>{
            const items=checklist.filter(c=>c.group===g);
            const gDone=items.filter(c=>c.status==="Completed").length;
            return (
              <section key={g}>
                <PhaseHeader label={g} done={gDone} total={items.length} isEditMode={isEditingSteps} />
                {items.map(item=>{
                  const idx=checklist.indexOf(item);
                  return (
                    <LifecycleRow key={idx} item={item} isEditMode={isEditingSteps}
                      onToggle={()=>toggleTask(ob.id,idx)}
                      onEdit={val=>updateStepName(ob.id,idx,val)}
                      onDelete={()=>deleteStep(ob.id,idx)}
                      cta={(item.name.includes("Offer")||item.name.includes("Appointment"))?"Paperwork Hub":item.name.includes("Salary")?"Paydays":null}
                      onCtaClick={()=>item.name.includes("Salary")?setPage("Paydays"):setPage("Paperwork Hub")}
                    />
                  );
                })}
              </section>
            );
          })}
          {isEditingSteps && (
            <button onClick={()=>addStep(ob.id)} style={{ padding:"14px", borderRadius:10, border:`1px dashed ${C.bdr}`, background:C.surf, color:C.p, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer" }}>
              <IconPlus size={14} color={C.p} /> Add Custom Step
            </button>
          )}
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:820, margin:"0 auto", width:"100%", animation:"fadeIn 0.3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
        <div>
          <h2 style={{ fontSize:26, fontWeight:700, color:C.txt, margin:"0 0 6px", fontFamily:"Georgia,serif" }}>Active Onboardings</h2>
          <p style={{ color:C.sub, fontSize:14, margin:0 }}>Guided journeys for new and transitioning teammates.</p>
        </div>
        <Btn onClick={()=>setShowNew(true)} style={{ padding:"10px 20px", display:"flex", alignItems:"center", gap:8 }}>
          <IconPlus size={14} color="#fff" /> New Onboarding
        </Btn>
      </div>
      {obs.length===0 ? (
        <div style={{ textAlign:"center", padding:"72px 40px", background:C.surf, borderRadius:16, border:`1px dashed ${C.bdr}` }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16, opacity:0.4 }}><IconBox size={44} /></div>
          <h3 style={{ fontSize:16, fontWeight:700, color:C.txt, margin:"0 0 6px" }}>Empty Nest</h3>
          <p style={{ color:C.sub, fontSize:13, margin:0 }}>No active onboardings. Click "New Onboarding" to start.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {obs.map(o=>{
            const d=o.checklist.filter(c=>c.status==="Completed").length;
            const pct=Math.round((d/o.checklist.length)*100);
            return (
              <div key={o.id} onClick={()=>setActiveId(o.id)} style={{ display:"flex", alignItems:"center", gap:18, padding:"18px 22px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}`, cursor:"pointer", transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 20px rgba(var(--p-rgb),0.08)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${C.p},${C.p2||"#818cf8"})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17, fontWeight:800, flexShrink:0 }}>{o.name.charAt(0)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:C.txt }}>{o.name}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:3 }}>{o.role} &nbsp;·&nbsp; Joining {o.doj}</div>
                  <div style={{ marginTop:8, height:4, background:C.surf, borderRadius:99, overflow:"hidden", maxWidth:240 }}>
                    <div style={{ height:"100%", background:pct===100?"#22c55e":`linear-gradient(90deg,${C.p},${C.p2||"#818cf8"})`, width:`${pct}%`, borderRadius:99 }} />
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:18, fontWeight:800, color:pct===100?"#22c55e":C.p }}>{pct}%</div>
                  <div style={{ fontSize:10, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:0.5, marginTop:2 }}>{d}/{o.checklist.length} done</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
};


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
  const fmt = n => n >= 10000000 ? `₹${(n/10000000).toFixed(1)}Cr`
                 : n >= 100000   ? `₹${(n/100000).toFixed(1)}L`
                 : `₹${n.toLocaleString("en-IN")}`;

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
      background:`rgba(var(--p-rgb),0.05)`, border:`1px solid rgba(var(--p-rgb),0.12)`, marginTop:20 }}>
      <span style={{ color:C.p, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:12, color:C.txt, lineHeight:1.5 }}>{text}</span>
    </div>
  );

  const StatCard = ({ label, value, sub, trend, icon, accent }) => (
    <div style={{ padding:"20px 22px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}`,
      display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8 }}>{label}</div>
        <div style={{ color: accent||C.p, opacity:0.7 }}>{icon}</div>
      </div>
      <div style={{ fontSize:26, fontWeight:800, color: accent||C.txt, letterSpacing:"-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.sub }}>{sub}</div>}
      {trend !== undefined && <Chip up={trend >= 0} label={`${trend >= 0 ? "+" : ""}${trend} this month`} />}
    </div>
  );

  const SectionBtn = ({ id, label }) => (
    <button onClick={() => setActiveSection(id)} style={{
      padding:"7px 16px", borderRadius:8, border:`1px solid ${activeSection===id ? C.p : C.bdr}`,
      background: activeSection===id ? `rgba(var(--p-rgb),0.08)` : "transparent",
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
          <div style={{ height:6, width:`${pct}%`, background: color||C.p, borderRadius:99, transition:"width 0.5s" }}/>
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
          padding:"5px 14px", borderRadius:999, background:C.surf, border:`1px solid ${C.bdr}`,
          fontSize:11, fontWeight:700, letterSpacing:1, color:C.p, textTransform:"uppercase" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Executive View
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:30, color:C.txt, margin:"0 0 8px", fontWeight:700, letterSpacing:"-0.02em" }}>Reports & Analytics</h1>
        <p style={{ color:C.sub, fontSize:14, margin:0, lineHeight:1.6 }}>Workforce intelligence for leadership decisions. Updated in real-time.</p>
      </div>

      {/* ── Section tabs ── */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28, paddingBottom:20, borderBottom:`1px solid ${C.bdr}` }}>
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

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:18 }}>Department Breakdown</div>
            {deptList.slice(0,6).map(([d,n]) => <MiniBar key={d} label={d} value={n} max={totalEmp} />)}
          </div>

          <InsightBar icon={<IconAlert/>}
            text={netGrowth > 0
              ? `Team is growing steadily — ${newHires} new hire${newHires!==1?"s":""} joined this month.`
              : exits > newHires
              ? `Exits (${exits}) currently outpacing new hires (${newHires}) — review talent pipeline.`
              : "Workforce is stable. No significant changes this month."} />
        </SectionWrap>
      )}

      {/* ══ ATTRITION & RETENTION ═══════════════════════════════════════ */}
      {activeSection === "attrition" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
            <StatCard label="Attrition Rate" value={`${attritionRate}%`} icon={<IconTrend/>} sub="Based on exits this month" accent={parseFloat(attritionRate)>10?"#dc2626":C.p} />
            <StatCard label="Total Exits" value={offboardingItems.length} icon={<IconUsers/>} sub="All time in system" />
            <StatCard label="Completed" value={offboardingItems.filter(o=>o.progress===100).length} icon={<IconTrend/>} sub="Fully offboarded" accent="#16a34a" />
            <StatCard label="In Progress" value={offboardingItems.filter(o=>o.progress<100).length} icon={<IconAlert/>} sub="Pending clearance" accent="#f59e0b" />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:.8, marginBottom:18 }}>Exit Reasons</div>
            {["Resignation","Contract End","Retirement","Termination"].map(reason => {
              const count = offboardingItems.filter(o => o.reason === reason).length;
              return <MiniBar key={reason} label={reason} value={count} max={Math.max(offboardingItems.length,1)} />;
            })}
            {offboardingItems.length === 0 && <div style={{ color:C.sub, fontSize:13 }}>No exit data yet.</div>}
          </div>

          <InsightBar icon={<IconAlert/>}
            text={parseFloat(attritionRate) > 10
              ? `Attrition rate (${attritionRate}%) is above healthy threshold (10%) — immediate retention action recommended.`
              : `Attrition is within healthy range at ${attritionRate}%. Continue monitoring exit reasons for trends.`} />
        </SectionWrap>
      )}

      {/* ══ LEAVE INSIGHTS ══════════════════════════════════════════════ */}
      {activeSection === "leaves" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            <StatCard label="Total Leaves Taken" value={totalLeaves} icon={<IconLeaf/>} sub="Approved leave records" />
            <StatCard label="Pending Approvals" value={leaves.filter(l=>l.status==="pending").length} icon={<IconAlert/>} sub="Awaiting decision" accent="#f59e0b" />
            <StatCard label="Top Leave Type" value={topLeaveType?.[0]||"—"} icon={<IconLeaf/>} sub={topLeaveType ? `${topLeaveType[1]} requests` : "No data"} />
            <StatCard label="Unique Requesters" value={[...new Set(approvedLeaves.map(l=>l.empId))].length} icon={<IconUsers/>} sub="Employees who took leave" />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}` }}>
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
              ? `High leave utilisation detected (${totalLeaves} approved). Review team coverage and workload distribution.`
              : leaves.filter(l=>l.status==="pending").length > 5
              ? `${leaves.filter(l=>l.status==="pending").length} leave requests awaiting approval — action recommended.`
              : `Leave patterns appear healthy. Most common type: ${topLeaveType?.[0]||"N/A"}.`} />
        </SectionWrap>
      )}

      {/* ══ PAYROLL OVERVIEW ════════════════════════════════════════════ */}
      {activeSection === "payroll" && (
        <SectionWrap>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            <StatCard label="Monthly Payroll" value={monthlyPayroll > 0 ? fmt(monthlyPayroll) : "—"} icon={<IconReward/>} sub={`${new Date().toLocaleString("en-IN",{month:"long"})} ${thisYear}`} accent={C.p} />
            <StatCard label="Average Salary" value={avgSalary > 0 ? fmt(avgSalary) : "—"} icon={<IconReward/>} sub="Per employee / month" />
            <StatCard label="Employees on Payroll" value={saPayslips.filter(p=>p.monthIndex===thisMonth).length} icon={<IconUsers/>} sub="With payslips this month" />
            <StatCard label="Payslips Generated" value={saPayslips.length} icon={<IconGrid/>} sub="All time" />
          </div>

          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}` }}>
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
              ? `Monthly payroll stands at ${fmt(monthlyPayroll)}. Average per employee: ${fmt(avgSalary)}.`
              : "Run payroll for this month to see payroll analytics."} />
        </SectionWrap>
      )}

      {/* ══ TEAM VIEW ═══════════════════════════════════════════════════ */}
      {activeSection === "teams" && (
        <SectionWrap>
          <div style={{ padding:"24px 26px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}` }}>
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
                    padding:"12px", borderRadius:8, marginBottom:4, border:`1px solid ${C.bdr}`,
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
              ? `Largest team: ${deptList[0][0]} (${deptList[0][1]} people). Monitor teams with exit activity for retention signals.`
              : "Add employees to departments to see team-level insights."} />
        </SectionWrap>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
};

const OffboardingFlow = ({ onBack, offboardingItems, setOffboardingItems, isAdmin, setPage, employees, papers, setPapers, addNotif, toast }) => {
  const [activeId, setActiveId] = useState(null);
  const [showInitiate, setShowInitiate] = useState(false);
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [form, setForm] = useState({ empId:"", reason:"Resignation", lastDate:"" });

  const toggleOffboardTask = (itemId, idx) => {
    setOffboardingItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const c = [...item.checklist];
      c[idx] = { ...c[idx], status: c[idx].status === "Completed" ? "Pending" : "Completed" };
      const done = c.filter(x => x.status === "Completed").length;
      return { ...item, checklist: c, progress: Math.round((done / c.length) * 100) };
    }));
  };

  const addOffboardStep = (itemId) => setOffboardingItems(prev => prev.map(item => item.id !== itemId ? item : { ...item, checklist: [...item.checklist, { name: "New Step", status: "Pending", group: "Phase 4: Closure" }] }));
  const deleteOffboardStep = (itemId, idx) => setOffboardingItems(prev => prev.map(item => item.id !== itemId ? item : { ...item, checklist: item.checklist.filter((_,i) => i !== idx) }));
  const updateOffboardStepName = (itemId, idx, val) => setOffboardingItems(prev => prev.map(item => { if (item.id !== itemId) return item; const c=[...item.checklist]; c[idx]={...c[idx],name:val}; return {...item,checklist:c}; }));
  const updateOffboardMeta = (itemId, field, value) => setOffboardingItems(prev => prev.map(item => item.id === itemId ? { ...item, [field]: value } : item));

  const handleStart = () => {
    if (!form.empId || form.empId === "Pick person..." || !form.lastDate) return toast("Select teammate & last date");
    const emp = employees.find(e => e.id === Number(form.empId));
    const newItem = {
      id: Date.now(), empId: Number(form.empId),
      name: emp?.name || "Unknown", reason: form.reason,
      status: "In Progress", progress: 0,
      lastAction: `Last Working Day: ${form.lastDate}`,
      checklist: JSON.parse(JSON.stringify(OFFBOARD_DEFAULT_STEPS))
    };
    setOffboardingItems([newItem, ...offboardingItems]);
    if (papers && setPapers) {
      const doc = { id: Date.now()+1, name: `${form.reason} Docket - ${emp?.name}`, empId: Number(form.empId), type: "Other", status: "Generated", date: new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}), url: "#" };
      setPapers([doc, ...papers]);
    }
    setShowInitiate(false);
    setForm({ empId:"", reason:"Resignation", lastDate:"" });
    toast(`Exit journey started for ${emp?.name}`);
    if (addNotif) addNotif({ title:"Exit Journey Started", body:`${emp?.name}'s offboarding has been initiated.`, icon:"→" });
  };

  if (activeId) {
    const item = offboardingItems.find(o => o.id === activeId);
    if (!item) return null;
    const checklist = item.checklist;
    const done = checklist.filter(c => c.status === "Completed").length;
    const total = checklist.length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    const groups = [...new Set(checklist.map(c => c.group || "General"))];

    return (
      <div style={{ maxWidth:820, margin:"0 auto", width:"100%", animation:"fadeIn 0.3s" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
          <button onClick={() => setActiveId(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, marginTop:4, display:"flex" }}><IconChevronLeft /></button>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${C.p},${C.p2||"#818cf8"})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:800 }}>{item.name.charAt(0)}</div>
              <div>
                <h2 style={{ fontSize:20, fontWeight:700, margin:0, color:C.txt, fontFamily:"Georgia,serif" }}>{item.name}</h2>
                <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{item.reason || "Exit"} &nbsp;�&nbsp; {item.lastAction}</div>
              </div>
            </div>
          </div>
          <button onClick={() => setIsEditingSteps(!isEditingSteps)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:10, border:`1px solid ${isEditingSteps ? C.p : C.bdr}`, background: isEditingSteps ? `rgba(var(--p-rgb),0.06)` : "transparent", color: isEditingSteps ? C.p : C.sub, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
            <IconSettings size={13} color={isEditingSteps ? C.p : C.sub} /> {isEditingSteps ? "Done Editing" : "Manage Steps"}
          </button>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          <KpiPill label="Completed" value={done} color="#22c55e" />
          <KpiPill label="Remaining" value={total - done} color={C.p} />
          <KpiPill label="Total Steps" value={total} />
          <KpiPill label="Progress" value={`${progress}%`} color={progress === 100 ? "#22c55e" : C.p} />
        </div>

        <div style={{ height:6, background:C.surf, borderRadius:99, overflow:"hidden", marginBottom:24, border:`1px solid ${C.bdr}` }}>
          <div style={{ height:"100%", background: progress === 100 ? "#22c55e" : `linear-gradient(90deg,${C.p},${C.p2||"#818cf8"})`, width:`${progress}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius:99 }} />
        </div>

        <div style={{ display:"flex", gap:12, marginBottom:28 }}>
          <div style={{ flex:1, padding:"12px 16px", borderRadius:10, background:C.surf, border:`1px solid ${C.bdr}` }}>
            <label style={{ fontSize:9, fontWeight:800, color:C.sub, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Notice Length (Days)</label>
            <input type="number" value={item.noticeLength||""} onChange={e=>updateOffboardMeta(item.id,'noticeLength',e.target.value)} placeholder="e.g. 30" style={{ width:"100%", border:"none", background:"transparent", fontSize:14, fontWeight:700, color:C.txt, outline:"none" }} />
          </div>
          <div style={{ flex:1, padding:"12px 16px", borderRadius:10, background:C.surf, border:`1px solid ${C.bdr}` }}>
            <label style={{ fontSize:9, fontWeight:800, color:C.sub, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Notice End Date</label>
            <input type="date" value={item.noticeEnd||""} onChange={e=>updateOffboardMeta(item.id,'noticeEnd',e.target.value)} style={{ width:"100%", border:"none", background:"transparent", fontSize:14, fontWeight:700, color:C.txt, outline:"none" }} />
          </div>
          <div style={{ flex:1, padding:"12px 16px", borderRadius:10, background:`rgba(var(--p-rgb),0.04)`, border:`1px dashed ${C.p}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div><div style={{ fontSize:9, fontWeight:800, color:C.p, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>Exit Documents</div><div style={{ fontSize:11, color:C.sub }}>Docket auto-generated</div></div>
            <button onClick={()=>setPage("Paperwork Hub")} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:7, border:`1px solid ${C.bdr}`, background:C.wht, color:C.sub, fontSize:10, fontWeight:700, cursor:"pointer" }}>View <IconExternal size={9} color={C.sub} /></button>
          </div>
        </div>

        <div style={{ display:"grid", gap:24 }}>
          {groups.map(g => {
            const items = checklist.filter(c => (c.group||"General") === g);
            const gDone = items.filter(c => c.status === "Completed").length;
            return (
              <section key={g}>
                <PhaseHeader label={g} done={gDone} total={items.length} isEditMode={isEditingSteps} />
                {items.map(c => {
                  const idx = checklist.indexOf(c);
                  return (
                    <LifecycleRow key={idx} item={c} isEditMode={isEditingSteps}
                      onToggle={() => toggleOffboardTask(item.id, idx)}
                      onEdit={val => updateOffboardStepName(item.id, idx, val)}
                      onDelete={() => deleteOffboardStep(item.id, idx)}
                      cta={(c.name.toLowerCase().includes("email") || c.name.toLowerCase().includes("documents")) ? "Paperwork Hub" : null}
                      onCtaClick={() => setPage("Paperwork Hub")}
                    />
                  );
                })}
              </section>
            );
          })}
          {isEditingSteps && (
            <button onClick={() => addOffboardStep(item.id)} style={{ padding:"14px", borderRadius:10, border:`1px dashed ${C.bdr}`, background:C.surf, color:C.p, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer" }}>
              <IconPlus size={14} color={C.p} /> Add Custom Step
            </button>
          )}
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:820, margin:"0 auto", width:"100%", animation:"fadeIn 0.3s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
        <div>
          <h2 style={{ fontSize:26, fontWeight:700, color:C.txt, margin:"0 0 6px", fontFamily:"Georgia,serif" }}>Active Offboardings</h2>
          <p style={{ color:C.sub, fontSize:14, margin:0 }}>Managing teammates moving to their next chapter.</p>
        </div>
        <Btn onClick={() => setShowInitiate(true)} style={{ padding:"10px 20px", display:"flex", alignItems:"center", gap:8 }}>
          <IconPlus size={14} color="#fff" /> Initiate Transition
        </Btn>
      </div>

      {offboardingItems.length === 0 ? (
        <div style={{ textAlign:"center", padding:"72px 40px", background:C.surf, borderRadius:16, border:`1px dashed ${C.bdr}` }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16, opacity:0.4 }}><IconBox size={44} /></div>
          <h3 style={{ fontSize:16, fontWeight:700, color:C.txt, margin:"0 0 6px" }}>Cloudless Sky</h3>
          <p style={{ color:C.sub, fontSize:13, margin:0 }}>No active offboardings. Use 'Initiate Transition' to begin.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {offboardingItems.map(o => {
            const pct = o.progress || 0;
            return (
              <div key={o.id} onClick={() => setActiveId(o.id)} style={{ display:"flex", alignItems:"center", gap:18, padding:"18px 22px", borderRadius:14, background:C.wht, border:`1px solid ${C.bdr}`, cursor:"pointer", transition:"all 0.18s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 20px rgba(var(--p-rgb),0.08)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${C.p},${C.p2||"#818cf8"})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17, fontWeight:800, flexShrink:0 }}>{o.name.charAt(0)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:C.txt }}>{o.name}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:3 }}>{o.reason || "Exit"} &nbsp;�&nbsp; {o.lastAction}</div>
                  <div style={{ marginTop:8, height:4, background:C.surf, borderRadius:99, overflow:"hidden", maxWidth:240 }}>
                    <div style={{ height:"100%", background: pct===100 ? "#22c55e" : `linear-gradient(90deg,${C.p},${C.p2||"#818cf8"})`, width:`${pct}%`, borderRadius:99 }} />
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:18, fontWeight:800, color: pct===100 ? "#22c55e" : C.p }}>{pct}%</div>
                  <div style={{ fontSize:10, fontWeight:700, color:C.sub, textTransform:"uppercase", letterSpacing:0.5, marginTop:2 }}>{o.checklist?.filter(c=>c.status==="Completed").length||0}/{o.checklist?.length||0} done</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showInitiate && (
        <Modal title="Initiate Transition" onClose={() => setShowInitiate(false)} width={460}>
          <p style={{ fontSize:13, color:C.sub, lineHeight:1.6, margin:"0 0 20px" }}>Starting an exit journey creates a phase-grouped checklist and generates an official exit docket in the Paperwork Hub.</p>
          <div style={{ display:"grid", gap:12 }}>
            <Inp label="Teammate" value={form.empId} onChange={e=>setForm({...form,empId:e.target.value})} opts={["Pick person...", ...employees.map(e=>({label:e.name,value:String(e.id)}))]} />
            <Inp label="Separation Reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} opts={["Resignation","Termination","Contract End","Retirement"]} />
            <Inp label="Last Working Date" type="date" value={form.lastDate} onChange={e=>setForm({...form,lastDate:e.target.value})} />
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:12, marginTop:24, paddingTop:20, borderTop:`1px solid ${C.surf}` }}>
            <Btn variant="ghost" onClick={()=>setShowInitiate(false)}>Cancel</Btn>
            <Btn onClick={handleStart} style={{ padding:"10px 24px" }}>Start Journey</Btn>
          </div>
        </Modal>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );


};


const PayrollWizardModal = ({ 
  onClose, saPayslips, setSaPayslips, employees, processedPayments, setProcessedPayments, 
  editedSalaries, setPaymentLogs, toast, parseInr, C, MONTHS_SHORT 
}) => {
  const currentYear = new Date().getFullYear();
  const [step, setStep] = useState(1);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive data
  const empStates = employees.map(emp => {
    const existingPayslip = saPayslips.find(p => p.empId === emp.id && p.monthIndex === selectedMonthIndex && parseInt(p.year) === currentYear);
    const pId = existingPayslip ? existingPayslip.id : `new_pay_${emp.id}_${selectedMonthIndex}`;
    const netFallback = emp.ctc ? `₹${Math.round(parseInt(emp.ctc.replace(/\D/g,'')) / 12).toLocaleString("en-IN")}` : "₹50,000";
    const p = existingPayslip || { id: pId, empId: emp.id, name: emp.name, net: netFallback };
    const hasBank = !!emp.bankInfo?.acc && !!emp.bankInfo?.ifsc;
    const isPaid = !!processedPayments[pId];
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
      const newGlobalPayslips = [];
      selectedIds.forEach(id => {
        newProcessed[id] = true;
        const pState = validUnpaid.find(x => x.p.id === id);
        if (pState) {
           totalAmt += parseInr(editedSalaries[id] || pState.p.net);
           if (!saPayslips.find(x => x.id === id)) {
              newGlobalPayslips.push({
                 id: id, empId: pState.emp.id, ini: pState.emp.ini, name: pState.emp.name, dept: pState.emp.dept,
                 year: currentYear.toString(), month: selectedMonthIndex, monthIndex: selectedMonthIndex,
                 monthLabel: `${MONTHS_SHORT[selectedMonthIndex]} ${currentYear}`,
                 credited: new Date().toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"}),
                 gross: `₹${Math.round((parseInt(pState.p.net.replace(/\D/g,'')) || 50000) * 1.38).toLocaleString("en-IN")}`,
                 net: pState.p.net, status: "Unpaid"
              });
           }
        }
      });
      if (newGlobalPayslips.length > 0) setSaPayslips(prev => [...prev, ...newGlobalPayslips]);
      setProcessedPayments(newProcessed);
      setPaymentLogs(prev => [{
        ts: new Date().toLocaleString("en-IN"), actor: "Super Admin",
        monthYear: `${MONTHS_SHORT[selectedMonthIndex]} ${currentYear}`,
        amount: `₹${totalAmt.toLocaleString("en-IN")}`, count: selectedIds.length
      }, ...prev]);
      setIsProcessing(false);
      setStep(4);
    }, 2000);
  };

  if (step === 1) {
    return (
      <Modal title="Start Payroll" onClose={onClose} width={420}>
        <div style={{ padding: "8px 0" }}>
          <p style={{ color:C.sub, fontSize:14, marginBottom:24, lineHeight:1.5 }}>Initialize payroll processing for the selected month.</p>
          
          <div style={{ background:C.surf, padding:20, borderRadius:16, border:`1px solid ${C.bdr}` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:10 }}>SELECT PERIOD</div>
            <div style={{ position:"relative" }}>
              <select 
                value={selectedMonthIndex} 
                onChange={e => setSelectedMonthIndex(Number(e.target.value))}
                style={{ 
                  width:"100%", padding:"14px 16px", borderRadius:12, border:`1px solid ${C.bdr}`, 
                  background:C.wht, fontSize:15, fontWeight:600, color:C.txt, outline:"none",
                  cursor:"pointer", appearance:"none"
                }}
              >
                {MONTHS_SHORT.map((m, i) => (
                  <option key={m} value={i}>{m} {currentYear}</option>
                ))}
              </select>
              <div style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:C.sub }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:32, gap:12 }}>
             <Btn variant="ghost" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
             <Btn onClick={handleProceedToStep2} style={{ flex:2, padding:"12px", background:C.p, color:"#fff", fontSize:14 }}>Continue to Review</Btn>
          </div>
        </div>
      </Modal>
    );
  }

  if (step === 2) {
    return (
      <Modal title={`Payroll Review: ${MONTHS_SHORT[selectedMonthIndex]} ${currentYear}`} onClose={onClose} width={760}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.txt, margin:0, fontFamily:"Georgia,serif" }}>Employee Selection</h3>
            <p style={{ fontSize:12, color:C.sub, margin:"4px 0 0" }}>{validUnpaid.length} employees eligible for payment</p>
          </div>
          {validUnpaid.length > 0 && (
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"8px 12px", background:C.surf, borderRadius:10, border:`1px solid ${C.bdr}`, fontSize:13, fontWeight:600, color:C.txt }}>
              <input 
                type="checkbox" 
                checked={selectedIds.length === validUnpaid.length} 
                onChange={e => setSelectedIds(e.target.checked ? validUnpaid.map(x => x.p.id) : [])}
                style={{ accentColor:C.p, width:16, height:16 }}
              />
              Select All
            </label>
          )}
        </div>
        
        <div style={{ maxHeight: 400, overflowY:"auto", borderRadius:14, border:`1px solid ${C.bdr}`, background:C.wht, boxShadow:"0 4px 20px rgba(0,0,0,0.03)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", textAlign:"left" }}>
             <thead style={{ position:"sticky", top:0, background:C.surf, zIndex:10, borderBottom:`1px solid ${C.bdr}` }}>
                <tr>
                   <th style={{ padding:"14px 16px", width:40 }}></th>
                   <th style={{ padding:"14px 16px", color:C.sub, fontSize:10, fontWeight:700, letterSpacing:1 }}>EMPLOYEE</th>
                   <th style={{ padding:"14px 16px", color:C.sub, fontSize:10, fontWeight:700, letterSpacing:1 }}>DEPARTMENT</th>
                   <th style={{ padding:"14px 16px", textAlign:"right", color:C.sub, fontSize:10, fontWeight:700, letterSpacing:1 }}>NET PAYABLE</th>
                </tr>
             </thead>
             <tbody>
                {validUnpaid.map(({ p, emp }) => (
                  <tr key={p.id} style={{ borderBottom:`1px solid ${C.surf}`, transition:"background .2s" }} onMouseEnter={e=>e.currentTarget.style.background=`rgba(var(--p-rgb),.02)`} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                     <td style={{ padding:"14px 16px", textAlign:"center" }}>
                        <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} style={{ accentColor:C.p, width:16, height:16 }} />
                     </td>
                     <td style={{ padding:"14px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <Av ini={emp.ini} sz={28} />
                          <span style={{ fontWeight:600, color:C.txt, fontSize:13 }}>{p.name}</span>
                        </div>
                     </td>
                     <td style={{ padding:"14px 16px", color:C.sub, fontSize:13 }}>{emp.dept || "—"}</td>
                     <td style={{ padding:"14px 16px", textAlign:"right", fontWeight:800, color:C.p, fontSize:14, fontFamily:"'JetBrains Mono', 'Roboto Mono', monospace" }}>{editedSalaries[p.id] || p.net}</td>
                  </tr>
                ))}
                {validUnpaid.length === 0 && (
                  <tr><td colSpan={4} style={{ padding:"60px 20px", textAlign:"center", color:C.sub, fontSize:14 }}>No eligible unpaid employees found for this period.</td></tr>
                )}
             </tbody>
          </table>
        </div>

        {(missingBank.length > 0 || alreadyPaid.length > 0) && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:24 }}>
            {missingBank.length > 0 && (
              <div style={{ background:"#fff5f5", borderRadius:12, border:"1px solid #fee2e2", padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span style={{ fontSize:11, fontWeight:800, color:"#991b1b", letterSpacing:.5 }}>MISSING BANK DETAILS ({missingBank.length})</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {missingBank.map(x => (
                    <span key={x.emp.id} style={{ fontSize:10, fontWeight:600, color:"#b91c1c", background:"rgba(220,38,38,.08)", padding:"3px 8px", borderRadius:6 }}>{x.emp.name}</span>
                  ))}
                </div>
              </div>
            )}
            {alreadyPaid.length > 0 && (
              <div style={{ background:"#f0fdf4", borderRadius:12, border:"1px solid #dcfce7", padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize:11, fontWeight:800, color:"#166534", letterSpacing:.5 }}>ALREADY PAID ({alreadyPaid.length})</span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {alreadyPaid.map(x => (
                    <span key={x.emp.id} style={{ fontSize:10, fontWeight:600, color:"#15803d", background:"rgba(22,163,74,.08)", padding:"3px 8px", borderRadius:6 }}>{x.emp.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:32, paddingTop:24, borderTop:`1px solid ${C.bdr}` }}>
           <Btn variant="ghost" onClick={() => setStep(1)}>← Change Month</Btn>
           <div style={{ display:"flex", gap:12 }}>
             <Btn variant="outline" onClick={onClose}>Cancel</Btn>
             <Btn style={{ padding:"12px 28px", background:C.p, color:"#fff", fontSize:14, boxShadow:`0 4px 12px rgba(var(--p-rgb),.3)` }} disabled={selectedIds.length === 0} onClick={() => setStep(3)}>Proceed to Summary</Btn>
           </div>
        </div>
      </Modal>
    );
  }

  if (step === 3) {
    const totalAmt = selectedIds.reduce((acc, id) => acc + parseInr(editedSalaries[id] || validUnpaid.find(x => x.p.id === id)?.p.net || "0"), 0);
    return (
      <Modal title="Payment Authorization" onClose={onClose} width={500}>
        <div style={{ textAlign:"center", padding:"10px 0 20px" }}>
           <div style={{ width:64, height:64, borderRadius:20, background:C.surf, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", color:C.p }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01"/><path d="M11 15h2"/></svg>
           </div>
           <h2 style={{ fontSize:24, fontWeight:700, color:C.txt, margin:"0 0 12px", fontFamily:"Georgia,serif" }}>Confirm Payroll Release</h2>
           <p style={{ fontSize:14, color:C.sub, margin:"0 0 32px", lineHeight:1.6, padding:"0 20px" }}>
             You are about to authorize payments for <strong style={{ color:C.txt }}>{selectedIds.length} employees</strong> for the <strong style={{ color:C.txt }}>{MONTHS_SHORT[selectedMonthIndex]} {currentYear}</strong> cycle.
           </p>
           
           <div style={{ background:C.dk, padding:32, borderRadius:24, marginBottom:32, position:"relative", overflow:"hidden" }}>
             <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:C.p }} />
             <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.5)", letterSpacing:1.5, marginBottom:12 }}>TOTAL DISBURSEMENT</div>
             <div style={{ fontSize:42, fontWeight:800, color:"#fff", fontFamily:"system-ui" }}>₹{totalAmt.toLocaleString("en-IN")}</div>
             <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:12 }}>Secure transfer via Institutional Gateway</div>
           </div>

           <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
             <Btn 
               onClick={handlePay} 
               disabled={isProcessing}
               style={{ 
                 width:"100%", padding:"18px", fontSize:16, fontWeight:700,
                 background: isProcessing ? C.sub : C.p, color:"#fff", border:"none", borderRadius:16, 
                 display:"flex", alignItems:"center", justifyContent:"center", gap:12, transition:"all 0.2s",
                 boxShadow: isProcessing ? "none" : `0 10px 24px rgba(var(--p-rgb),.3)`
               }}
             >
               {isProcessing ? (
                 <>
                   <svg style={{ animation:"spin 1s linear infinite" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                   Processing...
                 </>
               ) : "Authorize & Disburse Batch"}
             </Btn>
             <Btn variant="ghost" onClick={() => setStep(2)} style={{ width:"100%", padding:"14px", color:C.sub }}>Go Back</Btn>
           </div>
        </div>
      </Modal>
    );
  }

  if (step === 4) {
    return (
      <Modal title="Success" onClose={onClose} width={420}>
         <div style={{ textAlign:"center", padding:"40px 20px 30px" }}>
            <div style={{ width:80, height:80, borderRadius:99, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", color:"#22c55e" }}>
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize:24, fontWeight:700, color:C.txt, margin:"0 0 12px", fontFamily:"Georgia,serif" }}>Execution Complete</h2>
            <p style={{ fontSize:15, color:C.sub, margin:"0 0 32px", lineHeight:1.6 }}>
              The payroll batch for {selectedIds.length} employees has been successfully transmitted to the gateway.
            </p>
            <Btn style={{ width:"100%", padding:"16px", fontSize:15, fontWeight:700, background:C.txt, color:"#fff", borderRadius:14 }} onClick={() => { toast("Payroll successfully completed!"); onClose(); }}>Return to Dashboard</Btn>
         </div>
      </Modal>
    );
  }
  return null;
};


const ReleasePayslipsModal = ({ onClose, saPayslips, setSaPayslips, employees, toast, parseInr, C, MONTHS_SHORT }) => {
  const [step, setStep] = useState(1);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonth);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editedDays, setEditedDays] = useState({});

  const totalDaysInMonth = new Date(currentYear, selectedMonthIndex + 1, 0).getDate();

  const targetEmployees = employees.filter(e => e.status !== "inactive");
  const rowData = targetEmployees.map(emp => {
    const existingPayslip = saPayslips.find(p => p.empId === emp.id && p.monthIndex === selectedMonthIndex && parseInt(p.year) === currentYear);
    const pId = existingPayslip ? existingPayslip.id : `new_pay_${emp.id}_${selectedMonthIndex}`;
    const netFallback = emp.ctc ? `₹${Math.round(parseInt(emp.ctc.replace(/\D/g,'')) / 12).toLocaleString("en-IN")}` : "₹50,000";
    
    const p = existingPayslip || { id: pId, empId: emp.id, name: emp.name, net: netFallback, released: false };
    const isReleased = !!p.released;
    const daysWorked = editedDays[pId] !== undefined ? editedDays[pId] : totalDaysInMonth;
    const baseNet = parseInr(p.net);
    const calculatedNet = Math.round((baseNet / totalDaysInMonth) * daysWorked);
    const calcNetStr = `₹${calculatedNet.toLocaleString("en-IN")}`;

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
        if (!saPayslips.find(x => x.id === id)) {
           newGlobalPayslips.push({
              id: id, empId: pState.emp.id, ini: pState.emp.ini, name: pState.emp.name, dept: pState.emp.dept,
              year: currentYear.toString(), month: selectedMonthIndex, monthIndex: selectedMonthIndex,
              monthLabel: `${MONTHS_SHORT[selectedMonthIndex]} ${currentYear}`,
              credited: new Date().toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"}),
              gross: `₹${Math.round((parseInr(pState.p.net) || 50000) * 1.38).toLocaleString("en-IN")}`,
              net: pState.calcNetStr, workedDays: pState.daysWorked, released: true, status: "Unpaid"
           });
        }
      }
    });

    const updatedGlobal = saPayslips.map(ps => {
       if (selectedIds.includes(ps.id)) {
           const match = validUnreleased.find(x => x.p.id === ps.id);
           return { ...ps, released: true, net: match.calcNetStr, workedDays: match.daysWorked };
       }
       return ps;
    });

    setSaPayslips([...updatedGlobal, ...newGlobalPayslips]);
    toast(`Successfully released payslips for ${count} employees!`);
    onClose();
  };

  if (step === 1) {
    return (
      <Modal title="Release Payslips" onClose={onClose} width={420}>
        <div style={{ padding: "8px 0" }}>
          <p style={{ color:C.sub, fontSize:14, marginBottom:24, lineHeight:1.5 }}>Select the payroll period to release payslips for employees.</p>
          
          <div style={{ background:C.surf, padding:20, borderRadius:16, border:`1px solid ${C.bdr}` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:10 }}>SELECT PERIOD</div>
            <div style={{ position:"relative" }}>
              <select 
                value={selectedMonthIndex} 
                onChange={e => setSelectedMonthIndex(Number(e.target.value))}
                style={{ 
                  width:"100%", padding:"14px 16px", borderRadius:12, border:`1px solid ${C.bdr}`, 
                  background:C.wht, fontSize:15, fontWeight:600, color:C.txt, outline:"none",
                  cursor:"pointer", appearance:"none"
                }}
              >
                {MONTHS_SHORT.map((m, i) => (
                  <option key={i} value={i}>{m} {currentYear}</option>
                ))}
              </select>
              <div style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:C.sub }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:32, gap:12 }}>
             <Btn variant="ghost" onClick={onClose} style={{ flex:1 }}>Cancel</Btn>
             <Btn onClick={() => setStep(2)} style={{ flex:2, padding:"12px", background:C.p, color:"#fff", fontSize:14 }}>Proceed to Adjustments</Btn>
          </div>
        </div>
      </Modal>
    );
  }

  if (step === 2) {
    const isAllSelected = validUnreleased.length > 0 && selectedIds.length === validUnreleased.length;
    return (
      <Modal title={`Adjust Days: ${MONTHS_SHORT[selectedMonthIndex]} ${currentYear}`} onClose={onClose} width={760}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.txt, margin:0, fontFamily:"Georgia,serif" }}>Release Selection</h3>
            <p style={{ fontSize:12, color:C.sub, margin:"4px 0 0" }}>{totalDaysInMonth} total days in {MONTHS_SHORT[selectedMonthIndex]}</p>
          </div>
          {validUnreleased.length > 0 && (
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"8px 12px", background:C.surf, borderRadius:10, border:`1px solid ${C.bdr}`, fontSize:13, fontWeight:600, color:C.txt }}>
              <input 
                type="checkbox" 
                checked={isAllSelected} 
                onChange={e => setSelectedIds(e.target.checked ? validUnreleased.map(x=>x.p.id) : [])}
                style={{ accentColor:C.p, width:16, height:16 }}
              />
              Select All
            </label>
          )}
        </div>
        
        {validUnreleased.length === 0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center", color:C.sub, background:C.surf, borderRadius:16, border:`1px dashed ${C.bdr}` }}>
            No eligible unreleased payslips found for this period.
          </div>
        ) : (
          <div style={{ maxHeight:400, overflowY:"auto", borderRadius:14, border:`1px solid ${C.bdr}`, background:C.wht, boxShadow:"0 4px 20px rgba(0,0,0,0.03)" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", textAlign:"left" }}>
              <thead style={{ position:"sticky", top:0, background:C.surf, zIndex:10, borderBottom:`1px solid ${C.bdr}` }}>
                <tr>
                   <th style={{ padding:"14px 16px", width:40 }}></th>
                   <th style={{ padding:"14px 16px", color:C.sub, fontSize:10, fontWeight:700, letterSpacing:1 }}>EMPLOYEE</th>
                   <th style={{ padding:"14px 16px", textAlign:"center", color:C.sub, fontSize:10, fontWeight:700, letterSpacing:1 }}>WORKED DAYS</th>
                   <th style={{ padding:"14px 16px", textAlign:"right", color:C.sub, fontSize:10, fontWeight:700, letterSpacing:1 }}>FINAL NET</th>
                </tr>
              </thead>
              <tbody>
                {validUnreleased.map(({ p, emp, daysWorked, calcNetStr, pId }) => (
                  <tr key={pId} style={{ borderBottom:`1px solid ${C.surf}`, transition:"background .2s" }} onMouseEnter={e=>e.currentTarget.style.background=`rgba(var(--p-rgb),.02)`} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    <td style={{ padding:"14px 16px", textAlign:"center" }}>
                        <input type="checkbox" checked={selectedIds.includes(pId)} onChange={() => toggleSelect(pId)} style={{ accentColor:C.p, width:16, height:16 }} />
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                       <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                         <Av ini={emp.ini} sz={28} />
                         <span style={{ fontWeight:600, color:C.txt, fontSize:13 }}>{emp.name}</span>
                       </div>
                    </td>
                    <td style={{ padding:"14px 16px", textAlign:"center" }}>
                        <div style={{ display:"inline-flex", alignItems:"center", background:C.surf, padding:"6px 16px", borderRadius:10, border:`1px solid ${C.bdr}`, minWidth:100, justifyContent:"space-between" }}>
                          <input 
                             type="number" 
                             value={daysWorked} 
                             min={0} max={totalDaysInMonth}
                             onChange={e => {
                               let v = parseInt(e.target.value) || 0;
                               if (v > totalDaysInMonth) v = totalDaysInMonth;
                               if (v < 0) v = 0;
                               setEditedDays(prev => ({...prev, [pId]: v }));
                             }}
                             style={{ 
                               width:38, background:"transparent", border:"none", textAlign:"right", 
                               fontSize:14, fontWeight:800, color:C.p, outline:"none",
                               fontFamily:"'JetBrains Mono', 'Roboto Mono', monospace",
                               appearance: "none", margin: 0, padding: "0 4px"
                             }}
                          />
                          <span style={{ fontSize:12, fontWeight:700, color:C.bdr, opacity:0.6 }}>/</span>
                          <span style={{ width:38, fontSize:14, fontWeight:800, color:C.sub, fontFamily:"'JetBrains Mono', 'Roboto Mono', monospace", padding:"0 4px" }}>{totalDaysInMonth}</span>
                        </div>
                    </td>
                    <td style={{ padding:"14px 16px", textAlign:"right", fontWeight:800, color:C.p, fontSize:14, fontFamily:"'JetBrains Mono', 'Roboto Mono', monospace" }}>{calcNetStr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {releasedList.length > 0 && (
          <div style={{ marginTop:24, background:C.surf, padding:16, borderRadius:12, border:`1px solid ${C.bdr}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
               <span style={{ fontSize:11, fontWeight:800, color:C.sub, letterSpacing:.5 }}>ALREADY DISPATCHED ({releasedList.length})</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
               {releasedList.map(r => (
                <div key={r.pId} style={{ fontSize:10, fontWeight:600, color:C.sub, background:C.wht, padding:"4px 10px", borderRadius:8, border:`1px solid ${C.bdr}`, display:"flex", gap:8 }}>
                  <span>{r.emp.name}</span>
                  <span style={{ fontWeight:700, color:C.txt }}>{r.calcNetStr}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:32, paddingTop:24, borderTop:`1px solid ${C.bdr}` }}>
           <Btn variant="ghost" onClick={() => setStep(1)}>← Change Period</Btn>
           <div style={{ display:"flex", gap:12 }}>
             <Btn variant="outline" onClick={onClose}>Cancel</Btn>
             <Btn onClick={handleRelease} style={{ padding:"12px 28px", background:C.p, color:"#fff", fontSize:14, fontWeight:700, boxShadow:`0 4px 12px rgba(var(--p-rgb),.3)` }} disabled={selectedIds.length === 0}>
               Release Payslips ({selectedIds.length})
             </Btn>
           </div>
        </div>
      </Modal>
    );
  }
  return null;
};


// ─── Presence (Attendance) Module ──────────────────────────────────────────
const PresenceModule = ({ 
  isSA, isAdmin, isClockedIn, setIsClockedIn, attendanceMode, setAttendanceMode, 
  attendanceData, setAttendanceData, presenceEmpId, setPresenceEmpId, 
  presenceMonth, setPresenceMonth, selectedADate, setSelectedADate, 
  slackTeamsPlatform, setSlackTeamsPlatform, employees, leaves, holidays, 
  toast, C, ME_ID, narrow, pad, padBottom, heroPadStd, Btn, Av, Inp
}) => {
  const year = presenceMonth.getFullYear();
  const month = presenceMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const monthLabel = presenceMonth.toLocaleString("default", { month: "long" });

  const getDayStatus = (d) => {
    const date = new Date(year, month, d);
    // Use local-friendly date key
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayOfWeek = date.getDay();

    // Priority 1: Calendar holidays
    const hol = holidays.find(h => h.dISO === iso);
    if (hol) return { status: 'Holiday', label: hol.n, color: '#6366f1' };

    // Priority 2: Sundays are treated as holidays
    if (dayOfWeek === 0) return { status: 'Holiday', label: 'Sunday', color: '#6366f1' };

    // Priority 3: Approved leave
    const leave = leaves.find(l => l.empId === presenceEmpId && l.status === 'approved' && l.fromISO <= iso && l.toISO >= iso);
    if (leave) return { status: 'On Leave', label: leave.type, color: '#f59e0b' };

    // Priority 4: Saturday = Weekend (grey, not counted)
    if (dayOfWeek === 6) return { status: 'Weekend', color: C.bdr };

    // Priority 5: Mode-based logic for working days
    if (attendanceMode === 'Auto') return { status: 'Present', label: 'Present', color: '#10b981' };
    if (attendanceMode === 'HRMS') {
      const data = attendanceData[presenceEmpId]?.[iso];
      if (data) return { status: 'Present', label: 'Present', color: '#10b981', details: data };
      return { status: 'Absent', label: 'Absent', color: '#ef4444' };
    }
    if (attendanceMode === 'SlackTeams') return { status: 'Present', label: `Via ${slackTeamsPlatform}`, color: '#10b981' };
    return { status: 'Unknown', color: C.bdr };
  };


  const stats = { present: 0, holiday: 0, leave: 0, absent: 0 };
  for (let i = 1; i <= totalDays; i++) {
    const s = getDayStatus(i).status;
    if (s === 'Present') stats.present++; 
    else if (s === 'Holiday') stats.holiday++;
    else if (s === 'On Leave') stats.leave++; 
    else if (s === 'Absent') stats.absent++;
  }

  const handleClockToggle = () => {
    const now = new Date();
    const iso = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!isClockedIn) {
      setAttendanceData(prev => ({ ...prev, [ME_ID]: { ...(prev[ME_ID] || {}), [iso]: { checkIn: time, checkOut: '--', hours: '--' } } }));
      setIsClockedIn(true); toast(`Clocked in at ${time} ✓`);
    } else {
      const entry = attendanceData[presenceEmpId]?.[iso] || { checkIn: '09:00' };
      setAttendanceData(prev => ({ ...prev, [ME_ID]: { ...(prev[ME_ID] || {}), [iso]: { ...entry, checkOut: time, hours: '8.5' } } }));
      setIsClockedIn(false); toast(`Clocked out at ${time} ✓`);
    }
  };

  const handleModeChange = (id) => {
    setAttendanceMode(id);
    toast("Mode updated — past attendance records are unaffected ✓");
  };

  const [slackConnected, setSlackConnected] = React.useState(false);
  const [teamsConnected, setTeamsConnected] = React.useState(false);
  const isCurrentPlatformConnected = slackTeamsPlatform === 'Slack' ? slackConnected : teamsConnected;
  const setCurrentPlatformConnected = slackTeamsPlatform === 'Slack' ? setSlackConnected : setTeamsConnected;

  const LEGEND = [
    { color: '#10b981', label: 'Present' },
    { color: '#ef4444', label: 'Absent' },
    { color: '#f59e0b', label: 'Leave' },
    { color: '#6366f1', label: 'Holiday' },
  ];

  const hasAnyCalendarData = attendanceMode === 'Auto' || attendanceMode === 'SlackTeams' || attendanceMode === 'HRMS' || Object.keys(attendanceData[presenceEmpId] || {}).length > 0;

  return (
    <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
      <div style={{ position:"relative", margin:`0 ${-pad}px 28px`, padding: heroPadStd, background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`, borderBottom:`1px solid ${C.bdr}`, overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-40, top:-30, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:20, flexWrap:"wrap" }}>
          <div><div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10, padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`, fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase" }}>◉ Attendance</div><h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12 }}>Presence</h1><p style={{ color:C.sub, fontSize:13, margin:"10px 0 0" }}>{isAdmin ? "Monitoring org-wide engagement." : "Your personal activity feed."}</p></div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            {attendanceMode === 'HRMS' && presenceEmpId === ME_ID && (
              <Btn onClick={handleClockToggle} style={{ padding:"10px 24px", background: isClockedIn ? "none" : C.p, color: isClockedIn ? C.p : "#fff", border: isClockedIn ? `1px solid ${C.p}` : "none" }}>{isClockedIn ? "Clock Out" : "Clock In Now"}</Btn>
            )}
            <div style={{ display:"flex", background:C.wht, borderRadius:12, padding:4, border:`1px solid ${C.bdr}` }}>
               <button onClick={() => setPresenceMonth(new Date(year, month - 1))} style={{ padding:"4px 10px", background:"none", border:"none", cursor:"pointer", color:C.sub }}>←</button>
               <div style={{ padding:"0 12px", fontSize:12, fontWeight:700, color:C.txt, alignSelf:"center" }}>{monthLabel} {year}</div>
               <button onClick={() => setPresenceMonth(new Date(year, month + 1))} style={{ padding:"4px 10px", background:"none", border:"none", cursor:"pointer", color:C.sub }}>→</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 340px", gap:28 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          {isAdmin && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", background:C.surf, borderRadius:16, border:`1px solid ${C.bdr}` }}>
              <span style={{ fontSize:11, fontWeight:800, color:C.sub }}>VIEWING ATTENDANCE FOR:</span>
              <select value={presenceEmpId} onChange={e => setPresenceEmpId(Number(e.target.value))} style={{ padding:"6px 12px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ background:C.wht, borderRadius:20, padding:24, border:`1px solid ${C.bdr}`, boxShadow:"0 2px 16px rgba(0,0,0,.04)" }}>
            <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
              {LEGEND.map(l => (
                <div key={l.label} style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:l.color, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:C.sub, fontWeight:600 }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:8, marginBottom:12 }}>
              {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => <div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:800, color:C.sub }}>{d}</div>)}
            </div>
            {!hasAnyCalendarData ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:C.sub, fontSize:13 }}>
                <div style={{ fontSize:28, marginBottom:8 }}>📅</div>
                No attendance recorded yet
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:8 }}>
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = i+1, cur = new Date(year, month, day).toISOString().split('T')[0], status = getDayStatus(day), isSelected = selectedADate === cur;
                  return (
                    <button key={day} onClick={() => setSelectedADate(cur)} style={{ aspectRatio:"1/1", borderRadius:12, border:`1px solid ${isSelected ? C.p : C.bdr}`, background: isSelected ? `${C.p}10` : C.surf, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:14, fontWeight:700 }}>{day}</span>
                      <div style={{ width:6, height:6, borderRadius:"50%", background: status.color, marginTop:4 }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {selectedADate && (() => {
            const date = new Date(selectedADate), status = getDayStatus(date.getDate()), data = attendanceData[presenceEmpId]?.[selectedADate] || {};
            const isAutoCheckout = data.checkOut === '--';
            return (
              <div style={{ background:C.wht, borderRadius:20, padding:20, border:`1px solid ${C.bdr}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
                  <div>
                    <h3 style={{ margin:0, fontSize:17, color:C.txt }}>{date.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })}</h3>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background: status.color, flexShrink:0 }} />
                      <span style={{ fontWeight:700, fontSize:13, color:C.txt }}>{status.status}</span>
                      {status.label && status.label !== status.status && <span style={{ fontSize:12, color:C.sub }}>• {status.label}</span>}
                    </div>
                  </div>
                  {status.status === 'Present' && attendanceMode === 'HRMS' && (
                    <div style={{ display:"flex", gap:24 }}>
                      {[{l:"CHECK IN",v:data.checkIn||"—"},{l:"CHECK OUT",v:data.checkOut||"—"},{l:"TOTAL HRS",v:data.hours&&data.hours!=='--'?`${data.hours}h`:"Ongoing",c:C.p}].map(x=>(
                        <div key={x.l}><div style={{ fontSize:9, color:C.sub, fontWeight:800, letterSpacing:.8 }}>{x.l}</div><div style={{ fontWeight:700, fontSize:15, color:x.c||C.txt, marginTop:2 }}>{x.v}</div></div>
                      ))}
                    </div>
                  )}
                </div>
                {status.status === 'Present' && attendanceMode === 'HRMS' && isAutoCheckout && (
                  <div style={{ marginTop:12, padding:"8px 12px", borderRadius:8, background:"#fef9c3", border:"1px solid #fef08a", fontSize:11, color:"#713f12" }}>
                    Auto check-out will apply after 10 hours if not manually checked out.
                  </div>
                )}
                {status.status === 'Absent' && (
                  <div style={{ marginTop:12, padding:"8px 12px", borderRadius:8, background:"#fef2f2", border:"1px solid #fecaca", fontSize:11, color:"#991b1b" }}>
                    No attendance recorded. Expected based on the active <strong>{attendanceMode}</strong> mode.
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          <div style={{ background:C.dk, borderRadius:20, padding:24, color:"#fff", boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
            <h3 style={{ margin:"0 0 18px", fontSize:11, fontWeight:800, color:"#fff", letterSpacing:1.2 }}>{monthLabel.toUpperCase()} SUMMARY</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                {l:"Present Days",v:stats.present,c:"#fff"},
                {l:"Holidays",v:stats.holiday,c:"#fff"},
                {l:"Leave Days",v:stats.leave,c:"#fff"},
                {l:"Absent Days",v:stats.absent,c:stats.absent>0?"#dc2626":"#fff"}
              ].map(x=>(
                <div key={x.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:"#fff" }}>{x.l}</span>
                  <span style={{ fontWeight:800, fontSize:18, color:x.c }}>{x.v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:24, paddingTop:20, borderTop:`1px solid rgba(255,255,255,0.2)`, fontSize:11, color:"#fff", lineHeight:1.5 }}>
              <strong style={{ opacity: 0.9 }}>Priority:</strong> <span style={{ fontWeight:700 }}>Holidays → Leave → Logs</span>. Past records are never overwritten when changing mode.
            </div>
          </div>
          {isAdmin && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <span style={{ fontSize:11, fontWeight:800, color:C.sub }}>ATTENDANCE MODE</span>
              {[{id:'HRMS',t:'HRMS Clock-in',d:'In-app portal'},{id:'SlackTeams',t:'Slack / Teams',d:'Internal integration'},{id:'Auto',t:'Auto Attendance',d:'Mark present by default'}].map(m => (
                <button key={m.id} onClick={() => setAttendanceMode(m.id)} style={{ padding:16, textAlign:"left", borderRadius:16, border:`1px solid ${attendanceMode===m.id ? C.p : 'transparent'}`, background: C.dk, cursor:"pointer", transition:"all 0.2s", boxShadow: attendanceMode===m.id ? `0 0 0 1px ${C.p}` : 'none' }}>
                  <div style={{ fontWeight:700, fontSize:14, color: '#fff' }}>{m.t}</div>
                  <div style={{ fontSize:11, color: attendanceMode===m.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>{m.d}</div>
                  {attendanceMode===m.id && m.id==='SlackTeams' && <div style={{ display:"flex", gap:6, marginTop:8 }}>{['Slack','Teams'].map(plt=><button key={plt} onClick={(e)=>{e.stopPropagation();setSlackTeamsPlatform(plt);}} style={{ padding:"4px 8px", borderRadius:6, border:`1px solid ${slackTeamsPlatform===plt?C.p:'rgba(255,255,255,0.2)'}`, background:slackTeamsPlatform===plt?C.p:"transparent", color:slackTeamsPlatform===plt?"#fff":"rgba(255,255,255,0.8)", fontSize:10, fontWeight:700, cursor:"pointer" }}>{plt}</button>)}</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VibeCheckModule = ({ 
  isSA, isAdmin, me, employees, vibeFeedback, setVibeFeedback, toast, C, narrow, pad, padBottom, heroPadStd, Btn, Av, Inp 
}) => {
  const [vForm, setVForm] = useState({ type: "Suggestion", module: "Dashboard", msg: "", isAnon: false, file: null });
  const [filterType, setFilterType] = useState("All");
  const [filterMod, setFilterMod] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const types = ["Suggestion", "Bug", "Issue", "General Feedback"];
  const mods = ["Dashboard", "Employees", "Time Away", "Paydays", "Presence", "Paperwork Hub", "Overall Experience"];

  const handleSubmit = () => {
    if (!vForm.msg.trim()) return toast("Please enter a message");
    const newFeedback = {
      id: Date.now(),
      empId: me.id,
      empName: vForm.isAnon ? "Anonymous" : me.name,
      empIni: vForm.isAnon ? "?" : me.ini,
      type: vForm.type,
      module: vForm.module,
      message: vForm.msg,
      isAnonymous: vForm.isAnon,
      status: "Open",
      timestamp: new Date().toLocaleString("en-IN", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }),
      fileName: vForm.file ? vForm.file.name : null
    };
    setVibeFeedback(prev => [newFeedback, ...prev]);
    setVForm({ type: "Suggestion", module: "Dashboard", msg: "", isAnon: false, file: null });
    toast("Feedback sent! Thank you for the vibe check ✨");
  };

  const updateStatus = (id, status) => {
    setVibeFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    toast(`Status updated to ${status} ✓`);
  };

  const visibleFeedback = vibeFeedback.filter(f => {
    const roleOk = isSA ? true : f.empId === me.id;
    const typeOk = filterType === "All" || f.type === filterType;
    const modOk = filterMod === "All" || f.module === filterMod;
    const statusOk = filterStatus === "All" || f.status === filterStatus;
    return roleOk && typeOk && modOk && statusOk;
  });

  return (
    <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"1200px", margin:"0 auto", boxSizing:"border-box" }}>
      {/* Hero */}
      <div style={{
        position:"relative", margin:`0 ${-pad}px 28px`, padding: heroPadStd,
        background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
        borderBottom:`1px solid ${C.bdr}`, overflow:"hidden",
      }}>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10, padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`, fontSize:10, fontWeight:700, letterSpacing:.85, color:C.p, textTransform:"uppercase" }}>✨ Vibe Check</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700 }}>Help us make this better.</h1>
          <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.5 }}>Share your thoughts, report bugs, or suggest new features to help us improve KinSphere.</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "380px 1fr", gap:32, alignItems:"start" }}>
        {/* Form Column */}
        <div style={{ background:C.wht, borderRadius:20, padding:24, border:`1px solid ${C.bdr}`, boxShadow:"0 4px 20px rgba(0,0,0,.04)" }}>
          <h2 style={{ margin:"0 0 20px", fontSize:16, fontWeight:700, color:C.txt }}>Submit Feedback</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, display:"block", marginBottom:8 }}>FEEDBACK TYPE</label>
              <select value={vForm.type} onChange={e=>setVForm({...vForm, type:e.target.value})} style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.bg, fontSize:13, color:C.txt, outline:"none" }}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, display:"block", marginBottom:8 }}>WHICH MODULE?</label>
              <select value={vForm.module} onChange={e=>setVForm({...vForm, module:e.target.value})} style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.bg, fontSize:13, color:C.txt, outline:"none" }}>
                {mods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, display:"block", marginBottom:8 }}>YOUR MESSAGE</label>
              <textarea 
                value={vForm.msg} 
                onChange={e => setVForm({...vForm, msg: e.target.value})}
                placeholder="What's on your mind?"
                style={{ width:"100%", minHeight:120, padding:"12px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, fontSize:13, color:C.txt, outline:"none", resize:"vertical", fontFamily:"inherit" }}
              />
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, display:"block", marginBottom:8 }}>ATTACHMENT (OPTIONAL)</label>
              <div onClick={() => toast("Mock file selector opened")} style={{ width:"100%", padding:"12px", borderRadius:12, border:`1px dashed ${C.bdr}`, background:C.bg, fontSize:12, color:C.sub, textAlign:"center", cursor:"pointer" }}>
                {vForm.file ? vForm.file.name : "Click to upload screenshot/log"}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0" }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>Submit anonymously</div>
                <div style={{ fontSize:11, color:C.sub }}>Hide your identity from others</div>
              </div>
              <button 
                onClick={() => setVForm({...vForm, isAnon: !vForm.isAnon})}
                style={{ width:40, height:20, borderRadius:20, background: vForm.isAnon ? C.p : C.bdr, border:"none", position:"relative", cursor:"pointer", transition:".2s" }}
              >
                <div style={{ position:"absolute", top:2, left: vForm.isAnon ? 22 : 2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:".2s" }} />
              </button>
            </div>
            <Btn onClick={handleSubmit} style={{ width:"100%", padding:"12px" }}>Send Feedback</Btn>
          </div>
        </div>

        {/* List Column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {isSA && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, background:C.surf, padding:"14px 18px", borderRadius:16, border:`1px solid ${C.bdr}` }}>
              <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ padding:"6px 10px", borderRadius:8, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:11 }}>
                <option value="All">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filterMod} onChange={e=>setFilterMod(e.target.value)} style={{ padding:"6px 10px", borderRadius:8, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:11 }}>
                <option value="All">All Modules</option>
                {mods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:"6px 10px", borderRadius:8, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:11 }}>
                <option value="All">All Status</option>
                <option>Open</option>
                <option>In Review</option>
                <option>Resolved</option>
              </select>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.sub, letterSpacing:1 }}>
              {isSA ? `ALL SUBMISSIONS (${visibleFeedback.length})` : `YOUR FEEDBACK (${visibleFeedback.length})`}
            </div>
            {visibleFeedback.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, background:C.bg, borderRadius:20, border:`1px dashed ${C.bdr}`, color:C.sub }}>
                No feedback items found.
              </div>
            ) : (
              visibleFeedback.map(f => (
                <div key={f.id} style={{ background:C.wht, borderRadius:20, padding:20, border:`1px solid ${C.bdr}`, boxShadow:"0 2px 12px rgba(0,0,0,.03)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ 
                        padding: "4px 10px", borderRadius:6, fontSize:10, fontWeight:700, 
                        background: f.type==="Bug" ? "#fee2e2" : f.type==="Suggestion" ? "#e0f2fe" : "#f3f4f6", 
                        color: f.type==="Bug" ? "#991b1b" : f.type==="Suggestion" ? "#0369a1" : C.sub 
                      }}>
                        {f.type.toUpperCase()}
                      </div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.txt }}>{f.module}</div>
                    </div>
                    <div style={{ 
                      padding: "4px 10px", borderRadius:20, fontSize:10, fontWeight:700, 
                      background: f.status==="Resolved" ? "#dcfce7" : f.status==="In Review" ? "#fef9c3" : C.bg, 
                      color: f.status==="Resolved" ? "#166534" : f.status==="In Review" ? "#854d0e" : C.sub,
                      border: `1px solid ${C.bdr}`
                    }}>
                      {f.status}
                    </div>
                  </div>
                  <p style={{ margin:0, fontSize:13, color:C.txt, lineHeight:1.55 }}>{f.message}</p>
                  <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.surf}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <Av ini={f.empIni} sz={20} />
                      <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>{f.empName} <span style={{ fontWeight:400, opacity:0.6 }}>• {f.timestamp}</span></span>
                    </div>
                    {isSA && (
                      <div style={{ display:"flex", gap:6 }}>
                        {["In Review", "Resolved"].map(s => (
                          f.status !== s && (
                            <button 
                              key={s} 
                              onClick={() => updateStatus(f.id, s)}
                              style={{ background:"none", border:`1px solid ${C.bdr}`, borderRadius:6, padding:"4px 8px", fontSize:10, fontWeight:700, cursor:"pointer", color:C.p }}
                            >
                              Move to {s}
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page,       setPage]     = useState("Dashboard");
  const [role,       setRole]     = useState("Super Admin");
  const isSA  = role === "Super Admin";
  const isAdmin = role === "Admin" || role === "Super Admin";
  
  const [employees, setEmployees] = useState(() => JSON.parse(JSON.stringify(EMPS)));
  const [saPayslips, setSaPayslips] = useState(DEMO_PAYSLIPS);
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
  const [orgSearch, setOrgSearch]     = useState("");
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [orgPreviewId, setOrgPreviewId] = useState(null);
  const [showOrgEdit, setShowOrgEdit] = useState(false);

  const toggleOrgCollapse = (id) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReassignManager = (empId, newManagerId) => {
    if (empId === newManagerId) return toast("Cannot report to self!");
    setOrgManagers(prev => ({ ...prev, [empId]: newManagerId }));
    toast("Reporting line updated ✓");
  };
  const [saCalTooltip, setSaCalTooltip] = useState(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);
  const [companyTagline, setCompanyTagline] = useState("Bipolar Factory");
  const [showTaglineEdit, setShowTaglineEdit] = useState(false);
  const [taglineDraft, setTaglineDraft] = useState("");
  const [require2FAForAll, setRequire2FAForAll] = useState(false);
  const [sessionTimeoutValue, setSessionTimeoutValue] = useState(8);
  const [sessionTimeoutUnit, setSessionTimeoutUnit] = useState("Hours");
  const [accessSelectedEmpId, setAccessSelectedEmpId] = useState("");
  const [accessPermissions, setAccessPermissions] = useState({
    Employees: true, Paydays: true, TimeAway: true, PaperworkHub: true, Presence: true, PeopleChapters: true
  });
  const [settingNotifs, setSettingNotifs] = useState({
    directory: true, payroll: true, security: true
  });
  const [payslipPreview, setPayslipPreview] = useState(null);
  const [brandLogoHovered, setBrandLogoHovered] = useState(false);
  const [docPreviewItem, setDocPreviewItem] = useState<{doc: any, emp: any} | null>(null);
  
  const [showImportCsv, setShowImportCsv] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [departments, setDepartments] = useState(["Technology", "Design", "Marketing", "Operations", "HR"]);
  const [newDeptInput, setNewDeptInput] = useState("");
  const [notifications, setNotifications] = useState(INIT_NOTIFICATIONS);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const addNotif = (n: Omit<typeof INIT_NOTIFICATIONS[0], 'id' | 'time' | 'read'>) => {
    setNotifications(prev => [{ ...n, id: Date.now(), time: "Just now", read: false }, ...prev]);
  };
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayDesc, setNewHolidayDesc] = useState("");
  
  const [payrollStatus, setPayrollStatus] = useState("Draft");
  const [releaseStep, setReleaseStep] = useState(0);
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

  // ─── Paperwork Hub ───────────────────────────────────────────────────────
  const [papers, setPapers] = useState(INIT_PAPERS);
  const [candidates, setCandidates] = useState(INIT_CANDIDATES);
  const [paperModal, setPaperModal] = useState(false);
  const [paperTemplatePreview, setPaperTemplatePreview] = useState(null);
  const [adminDocAccessGranted, setAdminDocAccessGranted] = useState(false);
  const [paperForm, setPaperForm] = useState({ name:"", empId:"", type:"Offer Letter", fileName:"" });
  const [paperFilter, setPaperFilter] = useState("All");
  const [paperTab, setPaperTab] = useState("Documents"); // "Documents" | "Generate"
  
  // Step 4+: Dynamic Templates
  const [templates, setTemplates] = useState(PAPER_TEMPLATES);
  const [showTplManage, setShowTplManage] = useState(false);
  const [tplForm, setTplForm] = useState({ id:"", name:"", type:"Other", body:"", fileName:"" });
  const [tplStep, setTplStep] = useState(1); // 1 = TabView, 2 = Edit Text, 3 = Confirm
  const [tplTab,  setTplTab]  = useState("Library"); // "Library" | "Upload"
  const [tplExtracted, setTplExtracted] = useState([]);
  const [tplViewPdf, setTplViewPdf] = useState(null); // url string
  const [tplSearch, setTplSearch] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null); // Document object for preview

  // Step 3: E-Signature Flow
  const [signId, setSignId] = useState(null); // Document ID being signed
  const [sigType, setSigType] = useState("type"); // "type" | "draw"
  const [sigValue, setSigValue] = useState(""); // Typed name / Draw data

  // Generate flow state
  const [genStep, setGenStep] = useState(1);          // 1=pick template, 2=fill form & preview, 3=select recipient
  const [genTemplate, setGenTemplate] = useState(null);
  const [genRecipientType, setGenRecipientType] = useState("employee"); // "employee" | "candidate" | "external"
  const [genEmpId, setGenEmpId] = useState("");
  const [genVals, setGenVals] = useState({});          // { field: value }
  const [genCandForm, setGenCandForm] = useState({ name:"",email:"",role:"",salary:"",startDate:"",notes:"" });
  const [genSavedCandId, setGenSavedCandId] = useState(null); // newly saved candidate id

  // Step 5: Off-boarding
  const [offboardingItems, setOffboardingItems] = useState([
    { id: 1, empId: 2, name: "Rohit Sharma", status: "In Progress", progress: 65, lastAction: "IT Clearance Pending", 
      checklist: [
        { name: "Resignation Letter", status: "Completed", date: "01 Apr" },
        { name: "IT Clearance", status: "In Progress", date: "-" },
        { name: "Finance Clearance", status: "Completed", date: "03 Apr" },
        { name: "Exit Interview", status: "Pending", date: "-" },
        { name: "F&F Settlement", status: "Pending", date: "-" }
      ]
    },
    { id: 2, empId: 4, name: "Suresh Raina", status: "Completed", progress: 100, lastAction: "Full & Final Settled",
      checklist: [
        { name: "Resignation Letter", status: "Completed", date: "15 Mar" },
        { name: "IT Clearance", status: "Completed", date: "20 Mar" },
        { name: "Finance Clearance", status: "Completed", date: "22 Mar" },
        { name: "Exit Interview", status: "Completed", date: "24 Mar" },
        { name: "F&F Settlement", status: "Completed", date: "28 Mar" }
      ]
    },
  ]);
  const [showOffboardInitiate, setShowOffboardInitiate] = useState(false);
  const [offboardForm, setOffboardForm] = useState({ empId:"", reason:"", lastDate:"" });
  const [genExternalEmail, setGenExternalEmail] = useState("");
  const [genFilledBody, setGenFilledBody] = useState("");
  const [genSentLink, setGenSentLink] = useState(null);
  const resetGen = () => { setGenStep(1); setGenTemplate(null); setGenRecipientType("employee"); setGenEmpId(""); setGenVals({}); setGenCandForm({ name:"",email:"",role:"",salary:"",startDate:"",notes:"" }); setGenSavedCandId(null); setGenExternalEmail(""); setGenFilledBody(""); setGenSentLink(null); };

  // Presence (Attendance) State
  const [attendanceMode, setAttendanceMode] = useState("Auto"); // "Auto", "HRMS", "SlackTeams"
  const [slackTeamsPlatform, setSlackTeamsPlatform] = useState("Slack");
  const [attendanceData, setAttendanceData] = useState({}); // { [empId]: { [dateISO]: { status, in, out, hrs } } }
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [presenceEmpId, setPresenceEmpId] = useState(ME_ID);
  const [presenceMonth, setPresenceMonth] = useState(() => new Date(2026, 2, 1)); // March 2026
  const [selectedADate, setSelectedADate] = useState(null); // ISO date

  // Vibe Check
  const [vibeFeedback, setVibeFeedback] = useState([
    { id: 1, empId: 2, empName: "Rohit Sharma", empIni: "RS", type: "Suggestion", module: "Dashboard", message: "Can we have a dark mode toggle more prominently?", isAnonymous: false, status: "Open", timestamp: "Today, 10:45 AM" },
    { id: 2, empId: 3, empName: "Anonymous", empIni: "?", type: "Bug", module: "Paydays", message: "Salary calculation for February had a small rounding error.", isAnonymous: true, status: "In Review", timestamp: "Yesterday, 04:20 PM" },
  ]);

  // People Chapters
  const [chapterTab, setChapterTab] = useState("Menu");
  
  // Close notification panel when navigating away from page
  useEffect(() => {
    setShowNotifPanel(false);
  }, [page]);

  // ─────────────────────────────────────────────────────────────────────────

  const handleProcessPayments = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newProcessed = { ...processedPayments };
      const currentPayslips = saPayslipRows.filter(p => selectedPayIds.includes(p.id));
      let totalAmt = 0;
      currentPayslips.forEach(p => {
        newProcessed[p.id] = true;
        totalAmt += parseInr(editedSalaries[p.id] || p.net);
        // Notify employee
        addNotif({
          icon: "💸", title: "Payment Processed",
          body: `Your salary for ${MONTHS_SHORT[p.month]} ${p.year} has been processed.`,
          forSA: false, forAll: false, forEmpIds: [p.empId]
        });
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

  /** RECOGNITION STATE */
  const [recogs, setRecogs] = useState(RECOGS);
  const [newRecogTags, setNewRecogTags] = useState([]);
  const [isPrivateRecog, setIsPrivateRecog] = useState(false);
  const [recogTo, setRecogTo] = useState("Choose a teammate…");
  const [recogMsg, setRecogMsg] = useState("");
  
  const RECO_TAGS = ["Teamwork", "Leadership", "Ownership", "Creativity"];

  const handlePostRecog = () => {
    if (recogTo === "Choose a teammate…" || !recogMsg.trim()) {
      toast("Please select a teammate and write a message.");
      return;
    }
    const target = employees.find(e => e.name === recogTo);
    const newR = {
      id: Date.now(),
      from: me.name,
      fIni: me.ini,
      to: recogTo,
      tIni: target?.ini || "??",
      msg: recogMsg,
      time: "Just now",
      tags: newRecogTags,
      reactions: { like: 0, celebrate: 0 },
      isPrivate: isPrivateRecog,
      comments: []
    };
    setRecogs(p => [newR, ...p]);
    // Notification for recognition
    addNotif({
      icon: "🎉",
      title: "New Shout-out!",
      body: `${me.name} recognised ${recogTo} for ${newRecogTags.join(", ")}`,
      forSA: true,
      forAll: false,
      forEmpIds: target ? [target.id] : []
    });
    setRecogTo("Choose a teammate…");
    setRecogMsg("");
    setNewRecogTags([]);
    setIsPrivateRecog(false);
    toast(`${isPrivateRecog ? "Private" : "Public"} shout-out posted! ✦`);
  };

  const handleToggleReaction = (recogId, type) => {
    setRecogs(prev => prev.map(r => {
      if (r.id !== recogId) return r;
      const newReactions = { ...r.reactions };
      // In a real app, we'd check if specific user already reacted. 
      // For prototype, we just increment.
      newReactions[type] = (newReactions[type] || 0) + 1;
      return { ...r, reactions: newReactions };
    }));
    // Notification for reaction
    const rr = recogs.find(x => x.id === recogId);
    if (rr) {
      const targetEmp = employees.find(e => e.name === rr.to);
      if (targetEmp) {
        addNotif({
          icon: type === 'like' ? '👍' : '🎉',
          title: "Reaction on your shout-out",
          body: `${me.name} reacted to your ${rr.tags[0] || "shout-out"}`,
          forSA: false,
          forAll: false,
          forEmpIds: [targetEmp.id]
        });
      }
    }
    toast(`Reacted with ${type === 'like' ? '👍' : '🎉'} ✓`);
  };

  const handleAddComment = (recogId, txt) => {
    if (!txt.trim()) return;
    setRecogs(prev => prev.map(r => {
      if (r.id !== recogId) return r;
      return {
        ...r,
        comments: [...r.comments, { from: me.name, ini: me.ini, txt, time: "Just now" }]
      };
    }));
    toast("Comment added ✓");
  };

  /** Monthly Highlights Calculation */
  const recogHighlights = (() => {
    const recCounts = {}; // { name: count }
    const giverCounts = {};
    recogs.forEach(r => {
      if (r.isPrivate) return;
      recCounts[r.to] = (recCounts[r.to] || 0) + 1;
      giverCounts[r.from] = (giverCounts[r.from] || 0) + 1;
    });
    const topRecognised = Object.entries(recCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count, ini: employees.find(e=>e.name===name)?.ini || "??" }));
    const topGivers = Object.entries(giverCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count, ini: employees.find(e=>e.name===name)?.ini || "??" }));
    return { topRecognised, topGivers };
  })();

  /** Leave Policy: SA-configurable allocations per leave type */
  const [leavePolicy, setLeavePolicy] = useState({
    "Sick Leave":    { total: 12, accrual: "annual" },
    "Earned Leave":  { total: 15, accrual: "annual" },
    "Casual Leave":  { total: 6,  accrual: "annual" },
  });
  const [showLeavePolicy, setShowLeavePolicy] = useState(false);
  const [showLeaveBal,    setShowLeaveBal]    = useState(false);
  const [selectedLeaveEmpId, setSelectedLeaveEmpId] = useState<number|null>(null);
  // { [empId]: { [leaveType]: totalDays } } — overrides per-employee entitlement
  const [empLeaveOverrides, setEmpLeaveOverrides] = useState<Record<number,Record<string,number>>>({});
  // Draft for pending edits in the detail pane (before Save is clicked)
  const [leaveDetailDraft, setLeaveDetailDraft] = useState<Record<string,number>>({});
  const [leaveDetailHasChanges, setLeaveDetailHasChanges] = useState(false);
  // Month/year filter for leave history in the detail pane (null = all)
  const [leaveDetailHistoryMonth, setLeaveDetailHistoryMonth] = useState<number|null>(null);
  const [leaveDetailHistoryYear, setLeaveDetailHistoryYear] = useState<number>(new Date().getFullYear());
  // Year/month context for the leave balance summary table (null month = full year)
  const [leaveBalYear, setLeaveBalYear] = useState<number>(new Date().getFullYear());
  const [leaveBalMonth, setLeaveBalMonth] = useState<number|null>(null);
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
  const [bankPick, setBankPick] = useState(null);
  const [bankForm, setBankForm] = useState({ acc: "", ifsc: "" });
  const [showEmp,    setShowEmp]  = useState(false);
  const [empForm, setEmpForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "",
    role: "Employee", type: "Full Time", doj: "", designation: "", dept: "Technology", manager: "No Manager", bankAcc: "", bankIfsc: ""
  });
  useEffect(() => {
    if (bankPick) {
      const e = empById(bankPick, employees);
      if (e) setBankForm({ acc: e.bankInfo?.accountNumber || "", ifsc: e.bankInfo?.ifsc || "" });
    }
  }, [bankPick, employees]);
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
        manager: empById(e.managerId, employees)?.name || "No Manager",
        bankAcc: e.bankInfo?.accountNumber || "",
        bankIfsc: e.bankInfo?.ifsc || ""
      });
    } else if (showEmp) {
      setEmpForm({
        firstName: "", lastName: "", email: "", phone: "", dob: "",
        role: "Employee", type: "Full Time", doj: "", designation: "", dept: "Technology", manager: "No Manager", bankAcc: "", bankIfsc: ""
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
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("kinsphere-theme") || "Original";
    }
    return "Original";
  });



  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.getElementById("kinsphere-theme-vars");
      if (style) {
        style.innerHTML = getThemeCss(theme, isDark);
      }
      localStorage.setItem("kinsphere-theme", theme);
      
      if (isDark) document.documentElement.className = "dark";
      else document.documentElement.className = "";
    }
  }, [theme, isDark]);
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
      addNotif({
        icon: act === "approved" ? "✅" : "❌",
        title: `Leave ${act.charAt(0).toUpperCase() + act.slice(1)}`,
        body: `Your ${row.type} request (${row.from}–${row.to}) has been ${act}.`,
        forSA: false, forAll: false, forEmpIds: [row.empId]
      });
      // Also notify SA if someone else (like a manager) approved it, 
      // but in this prototype usually it's the SA acting.
      // If the current user is NOT SA, we can notify SA as well.
      if (!isSA) {
        addNotif({
          icon: "🗓", title: `Leave ${act.charAt(0).toUpperCase() + act.slice(1)}`,
          body: `${me.name} ${act} leave for ${row.emp}`,
          forSA: true, forAll: false, forEmpIds: []
        });
      }
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
  const navItems = navItemsForRole(isSA, isAdmin);
  const myLeaves = leaves.filter(l => l.empId === ME_ID);
  const saPayslipRows = saPayslips.filter(p =>
    p.year === payYear && (payMonthFilter === null || p.month === payMonthFilter)
  ).sort((a, b) => a.month - b.month || a.name.localeCompare(b.name));
  const myPayslipRows = saPayslips.filter(p => p.empId === ME_ID && p.year === payYear)
    .sort((a, b) => b.month - a.month);
  const onEmpProfilePage = page === "Employees" || page === "My Profile";

  useEffect(() => {
    if (!isAdmin && page === "Employees") setPage("My Profile");
    if (isAdmin && page === "My Profile") setPage("Employees");
  }, [role, isAdmin, page]);

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

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(r) => { setRole(r); setIsLoggedIn(true); setPage("Dashboard"); }} logoUrl={companyLogoUrl} tagline={companyTagline} />;
  }

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
      {/* ─ STEP 3: E-SIGNATURE OVERLAY ─ */}
      {signId && (() => {
        const docToSign = papers.find(p => p.id === signId);
        if (!docToSign) return null;
        return (
          <div style={{ position:"fixed", inset:0, zIndex:2000, background:"#f9fafb", display:"flex", flexDirection:"column", animation:"fadeIn 0.2s" }}>
            <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
            <div style={{ padding:"16px 24px", background:"#fff", borderBottom:`1px solid ${C.bdr}`, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:C.p, display:"flex", alignItems:"center", justifyContent:"center", color:"#2a3326", fontWeight:800 }}>KS</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.txt }}>Sign Document</div>
                  <div style={{ fontSize:11, color:C.sub }}>{docToSign.name} • KinSphere Document Center</div>
                </div>
              </div>
              <button onClick={() => { setSignId(null); setSigValue(""); }} style={{ background:C.bg, border:`1px solid ${C.bdr}`, borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:600, cursor:"pointer" }}>✕ Cancel</button>
            </div>
            
            <div style={{ flex:1, overflowY:"auto", padding: narrow ? "20px 14px" : "40px", display:"flex", justifyContent:"center", background:C.bg }}>
              <div style={{ background:"#fff", width:"100%", maxWidth:800, padding: narrow ? "40px 24px" : "80px 60px", boxShadow:"0 4px 30px rgba(0,0,0,.06)", borderRadius:4, border:`1px solid ${C.bdr}`, position:"relative", height:"fit-content" }}>
                <div style={{ position:"absolute", top:20, right:30, fontSize:10, fontWeight:700, color:C.bdr, letterSpacing:1 }}>OFFICIAL COPY</div>
                
                <h2 style={{ fontFamily:"Georgia,serif", fontSize:24, textAlign:"center", marginBottom:40 }}>{docToSign.name}</h2>
                <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia, serif", fontSize:14, lineHeight:1.9, color:C.txt, margin:0 }}>{docToSign.filledBody}</pre>
                
                <div style={{ marginTop:80, paddingTop:40, borderTop:`2px solid ${C.bg}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1.5, marginBottom:4 }}>SIGNATURE</div>
                      <div style={{ fontSize:11, color:C.sub }}>Type or draw your official signature below</div>
                    </div>
                    <div style={{ display:"flex", gap:4, background:C.surf, padding:3, borderRadius:10 }}>
                      <button onClick={()=>setSigType("type")} style={{ border:"none", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:700, cursor:"pointer", background: sigType==="type"?"#fff":"transparent", color: sigType==="type"?C.p:C.sub }}>Type</button>
                      <button onClick={()=>setSigType("draw")} style={{ border:"none", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:700, cursor:"pointer", background: sigType==="draw"?"#fff":"transparent", color: sigType==="draw"?C.p:C.sub }}>Draw</button>
                    </div>
                  </div>
                  
                  <div style={{ background:C.bg, borderRadius:16, border:`2px dashed ${C.bdr}`, padding:30, textAlign:"center" }}>
                    {sigType === "type" ? (
                      <input 
                        type="text"
                        value={sigValue}
                        onChange={e => setSigValue(e.target.value)}
                        placeholder="Type Full Name..."
                        style={{ width:"100%", background:"none", border:"none", borderBottom:`2px solid ${C.p}`, textAlign:"center", fontSize:32, color:C.txt, fontFamily:"'Georgia', serif", fontStyle:"italic", outline:"none", padding:10 }}
                      />
                    ) : (
                      <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center", color:C.bdr, fontSize:12, fontStyle:"italic" }}>
                        [ Move mouse or use touch to draw signature ]
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginTop:40, textAlign:"center" }}>
                    <Btn 
                      disabled={sigType==="type" && !sigValue.trim()} 
                      style={{ padding:"14px 40px", fontSize:14, boxShadow:"0 4px 14px rgba(0,0,0,.1)" }}
                      onClick={() => {
                        const date = new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
                        setPapers(papers.map(p => p.id === signId ? { ...p, status:"signed", date } : p));
                        setSignId(null);
                        setSigValue("");
                        toast("Document Signed & Completed! ✓");
                      }}
                    >
                      Sign & Complete Document
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
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
        background:C.sb,
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
              onClick={() => { setIsLoggedIn(false); setRole("Employee"); setPage("Dashboard"); toast("Logged out ✓"); }}
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

        {/* ── NOTIFICATION BELL ── */}
        {(() => {
          if (page !== "Dashboard") return null;
          const visibleNotifs = notifications.filter(n =>
            isAdmin ? true
            : n.forAll
            || n.forEmpIds.includes(ME_ID)
          );
          const unread = visibleNotifs.filter(n => !n.read).length;
          return (
            <>
              <button
                id="notif-bell-btn"
                onClick={() => setShowNotifPanel(v => !v)}
                style={{
                  position:"fixed",
                  top: narrow ? "calc(52px + env(safe-area-inset-top,0px) + 10px)" : 18,
                  right: narrow ? 14 : 18,
                  zIndex: 250,
                  width: 40, height: 40,
                  borderRadius: 12,
                  border: `1px solid ${C.bdr}`,
                  background: showNotifPanel ? C.p : C.wht,
                  color: showNotifPanel ? "#fff" : C.txt,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 12px rgba(var(--shadow-rgb),.1)",
                  transition: "background .15s, color .15s, box-shadow .15s",
                  flexShrink: 0,
                }}
                title="Notifications"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unread > 0 && (
                  <span style={{
                    position:"absolute", top:-4, right:-4,
                    minWidth:17, height:17, borderRadius:999,
                    background:"#dc2626", color:"#fff",
                    fontSize:9, fontWeight:800, letterSpacing:.2,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 4px", border:"2px solid #fff",
                    lineHeight:1,
                  }}>{unread > 9 ? "9+" : unread}</span>
                )}
              </button>

              {showNotifPanel && (
                <>
                  <div
                    style={{ position:"fixed", inset:0, zIndex:248 }}
                    onClick={() => setShowNotifPanel(false)}
                  />
                  <div
                    style={{
                      position:"fixed",
                      top: narrow ? "calc(52px + env(safe-area-inset-top,0px) + 56px)" : 66,
                      right: narrow ? 10 : 18,
                      zIndex: 249,
                      width: Math.min(360, (typeof window !== "undefined" ? window.innerWidth : 400) - 20),
                      maxHeight: "calc(100vh - 120px)",
                      background: C.wht,
                      borderRadius: 16,
                      border: `1px solid ${C.bdr}`,
                      boxShadow: "0 16px 48px rgba(var(--shadow-rgb),.18)",
                      display: "flex", flexDirection: "column",
                      overflow: "hidden",
                      animation: "fadeIn .15s ease",
                    }}
                  >
                    {/* Panel header */}
                    <div style={{ padding:"14px 16px 10px", borderBottom:`1px solid ${C.bdr}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:C.txt }}>Notifications</div>
                        <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>{unread} unread · {visibleNotifs.length} total</div>
                      </div>
                      {unread > 0 && (
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          style={{ background:"none", border:"none", fontSize:11, fontWeight:600, color:C.p, cursor:"pointer", padding:"4px 8px", borderRadius:6 }}
                        >Mark all read</button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div style={{ overflowY:"auto", flex:1 }}>
                      {visibleNotifs.length === 0 ? (
                        <div style={{ padding:"40px 20px", textAlign:"center", color:C.sub, fontSize:12 }}>No notifications yet.</div>
                      ) : visibleNotifs.map(n => (
                        <div
                          key={n.id}
                          onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          style={{
                            display:"flex", gap:12, padding:"12px 16px",
                            borderBottom:`1px solid ${C.surf}`,
                            background: n.read ? "transparent" : `rgba(var(--p-rgb),.06)`,
                            cursor:"pointer", transition:"background .12s",
                            position:"relative",
                          }}
                          onMouseEnter={ev => { ev.currentTarget.style.background = C.surf; }}
                          onMouseLeave={ev => { ev.currentTarget.style.background = n.read ? "transparent" : `rgba(var(--p-rgb),.06)`; }}
                        >
                          {!n.read && (
                            <span style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)", width:5, height:5, borderRadius:"50%", background:C.p }} />
                          )}
                          <div style={{ width:34, height:34, borderRadius:10, background:C.surf, border:`1px solid ${C.bdr}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                            {n.icon}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight: n.read ? 500 : 700, fontSize:12, color:C.txt, lineHeight:1.3 }}>{n.title}</div>
                            <div style={{ fontSize:11, color:C.sub, marginTop:3, lineHeight:1.4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.body}</div>
                            <div style={{ fontSize:10, color:C.bdr, marginTop:4 }}>{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Panel footer */}
                    <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.bdr}`, display:"flex", justifyContent:"flex-end", flexShrink:0 }}>
                      <button
                        onClick={() => { setNotifications(prev => prev.filter(n => n.read)); }}
                        style={{ background:"none", border:"none", fontSize:11, color:C.sub, cursor:"pointer", padding:"4px 8px", borderRadius:6 }}
                      >Clear read</button>
                    </div>
                  </div>
                </>
              )}
            </>
          );
        })()}
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
                }}>{greet}, {me.name.split(" ")[0]}</h1>
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
                : `repeat(${2 + (isAdmin && pendingApprovalsForDashboard.length > 0 ? 1 : 0)}, minmax(0, 1fr))`,
              gap:16,
              marginBottom:20,
            }}>
              {[
                { lbl:"Total employees", val:String(employees.length), sub:"Active directory", icon:ICONS.Users,
                  accent:C.p, iconBg:C.surf },
                ...(isAdmin && pendingApprovalsForDashboard.length > 0
                  ? [{ lbl:"Pending leave approvals", val:String(pendingApprovalsForDashboard.length), sub:"All pending requests", icon:ICONS.ClipboardList,
                    accent:C.p2, iconBg:C.surf }]
                  : []),
                { lbl:"On leave today", val:String(onLeaveTodayCount), sub:"Approved time away", icon:ICONS.CalendarCheck,
                  accent:C.p, iconBg:C.surf },
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
              {isAdmin ? (
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
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:C.p2, borderRadius:"4px 0 0 4px" }} />
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
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={()=>setShowEmp(true)}
                        style={{
                          display:"flex", alignItems:"center", gap:12, width:"100%", textAlign:"left",
                          padding:"12px 14px", borderRadius:12, border:`1px solid ${C.dk}`,
                          background:`linear-gradient(155deg, ${C.p} 0%, ${C.p2} 100%)`,
                          cursor:"pointer", fontSize:13, fontWeight:600, color:"#fff",
                          boxShadow:"0 4px 15px rgba(var(--p-rgb),.4), inset 0 1px 0 rgba(255,255,255,.2)",
                          transform:"translateY(0)", transition:"transform .1s, box-shadow .1s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(var(--p-rgb),.5)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 15px rgba(var(--p-rgb),.4)"; }}

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
              {/* Birthdays */}
              <div style={{
                background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                padding:"20px 22px", minHeight:120,
                boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
                backgroundImage:`linear-gradient(135deg, ${C.wht} 0%, var(--mid) 55%, ${C.surf} 100%)`,
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>🎂</span>
                    <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Birthdays</h2>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>NEXT 3 DAYS</span>
                </div>
                
                {(() => {
                  const bdays = employees.map(e => ({ e, days: getEventDays(e.dob) })).filter(x => x.days !== null).sort((a,b) => a.days - b.days);
                  if (bdays.length === 0) return (
                    <p style={{ margin:0, fontSize:12, color:C.sub, lineHeight:1.55 }}>
                      None in the next 3 days. When someone’s day is near, it’ll show up here with a countdown.
                    </p>
                  );
                  return (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {bdays.map(({e, days}) => (
                        <div
                          key={e.id}
                          style={{
                            display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                            padding:"10px 12px", borderRadius:12, border:`1px solid ${C.bdr}`,
                            background:C.bg, cursor:"default", transition:"transform .12s, box-shadow .12s",
                          }}
                          onMouseEnter={ev => { ev.currentTarget.style.transform="translateY(-1px)"; ev.currentTarget.style.boxShadow=`0 4px 12px rgba(var(--p-rgb),.15)`; }}
                          onMouseLeave={ev => { ev.currentTarget.style.transform="translateY(0)"; ev.currentTarget.style.boxShadow="none"; }}
                        >
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Av ini={e.ini} sz={32} bg={C.p} />
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{e.name}</div>
                              <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>{e.dob.split(" ").slice(0,2).join(" ")}</div>
                            </div>
                          </div>
                          {days === 0 ? (
                            <span style={{ fontSize:10, fontWeight:800, color:"#fff", background:C.p, padding:"4px 10px", borderRadius:999 }}>Today</span>
                          ) : (
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontSize:11, fontWeight:700, color:C.p }}>In {days} day{days !== 1 ? 's' : ''}</div>
                              <div style={{ fontSize:9, color:C.sub, fontWeight:600 }}>C O U N T D O W N</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Anniversaries */}
              <div style={{
                background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
                padding:"20px 22px", minHeight:120,
                boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)",
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>🎉</span>
                    <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:17, fontWeight:700, color:C.txt }}>Work anniversaries</h2>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>NEXT 3 DAYS</span>
                </div>

                {(() => {
                  const annivs = employees.map(e => ({ e, days: getEventDays(e.joined) })).filter(x => x.days !== null).sort((a,b) => a.days - b.days);
                  if (annivs.length === 0) return (
                    <p style={{ margin:0, fontSize:12, color:C.sub, lineHeight:1.55 }}>
                      No work anniversaries in the next 3 days.
                    </p>
                  );
                  return (
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {annivs.map(({e, days}) => {
                        const joinYear = parseInt(e.joined.split(" ").pop());
                        const years = new Date().getFullYear() - joinYear;
                        return (
                          <div
                            key={e.id}
                            style={{
                              display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                              padding:"10px 12px", borderRadius:12, border:`1px solid ${C.bdr}`,
                              background:C.bg, cursor:"default", transition:"transform .12s, box-shadow .12s",
                            }}
                            onMouseEnter={ev => { ev.currentTarget.style.transform="translateY(-1px)"; ev.currentTarget.style.boxShadow=`0 4px 12px rgba(var(--p-rgb),.15)`; }}
                            onMouseLeave={ev => { ev.currentTarget.style.transform="translateY(0)"; ev.currentTarget.style.boxShadow="none"; }}
                          >
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <Av ini={e.ini} sz={32} bg={C.p2} />
                              <div>
                                <div style={{ fontSize:13, fontWeight:600, color:C.txt }}>{e.name}</div>
                                <div style={{ fontSize:10, color:C.sub, marginTop:2 }}>{years} year{years !== 1 ? 's' : ''} · joined {e.joined.split(" ").slice(1).join(" ")}</div>
                              </div>
                            </div>
                            {days === 0 ? (
                              <span style={{ fontSize:10, fontWeight:800, color:"#fff", background:C.p2, padding:"4px 10px", borderRadius:999 }}>Today</span>
                            ) : (
                              <div style={{ textAlign:"right" }}>
                                <div style={{ fontSize:11, fontWeight:700, color:C.p2 }}>In {days} day{days !== 1 ? 's' : ''}</div>
                                <div style={{ fontSize:9, color:C.sub, fontWeight:600 }}>C O U N T D O W N</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {page==="Vibe Check" && (
          <VibeCheckModule 
            isSA={isSA} isAdmin={isAdmin} me={me} employees={employees}
            vibeFeedback={vibeFeedback} setVibeFeedback={setVibeFeedback}
            toast={toast} C={C} narrow={narrow} pad={pad} padBottom={padBottom} heroPadStd={heroPadStd} Btn={Btn} Av={Av} Inp={Inp}
          />
        )}

        {page==="Presence" && (
          <PresenceModule 
            isSA={isSA} isAdmin={isAdmin} employees={employees} leaves={leaves} holidays={holidays} 
            attendanceMode={attendanceMode} setAttendanceMode={setAttendanceMode} 
            attendanceData={attendanceData} setAttendanceData={setAttendanceData} 
            isClockedIn={isClockedIn} setIsClockedIn={setIsClockedIn} 
            presenceEmpId={presenceEmpId} setPresenceEmpId={setPresenceEmpId} 
            presenceMonth={presenceMonth} setPresenceMonth={setPresenceMonth} 
            selectedADate={selectedADate} setSelectedADate={setSelectedADate} 
            slackTeamsPlatform={slackTeamsPlatform} setSlackTeamsPlatform={setSlackTeamsPlatform} 
            toast={toast} C={C} ME_ID={ME_ID} narrow={narrow} pad={pad} padBottom={padBottom} heroPadStd={heroPadStd} Btn={Btn} Av={Av} Inp={Inp}
          />
        )}

        {/* ─ EMPLOYEES / MY PROFILE ─ */}
        {onEmpProfilePage && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ maxWidth:640 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>
                    {isAdmin ? "◉ Directory" : "◉ You"}
                  </div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>{isAdmin ? "Employees" : "My Profile"}</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:520 }}>
                    {isAdmin ? `${employees.length} people at Bipolar Factory — open a row for the full profile.` : "Your details stay private; only you can see this page."}
                  </p>
                </div>
            {isAdmin && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"flex-end" }}>
                    <Btn variant="outline" onClick={() => { const csv = employeesToCSV(employees); downloadTextFile(`kinsphere-employees-${new Date().toISOString().slice(0,10)}.csv`, csv); toast("CSV exported ✓"); }}>Export CSV</Btn>
                    <Btn variant="outline" onClick={() => setShowImportCsv(true)}>Import CSV</Btn>
                    <Btn onClick={()=>setShowEmp(true)}>+ Add Employee</Btn>
                </div>
            )}
              </div>
            </div>
            {!isAdmin ? (
              <SettingsPanel label="Profile" title="Your details" accent={C.p}>
                <ProfileDetail
                  e={me}
                  empList={employees}
                  wrapCard={false}
                  narrow={narrow}
                  onEditBank={() => setBankPick(me.id)}
                  onPreviewDoc={(doc, emp) => setDocPreviewItem({ doc, emp })}
                />
                <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.bdr}` }}>
                  <Btn variant="outline" onClick={() => setShowUploadDoc(true)} style={{ borderColor: "#4a7c59", color: "#4a7c59" }}>+ Upload Document</Btn>
                </div>
              </SettingsPanel>
            ) : (
              <SettingsPanel label="Directory" title="Team members" accent={C.p}>
                {isAdmin && (
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
                                  {isAdmin && <span style={{ color:C.sub, fontSize:12 }}>↗</span>}
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
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ maxWidth:560 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>◷ Leave</div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>Time Away</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55 }}>
                    {isAdmin ? "Team calendar and approvals — hover a coloured date to see who’s out." : "Your leave in calendar and list views — apply when you need time off."}
                  </p>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {isAdmin && (
                    <div style={{ display:"flex", gap:10 }}>
                      <Btn variant="outline" onClick={()=>{ setPolicyDraft(JSON.parse(JSON.stringify(leavePolicy))); setShowLeavePolicy(true); }} style={{ padding:"10px 18px", color:C.sub, borderColor:C.bdr }}>Leave Policy</Btn>
                      <Btn variant="outline" onClick={()=>setShowLeaveBal(true)} style={{ padding:"10px 18px", color:C.sub, borderColor:C.bdr }}>Leave balance</Btn>
                    </div>
                  )}
                  <Btn variant="outline" onClick={()=>setShowHolidays(true)} style={{ padding:"10px 18px", color:C.p, borderColor:C.p }}>
                    {isAdmin ? "+ Add/View Holidays" : "View Holidays"}
                  </Btn>
                  <Btn onClick={()=>setShowLeave(true)} style={{ padding:"10px 18px" }}>+ Apply Leave</Btn>
                </div>
              </div>
            </div>
            {isAdmin ? (
              <>
                <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, padding:"14px 18px", marginBottom:18, boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                    <div style={{ display:"flex", justifyContent:"flex-start", flexShrink:0 }}>
                      <TabBar inline tabs={["Calendar","Table"]} active={lvViewMode} setActive={setLvViewMode} style={{ marginBottom:0 }} />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                      <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Legend:</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fef9c3", border:`1px solid ${C.bdr}` }} /> Pending</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#dcfce7", border:`1px solid ${C.bdr}` }} /> Approved</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fee2e2", border:`1px solid ${C.bdr}` }} /> Rejected</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#ffedd5", border:`1px solid ${C.bdr}` }} /> Mixed</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#e0e7ff", border:`1px solid ${C.bdr}` }} />🏖 Holiday</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#f3f4f6" }} /> Sunday (off)</span>
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
                          const isoStr = `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                          const isOff = isWeeklyOff(cellDate);
                          const isHoliday = !isOff && holidays.some(h => h.dISO === isoStr);
                          const holidayObj = holidays.find(h => h.dISO === isoStr);
                          const dayLeaves = leavesOnDate(leaves, cellDate);
                          let bg = saDayCellBg(isOff, dayLeaves);
                          if (isHoliday) bg = "#e0e7ff";
                          const tipLines = [
                            ...(isHoliday ? [`🏖 ${holidayObj?.n}${holidayObj?.desc ? ` — ${holidayObj.desc}` : ""}`] : []),
                            ...dayLeaves.map(l => `${l.emp} — ${l.type} (${l.status})`),
                          ];
                          const hasTooltip = tipLines.length > 0;
                          cells.push(
                            <div
                              key={`sa-${day}`}
                              title={isHoliday && !dayLeaves.length ? `${holidayObj?.n}` : undefined}
                              style={{
                                position:"relative",
                                minHeight:52, borderRadius:8, border:`1px solid ${isHoliday ? C.p : C.bdr}`,
                                background:bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                                fontSize:12, fontWeight:600, color:isOff ? C.bdr : C.txt,
                                cursor: hasTooltip ? "pointer" : "default",
                                transition:"box-shadow .12s",
                              }}
                              onMouseEnter={e=>{
                                if (!hasTooltip) return;
                                setSaCalTooltip({
                                  left: e.clientX + 12,
                                  top: e.clientY + 12,
                                  lines: tipLines,
                                });
                                e.currentTarget.style.boxShadow=`0 0 0 2px ${C.p}`;
                              }}
                              onMouseMove={e=>{
                                if (!hasTooltip) return;
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
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fef9c3", border:`1px solid ${C.bdr}` }} /> Pending</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#dcfce7", border:`1px solid ${C.bdr}` }} /> Approved</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#fee2e2", border:`1px solid ${C.bdr}` }} /> Rejected</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#ffedd5", border:`1px solid ${C.bdr}` }} /> Mixed</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#e0e7ff", border:`1px solid ${C.bdr}` }} />🏖 Holiday</span>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11 }}><span style={{ width:14, height:14, borderRadius:4, background:"#f3f4f6" }} /> Sunday (off)</span>
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
                    <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset" }}>
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
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:20, flexWrap:"wrap" }}>
                <div style={{ maxWidth:520 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>₹ Payroll</div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>Paydays</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55, maxWidth:480 }}>
                    {(isSA || (role === "Admin" && me.paydaysAccess)) ? (
                      <>
                        Company payslips, salary configuration, and net pay — credited on the 15th.
                        {role === "Admin" && me.paydaysAccess && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:C.p, background:`rgba(var(--p-rgb),.1)`, padding:"2px 6px", borderRadius:4, textTransform:"uppercase", verticalAlign:"middle" }}>Full Access</span>}
                      </>
                    ) : (
                      "Your payslips for the selected year — download when you need them."
                    )}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-end", flexWrap:"wrap" }}>
                    {(isSA || (role === "Admin" && me.paydaysAccess)) && pyTab === "All Payslips" && (
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
                    {(isSA || (role === "Admin" && me.paydaysAccess)) && pyTab === "All Payslips" && (
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
                  {(isSA || (role === "Admin" && me.paydaysAccess)) && pyTab === "All Payslips" && (
                    <Btn
                      style={{ padding: "8px 18px", fontSize: 13, background: "#fff", color: C.p, border: `1px solid ${C.p}`, boxShadow: "0 4px 12px rgba(0,0,0,.05)", width: "100%" }}
                      onClick={() => setReleaseStep(1)}
                    >
                      Release Payslips
                    </Btn>
                  )}
                </div>
              </div>
              

            </div>
            <div style={{ display:"flex", justifyContent:"flex-start", width:"100%", marginBottom:18 }}>
              <TabBar
                inline
                tabs={(isSA || (role === "Admin" && me.paydaysAccess)) ? ["All Payslips", "Salary Configuration"] : ["My Payslips"]}
                active={pyTab}
                setActive={setPyTab}
                style={{ marginBottom:0 }}
              />
            </div>
            {(pyTab==="All Payslips"||pyTab==="My Payslips") ? (
              (isSA || (role === "Admin" && me.paydaysAccess)) ? (
                <>
                  <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset" }}>
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
                      borderRadius:16, overflow:"hidden", boxShadow:"0 2px 14px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
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
              <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset" }}>
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

        {/* ─ PAPERWORK HUB ─ */}
        {page==="Paperwork Hub" && (() => {
          const canGenerate = isSA;
          const canSeeAll   = isSA;

          const visiblePapers = canSeeAll ? papers : papers.filter(d => d.empId === ME_ID);
          const filteredPapers = paperFilter === "All" ? visiblePapers : visiblePapers.filter(d => d.type === paperFilter);

          const toggleOffboardTask = (itemId, taskIndex) => {
            setOffboardingItems(prev => prev.map(item => {
              if (item.id !== itemId) return item;
              const nextChecklist = [...item.checklist];
              const cur = nextChecklist[taskIndex].status;
              const nextStatus = cur === "Pending" ? "In Progress" : cur === "In Progress" ? "Completed" : "Pending";
              nextChecklist[taskIndex] = { 
                ...nextChecklist[taskIndex], 
                status: nextStatus,
                date: nextStatus === "Completed" ? new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : (nextStatus === "Pending" ? "-" : "Today")
              };
              
              const completed = nextChecklist.filter(c => c.status === "Completed").length;
              const newProgress = Math.round((completed / nextChecklist.length) * 100);
              
              return { 
                ...item, 
                checklist: nextChecklist, 
                progress: newProgress,
                status: newProgress === 100 ? "Completed" : "In Progress",
                lastAction: `Checklist updated: ${nextChecklist[taskIndex].name} → ${nextStatus}`
              };
            }));
          };

          return (
            <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
              {/* ── Hero ── */}
              <div style={{
                position:"relative", margin:`0 ${-pad}px 28px`, padding: heroPadStd,
                background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
                borderBottom:`1px solid ${C.bdr}`, overflow:"hidden",
              }}>
                <div style={{ position:"absolute", right:-40, top:-30, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`, pointerEvents:"none" }} />
                <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:16, flexWrap:"wrap" }}>
                  <div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10, padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`, fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase" }}>📄 Document Centre</div>
                    <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em" }}>Paperwork Hub</h1>
                  </div>

                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    {isSA && (
                      <Btn variant="outline" onClick={() => setShowTplManage(true)} style={{ padding:"8px 16px", borderRadius:10, fontSize:12 }}>
                        ⚙ Manage Templates
                      </Btn>
                    )}
                    {canGenerate && (
                      <div style={{ display:"flex", background:C.wht, borderRadius:12, padding:4, border:`1px solid ${C.bdr}`, boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                        <button onClick={()=>setPaperTab("Documents")} style={{ padding:"8px 16px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight: paperTab==="Documents"?700:500, background: paperTab==="Documents"?C.p:"transparent", color: paperTab==="Documents"?"#fff":C.sub, transition:"all .2s" }}>Documents</button>
                        <button onClick={()=>setPaperTab("Generate")}  style={{ padding:"8px 16px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight: paperTab==="Generate"?700:500,  background: paperTab==="Generate"?C.p:"transparent",  color: paperTab==="Generate"?"#fff":C.sub,  transition:"all .2s" }}>Generate</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* ── Tab Content: Documents ── */}
              {paperTab === "Documents" && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:12 }}>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {["All", "Offer Letter", "Appointment Letter", "Payslip", "NDA", "Other"].map(f => (
                        <button key={f} onClick={() => setPaperFilter(f)} style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${paperFilter === f ? C.p : C.bdr}`, background: paperFilter === f ? `rgba(var(--p-rgb),.1)` : C.wht, color: paperFilter === f ? C.p : C.sub, fontSize:11, fontWeight:600, cursor:"pointer" }}>{f}</button>
                      ))}
                    </div>
                    {canGenerate && (
                      <Btn onClick={() => { setPaperForm({ name:"", empId: isSA ? "" : String(ME_ID), type:"Offer Letter", fileName:"" }); setPaperModal(true); }}>
                        <span style={{ marginRight:6 }}>+</span> Upload Document
                      </Btn>
                    )}
                  </div>

                  <div style={{ background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(var(--shadow-rgb),.05)" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:C.surf }}>
                          {["Document Name", "Person", "Type", "Status", "Date", ""].map(h => (
                            <th key={h} style={{ padding:"12px 16px", textAlign:"left", color:C.sub, fontWeight:700, fontSize:10, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPapers.map((doc) => {
                          const docEmp = employees.find(e => e.id === doc.empId);
                          const docCand = candidates.find(c => c.id === doc.candidateId);
                          return (
                            <tr key={doc.id} style={{ borderBottom:`1px solid ${C.surf}` }}>
                              <td style={{ padding:"14px 16px" }}>
                                <div style={{ fontWeight:600, color:C.txt }}>{doc.name}</div>
                                <div style={{ fontSize:11, color:C.sub }}>{doc.fileName || "Generated.docx"}</div>
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                {docEmp ? (
                                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <Av ini={docEmp.ini} sz={24} />
                                    <span style={{ fontSize:12 }}>{docEmp.name}</span>
                                  </div>
                                ) : docCand ? (
                                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <div style={{ width:24, height:24, borderRadius:"50%", background:C.mid, color:C.sub, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{docCand.name[0]}</div>
                                    <span style={{ fontSize:12 }}>{docCand.name} (Cand.)</span>
                                  </div>
                                ) : doc.externalEmail ? (
                                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <div style={{ width:24, height:24, borderRadius:"50%", background:"#e0f2fe", color:"#0284c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>@</div>
                                    <span style={{ fontSize:12 }}>{doc.externalEmail} (External)</span>
                                  </div>
                                ) : "—"}
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                <span style={{ fontSize:11, color:C.sub, background:C.surf, padding:"2px 8px", borderRadius:6 }}>{doc.type}</span>
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                {doc.status === "signed" ? (
                                  <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", background:"#dcfce7", padding:"3px 8px", borderRadius:5 }}>SIGNED</span>
                                ) : doc.status === "sent" ? (
                                  <span style={{ fontSize:10, fontWeight:700, color:C.p, background:`rgba(var(--p-rgb),.1)`, padding:"3px 8px", borderRadius:5 }}>SENT</span>
                                ) : (
                                  <span style={{ fontSize:10, fontWeight:700, color:C.sub, background:C.bg, padding:"3px 8px", borderRadius:5, border:`1px solid ${C.bdr}` }}>DRAFT</span>
                                )}
                              </td>
                              <td style={{ padding:"14px 16px", fontSize:12, color:C.sub }}>{doc.date}</td>
                              <td style={{ padding:"14px 16px", textAlign:"right" }}>
                                {doc.status === "signed" ? (
                                  <button onClick={() => { 
                                    toast(`Downloading securely: ${doc.name}.pdf...`);
                                    const dummyBlob = new Blob(["KinSphere Simulated Signed Document\n\nTitle: ", doc.name, "\nDate: ", doc.date], {type: "application/pdf"});
                                    const dummyUrl = URL.createObjectURL(dummyBlob);
                                    const link = document.createElement("a");
                                    link.href = dummyUrl;
                                    link.download = `${doc.name.replace(/\s+/g,'_')}_Signed.pdf`;
                                    link.click();
                                  }} style={{ background:"#f0fdf4", border:`1px solid #bbf7d0`, borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, color:"#16a34a", cursor:"pointer", boxShadow:"0 2px 5px rgba(0,0,0,.05)" }}>Download ⬇</button>
                                ) : doc.status === "sent" ? (
                                  <button onClick={() => { toast("Simulating Secure Portal: This is what the recipient sees from their email link!"); setSignId(doc.id); }} style={{ background:C.p, border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, color:"#2a3326", cursor:"pointer", boxShadow:"0 2px 5px rgba(0,0,0,.1)" }}>Simulate Recipient 👁</button>
                                ) : doc.status === "draft" && isSA ? (
                                  <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                                    <button onClick={() => setViewingDoc(doc)} style={{ background:"none", border:`1px solid ${C.bdr}`, borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:600, color:C.p, cursor:"pointer" }}>Look 👁</button>
                                    <button onClick={() => {
                                      const linkId = Math.random().toString(36).substring(7);
                                      const link = `https://sign.kinsphere.app/doc/${linkId}`;
                                      setPapers(papers.map(p => p.id === doc.id ? { ...p, status:"sent", sendLink: link } : p));
                                      toast(`Document "${doc.name}" sent successfully ✓`);
                                    }} style={{ background:"#f0fdf4", border:`1px solid #bbf7d0`, borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:700, color:"#16a34a", cursor:"pointer" }}>Send ✉</button>
                                    <button onClick={() => {
                                      if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
                                        setPapers(papers.filter(p => p.id !== doc.id));
                                        toast("Document deleted ✓");
                                      }
                                    }} style={{ background:"none", border:`1px solid rgba(220,38,38,.2)`, borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:600, color:"#dc2626", cursor:"pointer" }}>Delete 🗑</button>
                                  </div>
                                ) : doc.sendLink ? (
                                  <button onClick={() => { navigator.clipboard.writeText(doc.sendLink); toast("Link copied to clipboard ✓"); }} style={{ background:"none", border:`1px solid ${C.bdr}`, borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:600, color:C.p, cursor:"pointer" }}>Copy Link</button>
                                ) : (
                                  <span style={{ fontSize:10, color:C.bdr }}>—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {filteredPapers.length === 0 && (
                          <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:C.sub, fontSize:12 }}>No documents found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </>
              )}

              {viewingDoc && (
                <Modal title="Document Preview" onClose={() => setViewingDoc(null)} width={600}>
                  <div style={{ padding:10 }}>
                    <div style={{ textAlign:"center", marginBottom:24 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:2, marginBottom:4 }}>PREVIEW MODE</div>
                      <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:20 }}>{viewingDoc.name}</h2>
                      <div style={{ fontSize:11, color:C.sub, marginTop:4 }}>{viewingDoc.fileName || "Generated Preview"}</div>
                    </div>
                    <div style={{ background:C.surf, padding:24, borderRadius:12, border:`1px solid ${C.bdr}` }}>
                      <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia, serif", fontSize:14, lineHeight:1.8, color:C.txt, margin:0 }}>
                        {viewingDoc.filledBody || "This is a draft version of the document. Full body text will appear once all fields are populated in the generation flow."}
                      </pre>
                    </div>
                    <div style={{ marginTop:24, display:"flex", justifyContent:"center" }}>
                      <Btn onClick={() => setViewingDoc(null)}>Close Preview</Btn>
                    </div>
                  </div>
                </Modal>
              )}

              {/* ── Tab Content: Generate ── */}
              {paperTab === "Generate" && (
                <div style={{ maxWidth:800, margin:"0 auto" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:30, marginBottom:32 }}>
                    {[1,2,3].map(s => (
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:8, opacity: genStep >= s ? 1 : 0.4 }}>
                        <div style={{ width:24, height:24, borderRadius:"50%", background: genStep === s ? C.p : (genStep > s ? C.p2 : C.mid), color: genStep === s ? "#2a3326" : (genStep > s ? "#fff" : C.sub), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{s}</div>
                        <div style={{ fontSize:11, fontWeight:700, color: genStep === s ? C.txt : C.sub }}>{s===1?"Template":s===2?"Live Edit":"Dispatch"}</div>
                        {s < 3 && <div style={{ width:40, height:2, background:C.bdr }} />}
                      </div>
                    ))}
                  </div>

                  {genStep === 1 && (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:20 }}>
                      {templates.map(tpl => (
                        <Card key={tpl.id} onClick={() => { setGenTemplate(tpl); setGenStep(2); }} style={{ cursor:"pointer", transition:"transform .2s, border-color .2s", border:`1px solid ${genTemplate?.id === tpl.id ? C.p : C.bdr}`, background: genTemplate?.id === tpl.id ? `rgba(var(--p-rgb),.05)` : C.wht }}>
                          <div style={{ fontSize:24, marginBottom:12 }}>{tpl.type==="Payslip"?"📊":tpl.type==="Offer Letter"?"✉️":"📄"}</div>
                          <div style={{ fontWeight:700, fontSize:15, color:C.txt, marginBottom:4 }}>{tpl.name}</div>
                          <div style={{ fontSize:11, color:C.sub }}>{tpl.type}</div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {genStep === 2 && (
                    <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:24, alignItems:"start", maxWidth:1100, margin:"0 auto" }}>
                      <Card style={{ padding:24 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.txt, marginBottom:20 }}>Document Fields</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:16, maxHeight:500, overflow:"auto", paddingRight:4 }}>
                          {!genTemplate || getPlaceholders(genTemplate.body).length === 0 ? (
                             <div style={{ fontSize:12, color:C.sub }}>No dynamic fields required.</div>
                          ) : getPlaceholders(genTemplate.body).map(field => (
                            <div key={field}>
                              <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>{field.toUpperCase().replace(/_/g, " ")}</label>
                              <input 
                                placeholder={`Enter ${field.replace(/_/g, " ")}...`}
                                value={genVals[field] || ""}
                                onChange={(e: any) => setGenVals({ ...genVals, [field]: e.target.value })}
                                style={{ width:"100%", padding:10, borderRadius:8, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:13 }}
                              />
                            </div>
                          ))}
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:24, paddingTop:16, borderTop:`1px solid ${C.surf}` }}>
                          <Btn variant="ghost" onClick={() => setGenStep(1)}>← Back</Btn>
                          <Btn onClick={() => {
                            setGenFilledBody(fillTemplate(genTemplate.body, genVals));
                            setGenStep(3);
                          }}>Next: Dispatch →</Btn>
                        </div>
                      </Card>

                      <Card style={{ padding:"32px 40px", borderStyle:"dashed", background:`linear-gradient(to bottom, #fff 0%, ${C.bg} 100%)` }}>
                         <div style={{ textAlign:"center", marginBottom:30 }}>
                           <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:2, marginBottom:4 }}>LIVE PREVIEW</div>
                           <h2 style={{ margin:0, fontFamily:"Georgia,serif", fontSize:20 }}>{genTemplate?.name}</h2>
                         </div>
                         <pre style={{ whiteSpace:"pre-wrap", fontFamily:"Georgia, serif", fontSize:14, lineHeight:1.8, color:C.txt, margin:0 }}>
                           {fillTemplate(genTemplate.body, genVals)}
                         </pre>
                      </Card>
                    </div>
                  )}

                  {genStep === 3 && (
                    <Card style={{ padding:32, maxWidth:600, margin:"0 auto" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.txt }}>Recipient & Dispatch</div>
                        <div style={{ display:"flex", gap:4, background:C.surf, padding:3, borderRadius:10 }}>
                          <button onClick={() => setGenRecipientType("employee")} style={{ border:"none", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:600, cursor:"pointer", background: genRecipientType==="employee"?C.wht:"transparent", color: genRecipientType==="employee"?C.p:C.sub, boxShadow: genRecipientType==="employee"?"0 1px 3px rgba(0,0,0,.08)":"" }}>Internal Employee</button>
                          <button onClick={() => setGenRecipientType("external")} style={{ border:"none", borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:600, cursor:"pointer", background: genRecipientType==="external"?C.wht:"transparent", color: genRecipientType==="external"?C.p:C.sub, boxShadow: genRecipientType==="external"?"0 1px 3px rgba(0,0,0,.08)":"" }}>External Email</button>
                        </div>
                      </div>

                      {genRecipientType === "employee" && (
                        <div style={{ marginBottom:20 }}>
                          <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:8, letterSpacing:.5 }}>SELECT EMPLOYEE</label>
                          <select value={genEmpId} onChange={(e: any) => setGenEmpId(e.target.value)} style={{ width:"100%", padding:12, borderRadius:10, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:13 }}>
                            <option value="">Choose an employee...</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name} — {e.designation}</option>)}
                          </select>
                        </div>
                      )}

                      {genRecipientType === "external" && (
                        <div style={{ marginBottom:20 }}>
                          <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:8, letterSpacing:.5 }}>EXTERNAL EMAIL ADDRESS</label>
                          <input 
                            placeholder="e.g. hello@example.com"
                            value={genExternalEmail}
                            onChange={(e: any) => setGenExternalEmail(e.target.value)}
                            style={{ width:"100%", padding:12, borderRadius:10, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:13 }}
                          />
                        </div>
                      )}

                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:32, paddingTop:24, borderTop:`1px solid ${C.surf}` }}>
                        <Btn variant="ghost" onClick={() => setGenStep(2)}>← Back</Btn>
                        <Btn onClick={() => {
                          const linkId = Math.random().toString(36).substring(7);
                          const link = `https://sign.kinsphere.app/doc/${linkId}`;
                          const newDoc: any = {
                            id: `doc-${Date.now()}`,
                            name: genTemplate.name,
                            empId: genRecipientType === "employee" ? Number(genEmpId) : null,
                            candidateId: null,
                            externalEmail: genRecipientType === "external" ? genExternalEmail : null,
                            type: genTemplate.type,
                            date: "Today",
                            status: "sent",
                            sendLink: link,
                            filledBody: genFilledBody,
                          };
                          setPapers([newDoc, ...papers]);
                          toast(`Email securely dispatched to ${genRecipientType === 'external' ? genExternalEmail : (employees.find(e => e.id === Number(genEmpId))?.name || 'employee')} ✓`);
                          setPaperTab("Documents");
                          resetGen();
                        }}>✉ Generate & Email</Btn>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {paperModal && (
                <Modal title="Upload Document" onClose={() => setPaperModal(false)} width={440}>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>DOCUMENT NAME</label>
                    <input placeholder="e.g. Offer Letter — Priya" value={paperForm.name} onChange={(e: any)=>setPaperForm({...paperForm, name:e.target.value})} style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12 }} />
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>LINK TO PERSON</label>
                    <select value={paperForm.empId} onChange={(e: any)=>setPaperForm({...paperForm, empId:e.target.value})} style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12 }}>
                      <option value="">Select recipient…</option>
                      <optgroup label="Employees">
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </optgroup>
                      <optgroup label="Candidates">
                        {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </optgroup>
                    </select>
                  </div>
                  <div style={{ marginBottom:20 }}>
                     <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>FILE</label>
                     <div onClick={()=>setPaperForm({...paperForm, fileName:"uploaded_doc.pdf"})} style={{ width:"100%", padding:20, borderRadius:10, border:`2px dashed ${C.bdr}`, background:C.surf, textAlign:"center", cursor:"pointer" }}>
                       {paperForm.fileName ? <span style={{ color:C.p, fontWeight:700 }}>📎 {paperForm.fileName}</span> : <span style={{ color:C.sub }}>Click to select file</span>}
                     </div>
                  </div>
                  <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                    <Btn variant="ghost" onClick={() => setPaperModal(false)}>Cancel</Btn>
                    <Btn onClick={() => {
                      if (!paperForm.name || !paperForm.fileName) return toast("Fill all fields");
                      setPapers([{ id:`up-${Date.now()}`, name:paperForm.name, empId:Number(paperForm.empId)||null, type:paperForm.type, date:"Today", fileName:paperForm.fileName, status:"draft" }, ...papers]);
                      setPaperModal(false);
                      toast("Document uploaded ✓");
                    }}>Upload</Btn>
                  </div>
                </Modal>
              )}

              {/* ─ TEMPLATE MANAGER (SUPER ADMIN) ─ */}
              {showTplManage && (
                <Modal title="Manage Templates" onClose={() => { setShowTplManage(false); setTplStep(1); setTplTab("Library"); setTplForm({ id:"", name:"", type:"Other", body:"", fileName:"" }); }} width={tplStep === 2 ? 650 : 500}>
                  {tplStep === 1 && (
                    <>
                      <div style={{ display:"flex", background:C.surf, borderRadius:12, padding:4, border:`1px solid ${C.bdr}`, marginBottom:20 }}>
                        <button onClick={()=>setTplTab("Library")} style={{ flex:1, padding:"10px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight: tplTab==="Library"?700:500, background: tplTab==="Library"?C.wht:"transparent", boxShadow: tplTab==="Library"?"0 2px 6px rgba(0,0,0,.05)":"none", color: tplTab==="Library"?C.txt:C.sub, transition:"all .2s" }}>Template Library</button>
                        <button onClick={()=>setTplTab("Upload")}  style={{ flex:1, padding:"10px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight: tplTab==="Upload"?700:500,  background: tplTab==="Upload"?C.wht:"transparent", boxShadow: tplTab==="Upload"?"0 2px 6px rgba(0,0,0,.05)":"none",  color: tplTab==="Upload"?C.txt:C.sub,  transition:"all .2s" }}>Upload New</button>
                      </div>

                      {tplTab === "Upload" && (
                        <div>
                          <div style={{ marginBottom:20 }}>
                            <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:C.txt }}>Create New Template</h3>
                            <p style={{ fontSize:12, color:C.sub, margin:0, lineHeight:1.45 }}>Upload a PDF or Word document to be used as a template. Our system will extract the text so you can map dynamic fields.</p>
                          </div>

                          <div style={{ marginBottom:14 }}>
                            <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>TEMPLATE NAME</label>
                            <input placeholder="e.g. Standard NDA 2026" value={tplForm.name} onChange={e=>setTplForm({...tplForm, name:e.target.value})} style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12 }} />
                          </div>
                          <div style={{ marginBottom:14 }}>
                            <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>CATEGORY</label>
                            <select value={tplForm.type} onChange={e=>setTplForm({...tplForm, type:e.target.value})} style={{ width:"100%", padding:"9px 11px", borderRadius:9, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12 }}>
                              {["Offer Letter", "Appointment Letter", "NDA", "Appraisal", "Other"].map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>

                          <div style={{ marginBottom:10 }}>
                             <label style={{ fontSize:10, fontWeight:700, color:C.sub, display:"block", marginBottom:5, letterSpacing:.5 }}>DOCUMENT FILE (.pdf, .docx, .txt)</label>
                             <input 
                               type="file" 
                               id="tpl-upload-input" 
                               accept=".pdf,.docx,.doc,.txt" 
                               style={{ display:"none" }}
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (!file) return;
                                 toast("Processing document: " + file.name + "...");
                                 
                                 const fileUrl = URL.createObjectURL(file);
                                 if (file.name.endsWith(".txt")) {
                                   const reader = new FileReader();
                                   reader.onload = (ev) => {
                                     setTplForm({...tplForm, fileName: file.name, body: ev.target.result, pdfUrl: fileUrl});
                                     setTimeout(() => setTplStep(2), 800);
                                   };
                                   reader.readAsText(file);
                                 } else {
                                   // For PDFs/Word docs in frontend prototype, use sample extraction
                                   setTplForm({...tplForm, fileName: file.name, body: "[[ ⚠ Prototype Demo Note: Real PDF extraction requires the backend OCR which is not yet connected to this frontend mock. ]]\n\nDear [Candidate Name],\n\nWe are pleased to offer you the position of [Job Title] at KinSphere.\nYour starting salary will be [Salary] per year, beginning on [Start Date].\n\nBest,\nThe HR Team", pdfUrl: fileUrl});
                                   setTimeout(() => setTplStep(2), 1500);
                                 }
                               }}
                             />
                             <div onClick={() => {
                               if (!tplForm.name) return toast("Please enter a template name first.");
                               document.getElementById('tpl-upload-input')?.click();
                             }} style={{ width:"100%", padding:24, borderRadius:12, border:`2px dashed ${C.bdr}`, background:C.surf, textAlign:"center", cursor:"pointer", transition:"all .2s" }}>
                               {tplForm.fileName ? <span style={{ color:C.p, fontWeight:700, fontSize:13 }}>📄 {tplForm.fileName} uploaded</span> : <span style={{ color:C.sub, fontSize:12, fontWeight:500 }}>Drop file here or browse from your computer</span>}
                             </div>
                          </div>
                        </div>
                      )}

                      {tplTab === "Library" && (
                        <div>
                          <div style={{ marginBottom:20 }}>
                            <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 4px", color:C.txt }}>Template Library</h3>
                            <p style={{ fontSize:12, color:C.sub, margin:0, lineHeight:1.45 }}>Click on any organization template below to review its contents or modify the dynamic generation fields.</p>
                          </div>
                          
                          <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:320, overflow:"auto", paddingBottom:10 }}>
                            {templates.map(t => (
                              <div 
                                key={t.id} 
                                onClick={() => {
                                  setTplForm({ ...t, fileName: t.name + ".pdf" });
                                  setTplStep(2);
                                }}
                                style={{ padding:"14px 18px", border:`1px solid ${C.bdr}`, borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", background:C.wht, transition:"all .2s", boxShadow:"0 2px 6px rgba(0,0,0,.02)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.p; e.currentTarget.style.transform = "translateY(-1px)" }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.transform = "translateY(0)" }}
                              >
                                <div>
                                  <div style={{ fontSize:14, fontWeight:700, color:C.txt, marginBottom:2 }}>{t.name}</div>
                                  <div style={{ fontSize:11, color:C.sub, display:"flex", alignItems:"center", gap:6 }}>
                                    <span style={{ background:C.surf, padding:"2px 6px", borderRadius:4, fontWeight:600 }}>{t.type}</span>
                                    <span>•</span>
                                    {t.fields?.length || 0} dynamic fields
                                  </div>
                                </div>
                                <div style={{ display:"flex", gap:10 }}>
                                  <span onClick={(e) => { e.stopPropagation(); setTplViewPdf(t.pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"); }} style={{ fontSize:12, color:C.txt, fontWeight:700, background:`rgba(0,0,0,.05)`, padding:"6px 12px", borderRadius:6, transition:"all .15s" }} onMouseEnter={e=>e.currentTarget.style.background=`rgba(0,0,0,.09)`} onMouseLeave={e=>e.currentTarget.style.background=`rgba(0,0,0,.05)`}>👁 View PDF</span>
                                  <span onClick={() => { setTplForm({ ...t, fileName: t.name + ".pdf" }); setTplStep(2); }} style={{ fontSize:12, color:C.p, fontWeight:700, background:`rgba(var(--p-rgb),.1)`, padding:"6px 12px", borderRadius:6, transition:"all .15s" }} onMouseEnter={e=>e.currentTarget.style.background=`rgba(var(--p-rgb),.15)`} onMouseLeave={e=>e.currentTarget.style.background=`rgba(var(--p-rgb),.1)`}>Edit ✎</span>
                                  <span onClick={(e) => { e.stopPropagation(); setTemplates(prev => prev.filter(x => x.id !== t.id)); toast(`Template "${t.name}" deleted.`); }} style={{ fontSize:12, color:"#dc2626", fontWeight:700, background:`#fee2e2`, padding:"6px 12px", borderRadius:6, transition:"all .15s" }} onMouseEnter={e=>e.currentTarget.style.background=`#fecaca`} onMouseLeave={e=>e.currentTarget.style.background=`#fee2e2`}>🗑 Delete</span>
                                </div>
                              </div>
                            ))}
                            {templates.length === 0 && (
                              <div style={{ padding:30, textAlign:"center", color:C.sub, fontSize:13, border:`1px dashed ${C.bdr}`, borderRadius:10 }}>
                                No templates found in the library. Go to the Upload tab to add one!
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {tplStep === 2 && (
                    <>
                      <div style={{ marginBottom:16 }}>
                        <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 6px", color:C.txt }}>Map Dynamic Fields</h3>
                        <p style={{ fontSize:12, color:C.sub, margin:0, lineHeight:1.45 }}>Text extracted successfully from <strong style={{color:C.txt}}>{tplForm.fileName}</strong>.</p>
                      </div>

                      <div style={{ padding:14, borderRadius:8, background:"#f0fdf4", border:"1px solid #bbf7d0", marginBottom:16 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#166534" }}>💡 HOW TO ADD FIELDS</div>
                          <Btn variant="outline" onClick={() => {
                            let newBody = tplForm.body;
                            // AI Simulation: Convert [Field] to {{field}} and detect currency
                            newBody = newBody.replace(/\[([^\]]+)\]/g, (match, p1) => `{{${p1.replace(/\s+/g, '')}}}`);
                            toast("✨ AI Detection Complete! Found potential dynamic fields.");
                            setTplForm(f => ({...f, body: newBody}));
                          }} style={{ padding:"4px 10px", fontSize:10, borderRadius:6, borderColor:"#166534", color:"#166534", background:"#dcfce7" }}>✨ Auto-Detect Fields (AI)</Btn>
                        </div>
                        <div style={{ fontSize:11, color:"#15803d", lineHeight:1.5 }}>
                          Replace static text with double curly braces (or square brackets if using Auto-Detect) to create a dynamic field.<br/>
                          Example: Replace "John Doe" with <strong style={{background:"rgba(255,255,255,.5)", padding:"1px 4px", borderRadius:4}}>{"{{CandidateName}}"}</strong>.
                        </div>
                      </div>

                      <div style={{ marginBottom:20 }}>
                        <textarea 
                          value={tplForm.body}
                          onChange={e => setTplForm(f => ({...f, body: e.target.value}))}
                          style={{ width:"100%", height:240, padding:14, borderRadius:10, border:`1px solid ${C.bdr}`, fontFamily:"monospace", fontSize:13, lineHeight:1.6, resize:"vertical", boxSizing:"border-box", background:C.surf }}
                          placeholder={"Type or paste your template text here...\n\nHello {{candidateName}},\nWelcome to the team!"}
                        />
                      </div>

                      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                        <Btn variant="ghost" onClick={() => { setTplStep(1); setTplTab("Library"); }}>Cancel</Btn>
                        <Btn onClick={() => {
                          const rx = /\{\{([^}]+)\}\}/g;
                          const matches = Array.from(tplForm.body.matchAll(rx)).map(m => m[1]);
                          const uniqueFields = [...new Set(matches)];
                          setTplExtracted(uniqueFields);
                          setTplStep(3);
                        }}>Next: Confirm Criteria →</Btn>
                      </div>
                    </>
                  )}

                  {tplStep === 3 && (
                    <>
                      <div style={{ marginBottom:20 }}>
                        <h3 style={{ fontSize:15, fontWeight:700, margin:"0 0 6px", color:C.txt }}>Confirm Generation Criteria</h3>
                        <p style={{ fontSize:12, color:C.sub, margin:0, lineHeight:1.45 }}>We found <strong style={{color:C.txt}}>{tplExtracted.length}</strong> fields in your template. These will be required when a user generates this document.</p>
                      </div>

                      {tplExtracted.length > 0 ? (
                        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                          {tplExtracted.map(f => (
                            <div key={f} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", border:`1px solid ${C.bdr}`, borderRadius:8, background:C.surf }}>
                              <span style={{ fontSize:14, color:C.p }}>{"{{"}</span>
                              <span style={{ fontSize:13, fontWeight:700, color:C.txt, flex:1 }}>{f}</span>
                              <span style={{ fontSize:14, color:C.p }}>{"}}"}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding:20, borderRadius:8, background:C.surf, border:`1px solid ${C.bdr}`, color:C.sub, fontSize:12, marginBottom:24, textAlign:"center" }}>
                          No dynamic fields `{"{{field_name}}"}` found. This template will generate exactly as written.
                        </div>
                      )}

                      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                        <Btn variant="ghost" onClick={() => setTplStep(2)}>← Back to Map Fields</Btn>
                        <Btn onClick={() => {
                          const newTpl = {
                            id: tplForm.id || `tpl-${Date.now()}`,
                            name: tplForm.name,
                            type: tplForm.type,
                            fields: tplExtracted,
                            body: tplForm.body,
                            pdfUrl: tplForm.pdfUrl
                          };
                          setTemplates(prev => [newTpl, ...prev.filter(x => x.id !== newTpl.id)]);
                          setShowTplManage(false);
                          setTplStep(1);
                          setTplTab("Library");
                          setTplForm({ id:"", name:"", type:"Other", body:"", fileName:"" });
                          toast(`Template "${newTpl.name}" created ✓`);
                        }}>Save Template</Btn>
                      </div>
                    </>
                  )}
                </Modal>
              )}

              {/* ─ PDF NATIVE PREVIEW VIEWER ─ */}
              {tplViewPdf && (
                <Modal title="Original Document" onClose={() => setTplViewPdf(null)} width={800}>
                  <div style={{ height:600, background:"#f0f0f0", borderRadius:10, overflow:"hidden", border:`1px solid ${C.bdr}` }}>
                    <iframe src={tplViewPdf} style={{ width:"100%", height:"100%", border:"none" }} title="Original PDF"></iframe>
                  </div>
                </Modal>
              )}
            </div>
          );
        })()}

      <div style={{ display:"none" }}>{paperTemplatePreview}</div>

        {/* ─ RECOGNITION ─ */}
        {page==="Recognition" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:640 }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
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
                  Public shout-outs for everyone to see — now with reactions, tags, and private notes.
                </p>
              </div>
            </div>

            {/* ─ MONTHLY HIGHLIGHTS ─ */}
            <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap:20, marginBottom:28 }}>
              <Card style={{ padding:"18px 22px", background:`linear-gradient(145deg, ${C.wht} 0%, ${C.bg} 100%)`, boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.p, letterSpacing:1, marginBottom:12 }}>🏆 TOP RECOGNISED</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {recogHighlights.topRecognised.map((h, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av ini={h.ini} sz={28} />
                        <span style={{ fontWeight:600, fontSize:13, color:C.txt }}>{h.name}</span>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:C.sub }}>{h.count} shout-out{h.count>1?'s':''}</span>
                    </div>
                  ))}
                  {recogHighlights.topRecognised.length === 0 && <div style={{ fontSize:12, color:C.sub }}>No highlights yet this month.</div>}
                </div>
              </Card>
              <Card style={{ padding:"18px 22px", background:`linear-gradient(145deg, ${C.wht} 0%, ${C.bg} 100%)`, boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.p2, letterSpacing:1, marginBottom:12 }}>🚀 MOST ACTIVE RECOGNISERS</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {recogHighlights.topGivers.map((h, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Av ini={h.ini} sz={28} bg={C.p2} />
                        <span style={{ fontWeight:600, fontSize:13, color:C.txt }}>{h.name}</span>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:C.sub }}>{h.count} shared</span>
                    </div>
                  ))}
                  {recogHighlights.topGivers.length === 0 && <div style={{ fontSize:12, color:C.sub }}>Start recognizing teammate to see highlights!</div>}
                </div>
              </Card>
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
                <Inp 
                  label="Recognise someone" 
                  opts={["Choose a teammate…",...employees.filter(e=>e.name!==me.name).map(e=>e.name)]} 
                  value={recogTo}
                  onChange={e=>setRecogTo(e.target.value)}
                />
                <Inp 
                  label="What did they do?" 
                  type="textarea" 
                  placeholder="Share what they did that made a difference…" 
                  value={recogMsg}
                  onChange={e=>setRecogMsg(e.target.value)}
                />
                
                {/* Tags & Privacy */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap", marginTop:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5 }}>TAGS:</span>
                    {RECO_TAGS.map(t => (
                      <button 
                        key={t}
                        onClick={() => {
                          if (newRecogTags.includes(t)) setNewRecogTags(p => p.filter(x => x !== t));
                          else if (newRecogTags.length < 2) setNewRecogTags(p => [...p, t]);
                        }}
                        style={{
                          padding:"4px 10px", borderRadius:6, fontSize:10, fontWeight:600, cursor:"pointer",
                          border:`1px solid ${newRecogTags.includes(t) ? C.p : C.bdr}`,
                          background: newRecogTags.includes(t) ? `rgba(var(--p-rgb),.12)` : "transparent",
                          color: newRecogTags.includes(t) ? C.p : C.sub,
                          transition: "all .2s"
                        }}
                      >{t}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", userSelect:"none" }}>
                      <input type="checkbox" checked={isPrivateRecog} onChange={e=>setIsPrivateRecog(e.target.checked)} style={{ cursor:"pointer" }} />
                      <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Private Recognition</span>
                    </label>
                  </div>
                </div>

                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16, paddingTop:16, borderTop:`1px solid ${C.surf}` }}>
                  <Btn onClick={handlePostRecog} style={{ padding:"10px 22px", minWidth:140 }}>Post shout-out</Btn>
                </div>
              </div>
            </div>

                      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {recogs.filter(r => !r.isPrivate || r.from === me.name || r.to === me.name).map((r,i)=>(
                <div
                  key={r.id || i}
                  style={{
                    position:"relative",
                    background:C.wht,
                    borderRadius:16,
                    border:`1px solid ${C.bdr}`,
                    overflow:"hidden",
                    boxShadow:"0 2px 14px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
                  }}
                >
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background:i % 2 === 0 ? C.p : C.p2, borderRadius:"4px 0 0 4px" }} />
                  <div style={{ padding:"16px 18px 18px 22px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:14, flexWrap:"wrap" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:C.p }}>SHOUT-OUT</div>
                        {r.isPrivate && (
                          <span style={{ fontSize:10, fontWeight:700, color:"#92400e", background:"#fef3c7", padding:"3px 8px", borderRadius:6 }}>🔒 PRIVATE</span>
                        )}
                      </div>
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

                    {/* Tags */}
                    {r.tags && r.tags.length > 0 && (
                      <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
                        {r.tags.map(t=>(
                          <span key={t} style={{ fontSize:10, fontWeight:700, color:C.p, background:`rgba(var(--p-rgb),.1)`, padding:"3px 8px", borderRadius:4, border:`1px solid rgba(var(--p-rgb),.2)` }}>#{t.toUpperCase()}</span>
                        ))}
                      </div>
                    )}

                    {/* Actions & Reactions */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, marginTop:16, paddingTop:12, borderTop:`1px solid ${C.surf}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <button 
                          onClick={()=>handleToggleReaction(r.id, 'like')}
                          style={{ background:C.bg, border:`1px solid ${C.bdr}`, borderRadius:8, padding:"5px 10px", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.txt }}
                        >
                          <span>👍</span> <span style={{ fontWeight:700 }}>{r.reactions?.like || 0}</span>
                        </button>
                        <button 
                          onClick={()=>handleToggleReaction(r.id, 'celebrate')}
                          style={{ background:C.bg, border:`1px solid ${C.bdr}`, borderRadius:8, padding:"5px 10px", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.txt }}
                        >
                          <span>🎉</span> <span style={{ fontWeight:700 }}>{r.reactions?.celebrate || 0}</span>
                        </button>
                      </div>
                      <span style={{ fontSize:11, color:C.sub, fontWeight:600 }}>{r.comments?.length || 0} Comment{r.comments?.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Comments Thread */}
                    <div style={{ marginTop:14, padding:"12px", background:`rgba(var(--shadow-rgb),.02)`, borderRadius:10 }}>
                      {r.comments?.map((c, ci) => (
                        <div key={ci} style={{ display:"flex", gap:10, marginBottom:ci === r.comments.length - 1 ? 0 : 12 }}>
                          <Av ini={c.ini} sz={22} />
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:2 }}>
                              <span style={{ fontSize:12, fontWeight:700, color:C.txt }}>{c.from}</span>
                              <span style={{ fontSize:10, color:C.sub }}>{c.time}</span>
                            </div>
                            <p style={{ margin:0, fontSize:12, color:C.txt, lineHeight:1.4 }}>{c.txt}</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Quick Comment Input */}
                      <div style={{ display:"flex", gap:8, marginTop:12 }}>
                        <input 
                          placeholder="Add a comment..." 
                          onKeyDown={e => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              handleAddComment(r.id, e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                          style={{ flex:1, padding:"6px 10px", borderRadius:6, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:12, color:C.txt, outline:"none" }} 
                        />
                      </div>
                    </div>
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
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                <div style={{ maxWidth:560 }}>
                  <div style={{
                    display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                    padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
                    fontSize:10, fontWeight:700, letterSpacing:.85, color:C.sub, textTransform:"uppercase",
                  }}>⊹ Structure</div>
                  <h1 style={{
                    fontFamily:"Georgia,serif", fontSize:"clamp(26px, 3.5vw, 32px)", color:C.txt, margin:0, fontWeight:700, lineHeight:1.12, letterSpacing:"-.02em",
                  }}>Org Chart</h1>
                  <p style={{ color:C.sub, fontSize:13, margin:"10px 0 0", lineHeight:1.55 }}>
                    Interactive hierarchy. Click nodes for quick view. {isAdmin ? "Administrators can reassign reporting lines." : ""}
                  </p>
                </div>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ position:"relative" }}>
                    <input 
                      placeholder="Search name, role, dept..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      style={{
                        padding:"10px 14px 10px 36px", borderRadius:10, border:`1px solid ${C.bdr}`,
                        fontSize:13, background:C.wht, outline:"none", width:240,
                        boxShadow:"inset 0 1px 2px rgba(var(--shadow-rgb),.04)",
                      }}
                    />
                    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.5 }}>🔍</span>
                    {orgSearch && <button onClick={()=>setOrgSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.sub, fontSize:14 }}>×</button>}
                  </div>
                  {isAdmin && <Btn variant="outline" onClick={()=>setShowOrgEdit(true)} style={{ padding:"10px 18px" }}>Configure</Btn>}
                </div>
              </div>
            </div>

            <div style={{
              position:"relative", background:C.wht, borderRadius:16, border:`1px solid ${C.bdr}`,
              padding:"40px 24px 80px", overflowX:"auto",
              boxShadow:"0 2px 20px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
              minHeight:500,
            }}>
              {/* Reset View Button */}
              <button 
                onClick={() => {
                  const chart = document.getElementById("org-chart-root");
                  if (chart) chart.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                style={{
                  position:"absolute", top:20, left:20, padding:"8px 12px", borderRadius:8,
                  background:C.bg, border:`1px solid ${C.bdr}`, fontSize:11, fontWeight:700, color:C.p,
                  cursor:"pointer", zIndex:10,
                }}
              >
                ➹ Center View
              </button>

              <div id="org-chart-root" style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:48, flexWrap:"wrap", minWidth:0 }}>
                {(() => {
                  const roots = employees.filter(e => orgManagers[e.id] == null);
                  if (roots.length === 0) return (
                    <div style={{ textAlign:"center", color:C.sub, padding:"60px 20px", fontSize:13, borderRadius:12, background:C.bg, border:`1px dashed ${C.bdr}` }}>
                      No top-level role defined. {isAdmin ? <>Use <strong style={{ color:C.txt }}>Configure</strong> to set a “Top level” manager.</> : <>Contact Admin to set hierarchy.</>}
                    </div>
                  );
                  return roots.map(root => (
                    <OrgTreeNode 
                      key={root.id} nodeId={root.id} nodeType="emp" orgManagers={orgManagers} depth={0} empList={employees} 
                      orgSearch={orgSearch} collapsedNodes={collapsedNodes} 
                      onToggleCollapse={toggleOrgCollapse} 
                      onPreview={(id) => setOrgPreviewId(id)}
                      orgPreviewId={orgPreviewId}
                      vacancies={VACANCIES}
                    />
                  ));
                })()}
              </div>
            </div>

            {/* Quick View Popover */}
            {orgPreviewId && (
              <OrgPreviewCard 
                node={
                  typeof orgPreviewId === 'string' 
                    ? VACANCIES.find(v => v.id === orgPreviewId) 
                    : employees.find(e => e.id === orgPreviewId)
                }
                isEmp={typeof orgPreviewId !== 'string'}
                onReassign={handleReassignManager}
                isAdmin={isAdmin}
                employees={employees}
                onClose={() => setOrgPreviewId(null)}
              />
            )}
          </div>
        )}

        {/* ─ LISTENING ROOM ─ */}
        {page==="Listening Room" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:640 }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
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
              boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.06), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
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
              boxShadow:"0 2px 16px rgba(var(--shadow-rgb),.05), 0 1px 0 rgba(var(--wht-rgb),.8) inset",
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

        
        {/* ─ REPORTS & ANALYTICS ─ */}
        {page === "Reports & Analytics" && isSA && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <ReportsAnalytics
              employees={employees}
              leaves={leaves}
              saPayslips={saPayslips}
              offboardingItems={offboardingItems}
              C={C}
            />
          </div>
        )}

{/* ─ PEOPLE CHAPTERS ─ */}
        {page === "People Chapters" && (
             <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"800px", margin:"0 auto" }}>
               {/* Hero */}
               <div style={{ padding:"40px 0", textAlign:"center" }}>
                 <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:16, padding:"6px 14px", borderRadius:999, background:C.surf, border:`1px solid ${C.bdr}`, fontSize:11, fontWeight:700, letterSpacing:1, color:C.p, textTransform:"uppercase" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> Employee Journeys</div>
                 <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:C.txt, margin:"0 0 16px", fontWeight:700 }}>People Chapters</h1>
                 <p style={{ color:C.sub, fontSize:15, lineHeight:1.6, maxWidth:500, margin:"0 auto" }}>Manage the critical transitions of your workforce, from their first day to their final handover.</p>
               </div>

               {chapterTab === "Menu" ? (
                 <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24, marginTop:20 }}>
                   <Card onClick={() => setChapterTab("Onboarding")} style={{ padding:40, textAlign:"center", cursor:"pointer", transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:16, border:`1px solid ${C.bdr}`, boxShadow:"0 4px 15px rgba(0,0,0,0.02)" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=`0 8px 28px rgba(var(--p-rgb),0.10)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.boxShadow="0 4px 15px rgba(0,0,0,0.02)";}}>
                     <div style={{ width:64, height:64, borderRadius:18, background:`rgba(var(--p-rgb),0.09)`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg></div>
                     <div>
                       <h2 style={{ fontSize:20, fontWeight:700, color:C.txt, margin:"0 0 8px" }}>Onboarding</h2>
                       <p style={{ fontSize:14, color:C.sub, margin:0, lineHeight:1.5 }}>Set up and welcome new employees into the organization.</p>
                     </div>
                   </Card>
                   
                   <Card onClick={() => setChapterTab("Offboarding")} style={{ padding:40, textAlign:"center", cursor:"pointer", transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:16, border:`1px solid ${C.bdr}`, boxShadow:"0 4px 15px rgba(0,0,0,0.02)" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.p;e.currentTarget.style.boxShadow=`0 8px 28px rgba(var(--p-rgb),0.10)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.boxShadow="0 4px 15px rgba(0,0,0,0.02)";}}>
                     <div style={{ width:64, height:64, borderRadius:18, background:`rgba(var(--p-rgb),0.09)`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
                     <div>
                       <h2 style={{ fontSize:20, fontWeight:700, color:C.txt, margin:"0 0 8px" }}>Offboarding</h2>
                       <p style={{ fontSize:14, color:C.sub, margin:0, lineHeight:1.5 }}>Manage exits, clearances, and employee transitions.</p>
                     </div>
                   </Card>
                 </div>
                ) : chapterTab === "Onboarding" ? (
                  <OnboardingFlow setPage={setPage} onBack={() => setChapterTab("Menu")} employees={employees} />
                ) : chapterTab === "Offboarding" ? (
                  <OffboardingFlow 
                    onBack={() => setChapterTab("Menu")} 
                    offboardingItems={offboardingItems} 
                    setOffboardingItems={setOffboardingItems} 
                    isAdmin={isAdmin} 
                    setPage={setPage} 
                    employees={employees} 
                    papers={papers}
                    setPapers={setPapers}
                    addNotif={addNotif}
                    toast={toast}
                  />
                ) : (
                  <div style={{ textAlign:"center", padding:"60px 20px", background:C.surf, borderRadius:16, border:`1px dashed ${C.bdr}` }}>
                    <div style={{ width:56, height:56, borderRadius:14, background:`rgba(var(--p-rgb),0.07)`, color:C.p, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                    <h2 style={{ fontSize:20, fontWeight:700, color:C.txt, margin:"0 0 12px" }}>{chapterTab} flows coming soon</h2>
                    <p style={{ fontSize:14, color:C.sub, margin:"0 0 24px", maxWidth:400, marginLeft:"auto", marginRight:"auto" }}>The detailed workflows and automations for {chapterTab.toLowerCase()} are currently under construction.</p>
                    <Btn variant="outline" onClick={() => setChapterTab("Menu")}>← Back to Chapters</Btn>
                  </div>
                )}
             </div>
        )}

        {/* ─ SETTINGS ─ */}
        {page==="Settings" && (
          <div style={{ padding:`0 ${pad}px ${padBottom}px`, width:"100%", maxWidth:"100%", boxSizing:"border-box" }}>
            <div style={{
              position:"relative",
              margin:`0 ${-pad}px 28px`,
              padding: heroPadStd,
              background:`linear-gradient(155deg, ${C.wht} 0%, ${C.surf} 38%, ${C.mid} 100%)`,
              borderBottom:`1px solid ${C.bdr}`,
              overflow:"hidden",
            }}>
              <div style={{
                position:"absolute", right:-40, top:-30, width:220, height:220,
                borderRadius:"50%", background:`radial-gradient(circle, rgba(var(--p-rgb),.25) 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:720 }}>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8, marginBottom:10,
                  padding:"5px 12px", borderRadius:999, background:"rgba(var(--wht-rgb),.65)", border:`1px solid ${C.bdr}`,
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
                    <Pill txt={role} bg={C.p} c="#fff" />
                  </div>
                </div>
              </div>
            </SettingsPanel>

            <SettingsPanel label="Appearance" title="Color Theme" accent={C.p}>
              <p style={{ margin:"0 0 16px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                Personalize your workspace experience with curated color palettes.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr 1fr" : "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
                {Object.keys(THEMES).map(t => {
                  const data = THEMES[t];
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        toast(`${t} theme applied ✓`);
                      }}
                      style={{
                        padding: "14px 12px",
                        borderRadius: 14,
                        border: `2px solid ${theme === t ? C.p : C.bdr}`,
                        background: theme === t ? `rgba(var(--p-rgb), 0.08)` : C.bg,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: theme === t ? "0 4px 12px rgba(var(--p-rgb), 0.12)" : "none",
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center"
                      }}
                    >
                      <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: data.p, border:`1px solid rgba(0,0,0,0.05)` }} />
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: data.p2, border:`1px solid rgba(0,0,0,0.05)` }} />
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: data.mid, border:`1px solid rgba(0,0,0,0.05)` }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: theme === t ? C.p : C.txt, textAlign:"center" }}>{t}</div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>Dark Mode</div>
                  <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>Use low-light interface</div>
                </div>
                <button 
                  onClick={() => setIsDark(!isDark)}
                  style={{ 
                    position:"relative", width:44, height:24, borderRadius:20, 
                    background: isDark ? C.p : C.bdr, cursor:"pointer", border:"none",
                    transition:"background 0.3s"
                  }}
                >
                  <div style={{ 
                    position:"absolute", left: isDark ? 22 : 2, top: 2, width:20, height:20, 
                    borderRadius:"50%", background:"#fff", transition:"left 0.3s"
                  }} />
                </button>
              </div>
            </SettingsPanel>


            {isAdmin && (
              <>
                <SettingsPanel label="Organisation" title="Workspace & directory" accent={C.p}>
                  <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    High-level context for KinSphere. This name appears across the product headers and documents.
                  </p>
                  <div style={{
                    display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14, marginBottom:14,
                  }}>
                    <div style={{ padding:14, borderRadius:12, background:C.bg, border:`1px solid ${C.bdr}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:8 }}>COMPANY NAME</div>
                      <input 
                        value={companyTagline} 
                        onChange={(e) => setCompanyTagline(e.target.value)}
                        style={{ width:"100%", border:"none", background:"transparent", fontSize:14, fontWeight:600, color:C.txt, padding:0, outline:"none" }}
                        placeholder="Enter company name..."
                      />
                    </div>
                    <div style={{ padding:14, borderRadius:12, background:C.bg, border:`1px solid ${C.bdr}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:6 }}>EMPLOYEES</div>
                      <div style={{ fontSize:22, fontWeight:700, color:C.txt, fontVariantNumeric:"tabular-nums" }}>{employees.length}</div>
                    </div>
                    <div style={{ gridColumn:"1 / -1", padding:14, borderRadius:12, background:C.bg, border:`1px solid ${C.bdr}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:10 }}>DEPARTMENTS</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                        {departments.map(d => (
                          <div key={d} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, background:C.surf, border:`1px solid ${C.bdr}`, fontSize:12, color:C.txt }}>
                            {d}
                            <button onClick={()=>setDepartments(p=>p.filter(x=>x!==d))} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, fontSize:10, padding:0, display:"flex" }} title="Remove">✕</button>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <input value={newDeptInput} onChange={e=>setNewDeptInput(e.target.value)} placeholder="New department (e.g. Sales, Accounting)..." onKeyDown={e=>{if(e.key==="Enter"&&newDeptInput){setDepartments(p=>[...p,newDeptInput]);setNewDeptInput("");}}} style={{ flex:1, padding:"8px 12px", borderRadius:8, border:`1px solid ${C.bdr}`, background:C.wht, fontSize:12, outline:"none", color:C.txt }} />
                        <Btn variant="outline" onClick={()=>{if(!newDeptInput)return;setDepartments(p=>[...p,newDeptInput]);setNewDeptInput("");}} style={{ padding:"8px 16px" }}>Add</Btn>
                      </div>
                    </div>
                  </div>
                </SettingsPanel>

                {isAdmin && (
                  <SettingsPanel label="Branding" title="Logo" accent="#6b7d5e">
                    <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                      <div style={{ width:60, height:60, borderRadius:12, border:`1px solid ${C.bdr}`, background:C.surf, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                        {companyLogoUrl ? <img src={companyLogoUrl} style={{ width:"100%", height:"100%", objectFit:"contain" }} /> : <span style={{ fontSize:20 }}>🏢</span>}
                      </div>
                      <Btn variant="outline" onClick={() => logoInputRef.current?.click()}>Upload Logo</Btn>
                    </div>
                  </SettingsPanel>
                )}

                {isSA && (
                  <SettingsPanel label="Access Control" title="Manage module access" accent={C.p}>
                  <p style={{ margin:"0 0 16px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Grant specific permissions to Admins or Employees to view or manage individual modules.
                  </p>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:8 }}>SELECT EMPLOYEE</div>
                    <select 
                      value={accessSelectedEmpId} 
                      onChange={(e) => setAccessSelectedEmpId(e.target.value)}
                      style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.bg, fontSize:13, color:C.txt, outline:"none" }}
                    >
                      <option value="">-- Choose Employee --</option>
                      {employees.filter(e => e.id !== ME_ID).map(e => (
                        <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                      ))}
                    </select>
                  </div>

                  {accessSelectedEmpId && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {Object.keys(accessPermissions).map(key => (
                        <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.surf }}>
                          <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <button 
                            onClick={() => setAccessPermissions(prev => ({ ...prev, [key]: !prev[key] }))}
                            style={{ width:36, height:18, borderRadius:20, background: accessPermissions[key] ? C.p : C.bdr, border:"none", position:"relative", cursor:"pointer", transition:".2s" }}
                          >
                            <div style={{ position:"absolute", top:2, left: accessPermissions[key] ? 20 : 2, width:14, height:14, borderRadius:"50%", background:"#fff", transition:".2s" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {accessSelectedEmpId && (() => {
                    const sel = employees.find(e => e.id === Number(accessSelectedEmpId));
                    if (!sel) return null;
                    
                    return (
                      <div style={{ marginTop:24, paddingTop:24, borderTop:`1px solid ${C.bdr}` }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:16 }}>ROLE & PERMISSIONS MANAGEMENT</div>
                        
                        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                          {/* Role Elevation Card */}
                          <div style={{ 
                            padding:16, 
                            border: sel.role === "Employee" ? `1px solid #fed7aa` : `1px solid ${C.bdr}`, 
                            background: sel.role === "Employee" ? `#fff7ed` : C.surf, 
                            borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" 
                          }}>
                            <div style={{ flex:1, minWidth:240 }}>
                              <div style={{ fontSize:13, fontWeight:700, color: sel.role === "Employee" ? "#9a3412" : C.txt, marginBottom:4 }}>
                                {sel.role === "Employee" ? "Elevate to Admin" : (sel.role === "Admin" ? "Promote to Super Admin" : "Manage Role")}
                              </div>
                              <div style={{ fontSize:11, color: sel.role === "Employee" ? "#c2410c" : C.sub, lineHeight:1.45 }}>
                                {sel.role === "Admin" 
                                  ? `This will grant ${sel.name} full system access, including billing, organizational settings, and absolute cross-module visibility.`
                                  : `This will allow ${sel.name} to see all modules. By default, they will only see their own payslips unless Paydays access is granted.`}
                              </div>
                            </div>
                            <Btn onClick={() => {
                              const newRole = sel.role === "Admin" ? "Super Admin" : "Admin";
                              setEmployees(prev => prev.map(e => e.id === sel.id ? { ...e, role: newRole, paydaysAccess: newRole === "Super Admin" } : e));
                              toast(`${sel.name} is now a ${newRole} ✓`);
                            }} style={{ background: sel.role === "Admin" ? "#ea580c" : C.p, color:"#fff", border:"none", padding:"10px 20px" }}>
                              {sel.role === "Admin" ? "Promote to SA" : "Elevate to Admin"}
                            </Btn>
                          </div>

                          {/* Paydays Access Card (Only for Admins) */}
                          {sel.role === "Admin" && (
                            <div style={{ 
                              padding:16, 
                              border: `1px solid ${sel.paydaysAccess ? '#dcfce7' : C.bdr}`, 
                              background: sel.paydaysAccess ? '#f0fdf4' : C.bg, 
                              borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" 
                            }}>
                              <div style={{ flex:1, minWidth:240 }}>
                                <div style={{ fontSize:13, fontWeight:700, color: sel.paydaysAccess ? "#166534" : C.txt, marginBottom:4 }}>Complete Paydays Access</div>
                                <div style={{ fontSize:11, color: sel.paydaysAccess ? "#15803d" : C.sub, lineHeight:1.45 }}>
                                  Currently: <strong style={{ textTransform: "uppercase" }}>{sel.paydaysAccess ? "Full Access" : "Restricted (Own Payslips Only)"}</strong>.
                                  Manual authorization required for viewing org-wide payroll and salary configurations.
                                </div>
                              </div>
                              <Btn 
                                onClick={() => {
                                  const newVal = !sel.paydaysAccess;
                                  setEmployees(prev => prev.map(e => e.id === sel.id ? { ...e, paydaysAccess: newVal } : e));
                                  toast(`Paydays access ${newVal ? "granted" : "revoked"} for ${sel.name} ✓`);
                                }} 
                                variant={sel.paydaysAccess ? "outline" : "primary"}
                                style={{ 
                                  padding:"10px 20px",
                                  borderColor: sel.paydaysAccess ? "#166534" : "transparent",
                                  color: sel.paydaysAccess ? "#166534" : "#fff"
                                }}
                              >
                                {sel.paydaysAccess ? "Revoke Access" : "Grant Access"}
                              </Btn>
                            </div>
                          )}

                          {/* Demote Card (For Admins and SAs) */}
                          {sel.role !== "Employee" && (
                            <div style={{ 
                              padding:16, 
                              border: `1px solid #fee2e2`, 
                              background: `#fef2f2`, 
                              borderRadius:12, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" 
                            }}>
                              <div style={{ flex:1, minWidth:240 }}>
                                <div style={{ fontSize:13, fontWeight:700, color: "#991b1b", marginBottom:4 }}>Revoke Administrative Access</div>
                                <div style={{ fontSize:11, color: "#b91c1c", lineHeight:1.45 }}>
                                  This will demote {sel.name} to a standard <strong>Employee</strong> role. 
                                  They will lose access to the Org Chart configuration, Presence management, and all administrative notifications.
                                </div>
                              </div>
                              <Btn 
                                onClick={() => {
                                  setEmployees(prev => prev.map(e => e.id === sel.id ? { ...e, role: "Employee", paydaysAccess: false } : e));
                                  toast(`${sel.name} has been demoted to Employee ✓`);
                                  setAccessSelectedEmpId(""); // Clear selection
                                }} 
                                style={{ 
                                  padding:"10px 20px",
                                  background: "#dc2626",
                                  color: "#fff",
                                  border: "none"
                                }}
                              >
                                Demote to Employee
                              </Btn>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  </SettingsPanel>
                )}

                <SettingsPanel label="Security" title="Organisation security" accent="#b8860b">
                  <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Hardening options for production: enforce SSO, session length, and approver rules for leave.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>Two-factor authentication</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>Require 2FA for all users to access the platform</div>
                      </div>
                      <button 
                        onClick={() => setRequire2FAForAll(!require2FAForAll)}
                        style={{ width:44, height:24, borderRadius:20, background: require2FAForAll ? C.p : C.bdr, border:"none", position:"relative", cursor:"pointer", transition:".3s" }}
                      >
                        <div style={{ position:"absolute", top:2, left: require2FAForAll ? 22 : 2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:".3s" }} />
                      </button>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 14px", borderRadius:12, border:`1px solid ${C.bdr}`, background:C.bg, flexWrap:"wrap" }}>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>Session Timeout</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>Automatic logout after inactivity</div>
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <input 
                          type="number" 
                          value={sessionTimeoutValue} 
                          onChange={(e) => setSessionTimeoutValue(Number(e.target.value))}
                          style={{ width:50, padding:6, borderRadius:6, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:12, textAlign:"center" }}
                        />
                        <select 
                          value={sessionTimeoutUnit}
                          onChange={(e) => setSessionTimeoutUnit(e.target.value)}
                          style={{ padding:6, borderRadius:6, border:`1px solid ${C.bdr}`, background:C.surf, fontSize:11 }}
                        >
                          <option>Hours</option>
                          <option>Days</option>
                          <option>Months</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </SettingsPanel>

                <SettingsPanel label="Data" title="Exports" accent={C.p2}>
                  <p style={{ margin:"0 0 12px", fontSize:12, color:C.sub, lineHeight:1.55 }}>
                    Download complete system records including employees, payroll history, and time away data for external reporting.
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <Btn variant="outline" onClick={()=>toast("Exporting complete system data (CSV)... ✓")}>Export Complete System Data</Btn>
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

                <SettingsPanel label="Integrations" title="Integrations & Notifications" accent="#7a8e6e">
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:12 }}>CONNECTED SERVICES</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10 }}>
                      {["Slack", "Teams", "HRIS", "Other"].map(svc => (
                        <div key={svc} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:10, border:`1px solid ${C.bdr}`, background:C.surf }}>
                          <span style={{ fontSize:16 }}>{svc === 'Slack' ? '💬' : svc === 'Teams' ? '👥' : svc === 'HRIS' ? '🧬' : '🔗'}</span>
                          <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>{svc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:12 }}>NOTIFICATION ALERTS</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      {[
                        { id: 'directory', lbl: 'Directory Changes', sub: 'Employee imports, role changes, new joiners' },
                        { id: 'payroll', lbl: 'Payroll alerts', sub: 'Salary config edits, payslip generation' },
                        { id: 'security', lbl: 'Security updates', sub: 'Critical system and access changes' }
                      ].map(row => (
                        <div key={row.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 0" }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:600, color:C.txt }}>{row.lbl}</div>
                            <div style={{ fontSize:11, color:C.sub }}>{row.sub}</div>
                          </div>
                          <button 
                            onClick={() => setSettingNotifs(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
                            style={{ width:40, height:20, borderRadius:20, background: settingNotifs[row.id] ? C.p : C.sub, border:"none", position:"relative", cursor:"pointer", transition:".2s" }}
                          >
                            <div style={{ position:"absolute", top:2, left: settingNotifs[row.id] ? 22 : 2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:".2s" }} />
                          </button>
                        </div>
                      ))}
                    </div>
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

            {isAdmin && (
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

      {showLeaveBal && (() => {
        const detailEmp = selectedLeaveEmpId !== null ? employees.find(e => e.id === selectedLeaveEmpId) : null;
        // Build filtered history based on month/year selectors
        const allEmpHistory = detailEmp ? leaves.filter(l => l.empId === detailEmp.id) : [];
        const empHistory = allEmpHistory.filter(l => {
          if (!l.fromISO) return true;
          const d = new Date(l.fromISO);
          const yearOk = d.getFullYear() === leaveDetailHistoryYear;
          const monthOk = leaveDetailHistoryMonth === null || d.getMonth() === leaveDetailHistoryMonth;
          return yearOk && monthOk;
        });
        // Available years in history (for picker)
        const historyYears = [...new Set(allEmpHistory.map(l => l.fromISO ? new Date(l.fromISO).getFullYear() : null).filter(Boolean))].sort((a,b)=>b-a);
        if (historyYears.length === 0) historyYears.push(new Date().getFullYear());

        // For balance summary: filter by leaveBalYear context for "used" calculation
        const usedLeaveInYear = (empId, type, year, month) => {
          return leaves
            .filter(l => {
              if (l.empId !== empId || l.type !== type || l.status === "rejected") return false;
              if (!l.fromISO) return false;
              const d = new Date(l.fromISO);
              const yearOk = d.getFullYear() === year;
              const monthOk = month === null || d.getMonth() === month;
              return yearOk && monthOk;
            })
            .reduce((sum, l) => {
              if (!l.fromISO || !l.toISO) return sum;
              const days = Math.max(1, Math.round((new Date(l.toISO).getTime() - new Date(l.fromISO).getTime()) / 864e5) + 1);
              return sum + (l.halfDay ? 0.5 : days);
            }, 0);
        };

        return (
          <Modal
            title={detailEmp ? `${detailEmp.name} — Leave Detail` : "Team Leave Balances"}
            onClose={() => { setShowLeaveBal(false); setSelectedLeaveEmpId(null); }}
            width={860}
          >
            {/* ── DETAIL VIEW ── */}
            {detailEmp ? (
              <div>
                {/* Back */}
                <button
                  onClick={() => setSelectedLeaveEmpId(null)}
                  style={{ background:"none", border:`1px solid ${C.bdr}`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, color:C.sub, cursor:"pointer", marginBottom:20 }}
                >
                  ← Back to all employees
                </button>

                {/* Employee card */}
                <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:C.surf, borderRadius:12, border:`1px solid ${C.bdr}`, marginBottom:22 }}>
                  <Av ini={detailEmp.ini} sz={44} bg={detailEmp.avatarC} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:16, color:C.txt }}>{detailEmp.name}</div>
                    <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{detailEmp.designation} · {detailEmp.dept}</div>
                  </div>
                </div>

                {/* ── Entitlement overrides ── */}
                <div style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.p, letterSpacing:1 }}>LEAVE ENTITLEMENTS (override per-employee)</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <Btn
                        variant="outline"
                        style={{ padding:"5px 14px", fontSize:11 }}
                        onClick={() => {
                          // Reset all overrides for this employee to policy defaults
                          setEmpLeaveOverrides(prev => {
                            const next = { ...prev };
                            delete next[detailEmp.id];
                            return next;
                          });
                          toast("Reset to policy defaults ✓");
                        }}
                      >↩ Reset all</Btn>
                      <Btn
                        style={{ padding:"5px 16px", fontSize:11 }}
                        onClick={() => {
                          toast(`Leave entitlements saved for ${detailEmp.name} ✓`);
                        }}
                      >💾 Save changes</Btn>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:12 }}>
                    {Object.entries(leavePolicy).map(([type, pol]) => {
                      const override = empLeaveOverrides[detailEmp.id]?.[type];
                      const effectiveTotal = override !== undefined ? override : (pol.total as number);
                      const used = usedLeave(detailEmp.id, type);
                      const rem = effectiveTotal - used;
                      return (
                        <div key={type} style={{ background:C.wht, border:`1px solid ${C.bdr}`, borderRadius:12, padding:"14px 16px", transition:"box-shadow .15s" }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, marginBottom:8 }}>{type.toUpperCase()}</div>
                          <div style={{ fontSize:12, color:C.txt, marginBottom:6 }}>
                            <span style={{ fontWeight:700, color: rem < 0 ? "#dc2626" : (rem < 2 ? "#b45309" : C.p) }}>{rem}</span>
                            <span style={{ color:C.bdr }}> / {effectiveTotal} remaining</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <label style={{ fontSize:10, color:C.sub, flexShrink:0 }}>Total:</label>
                            <input
                              type="number"
                              min={0}
                              value={effectiveTotal}
                              onChange={ev => {
                                const v = Number(ev.target.value);
                                setEmpLeaveOverrides(prev => ({
                                  ...prev,
                                  [detailEmp.id]: { ...(prev[detailEmp.id] || {}), [type]: v }
                                }));
                              }}
                              style={{ width:"100%", padding:"5px 8px", borderRadius:7, border:`1px solid ${C.bdr}`, fontSize:12, color:C.txt, background:C.bg, outline:"none" }}
                            />
                          </div>
                          {override !== undefined && override !== (pol.total as number) && (
                            <button
                              onClick={() => {
                                setEmpLeaveOverrides(prev => {
                                  const next = { ...prev, [detailEmp.id]: { ...(prev[detailEmp.id] || {}) } };
                                  delete next[detailEmp.id][type];
                                  return next;
                                });
                              }}
                              style={{ fontSize:9, color:C.sub, background:"none", border:"none", cursor:"pointer", marginTop:4, padding:0 }}
                            >
                              ↩ Reset to default ({pol.total as number}d)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Leave history ── */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.p, letterSpacing:1 }}>LEAVE HISTORY</div>
                    {/* Month/Year pickers */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <select
                        value={leaveDetailHistoryYear}
                        onChange={ev => setLeaveDetailHistoryYear(Number(ev.target.value))}
                        style={{ ...payFilterSelectStyle, padding:"6px 32px 6px 10px", fontSize:11, minWidth:80 }}
                      >
                        {historyYears.map(y => <option key={y} value={y}>{y}</option>)}
                        {!historyYears.includes(new Date().getFullYear()) && <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>}
                      </select>
                      <select
                        value={leaveDetailHistoryMonth === null ? "" : leaveDetailHistoryMonth}
                        onChange={ev => setLeaveDetailHistoryMonth(ev.target.value === "" ? null : Number(ev.target.value))}
                        style={{ ...payFilterSelectStyle, padding:"6px 32px 6px 10px", fontSize:11, minWidth:100 }}
                      >
                        <option value="">All months</option>
                        {MONTHS_SHORT.map((m, i) => <option key={i} value={i}>{m}</option>)}
                      </select>
                      {(leaveDetailHistoryMonth !== null) && (
                        <button
                          onClick={() => setLeaveDetailHistoryMonth(null)}
                          style={{ fontSize:10, color:C.sub, background:"none", border:`1px solid ${C.bdr}`, borderRadius:6, padding:"5px 8px", cursor:"pointer" }}
                        >Clear</button>
                      )}
                    </div>
                  </div>
                  {empHistory.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"28px 12px", background:C.bg, borderRadius:12, border:`1px dashed ${C.bdr}`, fontSize:12, color:C.sub }}>
                      No leave records for {leaveDetailHistoryMonth !== null ? `${MONTHS_SHORT[leaveDetailHistoryMonth]} ` : ""}{leaveDetailHistoryYear}.
                    </div>
                  ) : (
                    <div style={{ borderRadius:12, border:`1px solid ${C.bdr}`, overflow:"hidden" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                        <thead>
                          <tr style={{ background:C.surf }}>
                            {["Type","From","To","Days","Reason","Approver","Status"].map(h => (
                              <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:10, fontWeight:700, color:C.sub, letterSpacing:.5, borderBottom:`1px solid ${C.bdr}` }}>{h.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {empHistory.sort((a,b) => b.fromISO?.localeCompare(a.fromISO||"")||0).map(l => (
                            <tr key={l.id} style={{ borderBottom:`1px solid ${C.surf}` }}>
                              <td style={{ padding:"10px 12px", fontWeight:600 }}>{l.type}</td>
                              <td style={{ padding:"10px 12px", color:C.sub }}>{l.from}</td>
                              <td style={{ padding:"10px 12px", color:C.sub }}>{l.to}</td>
                              <td style={{ padding:"10px 12px", fontWeight:600 }}>{l.days}</td>
                              <td style={{ padding:"10px 12px", color:C.sub, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.reason}</td>
                              <td style={{ padding:"10px 12px" }}><Pill txt={l.approver} bg={C.surf} c={C.sub} /></td>
                              <td style={{ padding:"10px 12px" }}><Badge s={l.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ── SUMMARY TABLE ── */
              <div>
                {/* Year / Month context row */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:16 }}>
                  <div style={{ fontSize:12, color:C.sub }}>Click an employee to view their leave history and edit entitlements.</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:C.sub }}>Viewing:</span>
                    <select
                      value={leaveBalYear}
                      onChange={ev => setLeaveBalYear(Number(ev.target.value))}
                      style={{ ...payFilterSelectStyle, padding:"6px 32px 6px 10px", fontSize:11, minWidth:80 }}
                    >
                      {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                      value={leaveBalMonth === null ? "" : leaveBalMonth}
                      onChange={ev => setLeaveBalMonth(ev.target.value === "" ? null : Number(ev.target.value))}
                      style={{ ...payFilterSelectStyle, padding:"6px 32px 6px 10px", fontSize:11, minWidth:110 }}
                    >
                      <option value="">Full year</option>
                      {MONTHS_SHORT.map((m,i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    {leaveBalMonth !== null && (
                      <button
                        onClick={() => setLeaveBalMonth(null)}
                        style={{ fontSize:10, color:C.sub, background:"none", border:`1px solid ${C.bdr}`, borderRadius:6, padding:"5px 8px", cursor:"pointer" }}
                      >Clear</button>
                    )}
                  </div>
                </div>
                <div style={{ fontSize:10, color:C.bdr, marginBottom:10, fontStyle:"italic" }}>
                  Showing used days for {leaveBalMonth !== null ? `${MONTHS_SHORT[leaveBalMonth]} ` : ""}{leaveBalYear}{leaveBalMonth === null ? " (full year)" : ""}
                </div>
                <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${C.bdr}` }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                    <thead>
                      <tr style={{ background:C.surf }}>
                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:`1px solid ${C.bdr}`, fontWeight:700, color:C.sub, letterSpacing:.5, fontSize:10 }}>EMPLOYEE</th>
                        {Object.keys(leavePolicy).map(t => (
                          <th key={t} style={{ padding:"10px 12px", textAlign:"left", borderBottom:`1px solid ${C.bdr}`, fontWeight:700, color:C.sub, letterSpacing:.5, fontSize:10 }}>{t.toUpperCase()}</th>
                        ))}
                        <th style={{ padding:"10px 12px", textAlign:"left", borderBottom:`1px solid ${C.bdr}`, fontWeight:700, color:C.sub, letterSpacing:.5, fontSize:10 }}>HISTORY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(e => (
                        <tr
                          key={e.id}
                          style={{ borderBottom:`1px solid ${C.surf}`, cursor:"pointer", transition:"background .12s" }}
                          onClick={() => setSelectedLeaveEmpId(e.id)}
                          onMouseEnter={ev => ev.currentTarget.style.background = C.bg}
                          onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding:"11px 12px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                              <Av ini={e.ini} sz={26} bg={e.avatarC} />
                              <div>
                                <div style={{ fontWeight:600, color:C.p }}>{e.name} <span style={{ fontSize:10, color:C.bdr }}>↗</span></div>
                                <div style={{ fontSize:10, color:C.sub }}>{e.designation || e.dept}</div>
                              </div>
                            </div>
                          </td>
                          {Object.entries(leavePolicy).map(([type, pol]) => {
                            const override = empLeaveOverrides[e.id]?.[type];
                            const effectiveTotal = override !== undefined ? override : (pol.total as number);
                            const used = usedLeaveInYear(e.id, type, leaveBalYear, leaveBalMonth);
                            const rem = effectiveTotal - used;
                            return (
                              <td key={type} style={{ padding:"11px 12px" }}>
                                <div style={{ fontWeight:700, fontSize:12, color: used > 0 ? (rem < 0 ? "#dc2626" : (rem < 2 ? "#b45309" : C.p)) : C.bdr }}>
                                  {used > 0 ? (<>{rem} <span style={{ fontWeight:400, color:C.bdr }}>/ {effectiveTotal}</span></>) : (
                                    <span style={{ color:C.bdr, fontWeight:400 }}>0 used</span>
                                  )}
                                </div>
                                <div style={{ fontSize:9, color:C.bdr }}>Used: {used}d{override !== undefined ? " · custom" : ""}</div>
                              </td>
                            );
                          })}
                          <td style={{ padding:"11px 12px" }}>
                            <span style={{ fontSize:10, color:C.sub }}>
                              {leaves.filter(l => {
                                if (l.empId !== e.id || !l.fromISO) return false;
                                const d = new Date(l.fromISO);
                                const yOk = d.getFullYear() === leaveBalYear;
                                const mOk = leaveBalMonth === null || d.getMonth() === leaveBalMonth;
                                return yOk && mOk;
                              }).length} request{leaves.filter(l => {
                                if (l.empId !== e.id || !l.fromISO) return false;
                                const d = new Date(l.fromISO);
                                return d.getFullYear() === leaveBalYear && (leaveBalMonth === null || d.getMonth() === leaveBalMonth);
                              }).length !== 1 ? "s" : ""}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Modal>
        );
      })()}


      {/* ─ LEAVE CONFIG MODAL ─ */}
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

            {releaseStep > 0 && (
        <ReleasePayslipsModal 
          onClose={() => setReleaseStep(0)}
          saPayslips={saPayslips}
          setSaPayslips={setSaPayslips}
          employees={employees}
          toast={toast}
          parseInr={parseInr}
          C={C}
          MONTHS_SHORT={MONTHS_SHORT}
          addNotif={addNotif}
        />
      )}
      {payrollStep > 0 && (
        <PayrollWizardModal 
           onClose={() => setPayrollStep(0)} 
           saPayslips={saPayslips} setSaPayslips={setSaPayslips}
           employees={employees}
           processedPayments={processedPayments}
           setProcessedPayments={setProcessedPayments}
           editedSalaries={editedSalaries}
           setPaymentLogs={setPaymentLogs}
           toast={toast}
           parseInr={parseInr}
           C={C}
           MONTHS_SHORT={MONTHS_SHORT}
           addNotif={addNotif}
        />
      )}


      {/* ─ EMPLOYEE PROFILE (SA) ─ */}
      {profilePick != null && empById(profilePick, employees) && (
        <Modal title="Employee profile" onClose={()=>setProfilePick(null)} width={640}>
          <ProfileDetail
            e={empById(profilePick, employees)}
            wrapCard={false}
            empList={employees}
            narrow={narrow}
            onEditBank={() => setBankPick(profilePick)}
            onApproveDoc={isSA ? (docIdx) => {
              const emp = empById(profilePick, employees);
              const docName = emp?.documents[docIdx]?.n || "Document";
              setEmployees(emps => emps.map(emp => emp.id !== profilePick ? emp : {
                ...emp,
                documents: emp.documents.map((d, i) => i === docIdx ? { ...d, v: true } : d)
              }));
              addNotif({
                icon: "✅", title: "Document Verified",
                body: `Your ${docName} has been approved and verified by HR`,
                forSA: false, forAll: false, forEmpIds: [profilePick]
              });
              toast("Document approved ✓");
            } : null}
            onRejectDoc={isSA ? (docIdx) => {
              const emp = empById(profilePick, employees);
              const docName = emp?.documents[docIdx]?.n || "Document";
              setEmployees(emps => emps.map(emp => emp.id !== profilePick ? emp : {
                ...emp,
                documents: emp.documents.filter((_, i) => i !== docIdx)
              }));
              addNotif({
                icon: "❌", title: "Document Rejected",
                body: `Your ${docName} upload was rejected. Please re-upload with correct details.`,
                forSA: false, forAll: false, forEmpIds: [profilePick]
              });
              toast("Document rejected and removed");
            } : null}
            onPreviewDoc={(doc, emp) => setDocPreviewItem({ doc, emp })}
          />
          
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

      {bankPick && (
        <Modal title="Update Bank Details" onClose={() => setBankPick(null)} width={400}>
          <div style={{ marginBottom:16 }}>
             <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>ACCOUNT NUMBER</label>
             <input value={bankForm.acc} onChange={e => setBankForm({ ...bankForm, acc: e.target.value })} style={{ width:"100%", boxSizing:"border-box", padding:"10px", borderRadius:8, border:`1px solid ${C.bdr}`, outline:"none", fontSize:14 }} />
          </div>
          <div style={{ marginBottom:20 }}>
             <label style={{ fontSize:11, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>IFSC CODE</label>
             <input value={bankForm.ifsc} onChange={e => setBankForm({ ...bankForm, ifsc: e.target.value })} style={{ width:"100%", boxSizing:"border-box", padding:"10px", borderRadius:8, border:`1px solid ${C.bdr}`, outline:"none", fontSize:14 }} />
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
      {docPreviewItem && (() => {
        const { doc, emp } = docPreviewItem;
        const isId = /aadhaar|pan|passport|driving|voter|id/i.test(doc.n);
        const isVerified = doc.v;
        return (
          <div
            style={{ position:"fixed", inset:0, zIndex:600, background:"rgba(0,0,0,.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
            onClick={() => setDocPreviewItem(null)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background:C.bg, borderRadius:20, width:"100%", maxWidth:560, maxHeight:"90vh",
                overflow:"hidden", display:"flex", flexDirection:"column",
                boxShadow:"0 32px 80px rgba(0,0,0,.35)", border:`1px solid ${C.bdr}`,
              }}
            >
              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", background:C.dk, flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:C.p, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:10 }}>KS</div>
                  <div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{doc.n}</div>
                    <div style={{ color:C.dkAcc, fontSize:10 }}>{emp.name} · Document Preview</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, background: isVerified ? "#4a7c59" : "#b45309", color:"#fff" }}>
                    {isVerified ? "✓ VERIFIED" : "⏳ PENDING"}
                  </span>
                  <button onClick={() => setDocPreviewItem(null)} style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:8, color:"#fff", fontSize:16, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              </div>

              {/* Preview body */}
              <div style={{ flex:1, overflowY:"auto", padding:24, display:"flex", flexDirection:"column", alignItems:"center", gap:16, background:C.bg }}>
                {/* Prototype notice */}
                <div style={{ width:"100%", background:`rgba(var(--p-rgb),.08)`, border:`1px solid ${C.bdr}`, borderRadius:10, padding:"8px 14px", fontSize:11, color:C.sub, display:"flex", alignItems:"center", gap:8 }}>
                  <span>ℹ️</span>
                  <span>Prototype preview — actual file content will render here in production.</span>
                </div>

                {isId ? (
                  /* ── ID Card layout ── */
                  <div style={{
                    width:"100%", maxWidth:420, borderRadius:16, overflow:"hidden",
                    boxShadow:"0 8px 30px rgba(0,0,0,.15)", position:"relative",
                    background:`linear-gradient(135deg, ${C.dk} 0%, #2d3a28 100%)`,
                  }}>
                    {/* Card top strip */}
                    <div style={{ background:`linear-gradient(90deg, ${C.p} 0%, ${C.p2} 100%)`, height:6 }} />
                    <div style={{ padding:"22px 24px 24px", position:"relative" }}>
                      {/* Watermark */}
                      <div style={{ position:"absolute", right:20, top:20, fontSize:52, opacity:.06, fontWeight:900, color:"#fff", userSelect:"none" }}>ID</div>
                      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                        <div style={{ width:52, height:52, borderRadius:12, background:C.p, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff", flexShrink:0, border:"2px solid rgba(255,255,255,.2)" }}>
                          {emp.ini}
                        </div>
                        <div>
                          <div style={{ color:"#fff", fontWeight:700, fontSize:16, fontFamily:"Georgia,serif" }}>{emp.name}</div>
                          <div style={{ color:C.dkAcc, fontSize:11, marginTop:3 }}>{emp.designation || emp.dept}</div>
                          <div style={{ color:C.dkAcc, fontSize:10, marginTop:2 }}>{emp.email}</div>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 14px" }}>
                        {[
                          ["Document", doc.n],
                          ["Doc. No.", "XXXX-XXXX-XXXX"],
                          ["Date of Birth", emp.dob || "—"],
                          ["Issued", new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div style={{ fontSize:9, fontWeight:700, color:C.dkAcc, letterSpacing:.8, marginBottom:2 }}>{k.toUpperCase()}</div>
                            <div style={{ fontSize:12, color:"#fff", fontWeight:600, fontFamily:"monospace" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:18, paddingTop:14, borderTop:"1px solid rgba(255,255,255,.12)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ fontSize:9, color:C.dkAcc }}>Bipolar Factory · KinSphere HRMS</div>
                        <div style={{ background: isVerified ? "#4a7c59" : "#b45309", borderRadius:6, padding:"3px 9px", fontSize:9, fontWeight:700, color:"#fff" }}>
                          {isVerified ? "VERIFIED" : "PENDING VERIFICATION"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Paper document layout ── */
                  <div style={{
                    width:"100%", maxWidth:440, background:"#fff", borderRadius:12,
                    boxShadow:"0 4px 24px rgba(0,0,0,.12)", border:`1px solid ${C.bdr}`,
                    overflow:"hidden", position:"relative",
                  }}>
                    <div style={{ background:`linear-gradient(90deg, ${C.p} 0%, ${C.p2} 100%)`, height:5 }} />
                    <div style={{ padding:"28px 30px", position:"relative" }}>
                      {/* Watermark */}
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                        <div style={{ fontSize:64, fontWeight:900, opacity:.04, color:C.dk, transform:"rotate(-30deg)", userSelect:"none", whiteSpace:"nowrap" }}>PREVIEW</div>
                      </div>
                      {/* Header */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
                        <div>
                          <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.2, color:C.sub, marginBottom:4 }}>BIPOLAR FACTORY · OFFICIAL DOCUMENT</div>
                          <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:C.txt }}>{doc.n}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:9, color:C.sub }}>Date</div>
                          <div style={{ fontSize:11, fontWeight:600, color:C.txt }}>{new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom:18, padding:"10px 14px", background:C.surf, borderRadius:8, border:`1px solid ${C.bdr}` }}>
                        <div style={{ fontSize:10, color:C.sub, fontWeight:600, marginBottom:4 }}>ISSUED TO</div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.txt }}>{emp.name}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{emp.designation || emp.dept} · {emp.email}</div>
                      </div>
                      {/* Simulated body lines */}
                      {[85, 100, 70, 95, 60, 88, 45].map((w, i) => (
                        <div key={i} style={{ height:8, borderRadius:4, background:C.surf, marginBottom:8, width:`${w}%` }} />
                      ))}
                      <div style={{ marginTop:20 }}>
                        {[75, 90, 55, 80].map((w, i) => (
                          <div key={i} style={{ height:8, borderRadius:4, background:C.surf, marginBottom:8, width:`${w}%` }} />
                        ))}
                      </div>
                      {/* Signature area */}
                      <div style={{ marginTop:28, paddingTop:16, borderTop:`1px solid ${C.bdr}`, display:"flex", justifyContent:"space-between" }}>
                        <div>
                          <div style={{ width:100, height:1, background:C.bdr, marginBottom:4 }} />
                          <div style={{ fontSize:9, color:C.sub }}>Employee signature</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ width:100, height:1, background:C.bdr, marginBottom:4, marginLeft:"auto" }} />
                          <div style={{ fontSize:9, color:C.sub }}>Authorised signatory</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding:"12px 20px", borderTop:`1px solid ${C.bdr}`, display:"flex", justifyContent:"flex-end", background:C.wht, flexShrink:0 }}>
                <Btn variant="ghost" onClick={() => setDocPreviewItem(null)}>Close</Btn>
              </div>
            </div>
          </div>
        );
      })()}

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
              const targetId = profilePick ?? ME_ID;
              setEmployees(emps => emps.map(e => e.id === targetId ? { ...e, documents: [...e.documents, { n: docForm.name, v: false }] } : e));
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
                const newRow: any = { ...(res.row || {}), halfDay: leaveApply.halfDay, halfDayPart: leaveApply.halfDayPart };
                setLeaves(p => [...p, newRow]);
                // Add notifications
                const empName = isSA ? (employees.find(e => e.id === leaveApply.forEmpId)?.name ?? "Employee") : me.name;
                addNotif({ icon:"🗓", title:"Leave request submitted", body:`${empName} applied for ${leaveApply.type} · ${leaveApply.from} to ${leaveApply.to}`, forSA:true, forAll:false, forEmpIds:[] });
                if (!isSA) addNotif({ icon:"🗓", title:"Leave request sent", body:`Your ${leaveApply.type} request has been submitted to ${leaveApply.approver || "your approver"}`, forSA:false, forAll:false, forEmpIds:[ME_ID] });
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
            <Inp label="Department" opts={["—", ...departments]} value={empForm.dept} onChange={e=>setEmpForm({...empForm, dept:e.target.value})} />
            <Inp label="Manager" opts={["No Manager",...employees.map(e=>e.name)]} value={empForm.manager} onChange={e=>setEmpForm({...empForm, manager:e.target.value})} />
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, margin:"16px 0 10px", letterSpacing:1 }}>EMERGENCY CONTACT</div>
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr 1fr", gap:12 }}>
            <Inp label="Name" value={empForm.ecName||""} onChange={e=>setEmpForm({...empForm, ecName:e.target.value})} />
            <Inp label="Phone" type="tel" value={empForm.ecPhone||""} onChange={e=>setEmpForm({...empForm, ecPhone:e.target.value})} />
            <Inp label="Relationship" value={empForm.ecRel||""} onChange={e=>setEmpForm({...empForm, ecRel:e.target.value})} />
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.p, margin:"16px 0 10px", letterSpacing:1 }}>BANK DETAILS</div>
          <div style={{ display:"grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap:12 }}>
            <Inp label="Account Number" value={empForm.bankAcc||""} onChange={e=>setEmpForm({...empForm, bankAcc:e.target.value})} />
            <Inp label="IFSC Code" value={empForm.bankIfsc||""} onChange={e=>setEmpForm({...empForm, bankIfsc:e.target.value})} />
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
                  timeline: [...(e.timeline||[]), ...changes],
                  bankInfo: { accountNumber: empForm.bankAcc, ifsc: empForm.bankIfsc }
                } : e));
                toast("Changes saved successfully ✓");
              } else {
                const newId = Math.max(...employees.map(x => typeof x.id === 'number' ? x.id : 0), 0) + 1;
                setEmployees(emps => [{
                  id: newId,
                  avatarC: "#" + Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0'),
                  status: "active",
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
                  timeline: [{ type:"joined", label:`Joined the company (\${empForm.doj})`, ts: Date.now() }],
                  bankInfo: { accountNumber: empForm.bankAcc, ifsc: empForm.bankIfsc }
                }, ...emps]);
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


