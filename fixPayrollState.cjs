const fs = require('fs');
let c = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// 1. Extend Demo Payslips
c = c.replace(
  '{ y: 2026, months: [0, 1, 2, 3, 4, 5] },',
  '{ y: 2026, months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },'
);

// 2. Add saPayslips state
const empStateAnchor = 'const [employees, setEmployees] = useState(() => JSON.parse(JSON.stringify(EMPS)));';
if (c.indexOf(empStateAnchor) !== -1) {
    c = c.replace(
      empStateAnchor,
      `const [employees, setEmployees] = useState(() => JSON.parse(JSON.stringify(EMPS)));\n  const [saPayslips, setSaPayslips] = useState(DEMO_PAYSLIPS);`
    );
}

// 3. Update filter to use saPayslips state instead of DEMO_PAYSLIPS constant
c = c.replace(
  'const saPayslipRows = DEMO_PAYSLIPS.filter(',
  'const saPayslipRows = saPayslips.filter('
);
c = c.replace(
  'const myPayslipRows = DEMO_PAYSLIPS.filter(',
  'const myPayslipRows = saPayslips.filter('
);

// 4. Pass setSaPayslips to PayrollWizardModal
const modalCallAnchor = 'saPayslips={DEMO_PAYSLIPS}';
if (c.indexOf(modalCallAnchor) !== -1) {
    c = c.replace(
      modalCallAnchor,
      'saPayslips={saPayslips} setSaPayslips={setSaPayslips}'
    );
} else {
    // If it was already using saPayslips
    c = c.replace(
      'saPayslips={saPayslips}',
      'saPayslips={saPayslips} setSaPayslips={setSaPayslips}'
    );
}

// 5. Update PayrollWizardModal definition
const modalDefAnchor = 'const PayrollWizardModal = ({ \n  onClose, saPayslips, employees, processedPayments, setProcessedPayments, ';
const modalDefAnchorLine = 'const PayrollWizardModal = ({ onClose, saPayslips, employees, processedPayments, setProcessedPayments, editedSalaries';
// Wait, the params might be split across lines. Let's do a reliable replace:
c = c.replace(
  /const PayrollWizardModal = \(\{[^}]+\}\) => \{/g,
  (match) => {
     if (match.includes('setSaPayslips')) return match;
     return match.replace('saPayslips,', 'saPayslips, setSaPayslips,');
  }
);

// 6. Update handlePay in PayrollWizardModal to push new payslips
const handlePayAnchor = `const pState = validUnpaid.find(x => x.p.id === id);\n        if (pState) totalAmt += parseInr(editedSalaries[id] || pState.p.net);\n      });`;
if (c.indexOf(handlePayAnchor) !== -1) {
    const replacement = `const pState = validUnpaid.find(x => x.p.id === id);
        if (pState) {
           totalAmt += parseInr(editedSalaries[id] || pState.p.net);
           if (!saPayslips.find(x => x.id === id)) {
              newGlobalPayslips.push({
                 id: id,
                 empId: pState.emp.id,
                 ini: pState.emp.ini,
                 name: pState.emp.name,
                 dept: pState.emp.dept,
                 year: currentYear.toString(), // ensure year is string if expected
                 month: selectedMonthIndex,
                 monthIndex: selectedMonthIndex,
                 monthLabel: \`\${MONTHS_SHORT[selectedMonthIndex]} \${currentYear}\`,
                 credited: new Date().toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"}),
                 gross: \`₹\${Math.round((parseInt(pState.p.net.replace(/\\D/g,'')) || 50000) * 1.38).toLocaleString("en-IN")}\`,
                 net: pState.p.net,
                 status: "Unpaid" // will be immediately processed
              });
           }
        }
      });
      if (newGlobalPayslips.length > 0) {
         setSaPayslips(prev => [...prev, ...newGlobalPayslips]);
      }`;
      
    // I also need to declare newGlobalPayslips inside handlePay
    const handlePayStartAnchor = `let totalAmt = 0;`;
    c = c.replace('let totalAmt = 0;', 'let totalAmt = 0;\n      const newGlobalPayslips = [];');
    c = c.replace(handlePayAnchor, replacement);
}

fs.writeFileSync('kinsphere_prototype.tsx', c);
console.log('Fixed Payroll Unpaid Bug.');
