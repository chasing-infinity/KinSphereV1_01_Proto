
const fs = require('fs');
const log = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\.gemini\\antigravity\\brain\\fe4f7c82-03a2-497b-b040-68136be02093\\scratch\\full_trace.log', 'utf8');
const lines = log.split('\n');

function getBalanceAt(lineNum) {
    let lastBal = 0;
    for (let l of lines) {
        let m = l.match(/L(\d+): b\[(-?\d+)\]/);
        if (m) {
            let ln = parseInt(m[1]);
            let bal = parseInt(m[2]);
            if (ln > lineNum) return lastBal;
            lastBal = bal;
        }
    }
    return lastBal;
}

console.log("1000: " + getBalanceAt(1000));
console.log("2000: " + getBalanceAt(2000));
console.log("3000: " + getBalanceAt(3000));
console.log("4000: " + getBalanceAt(4000));
