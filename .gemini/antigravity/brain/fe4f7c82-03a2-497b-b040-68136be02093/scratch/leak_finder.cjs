
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Titli\\Downloads\\KinSphereV1_01_Proto\\.gemini\\antigravity\\brain\\fe4f7c82-03a2-497b-b040-68136be02093\\scratch\\full_trace.log', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
     if (lines[i].includes('b[0]')) {
          // console.log("Still hitting zero at " + lines[i]);
     } else if (lines[i].includes('b[1] open {')) {
          // Potential component start
          let hitZeroAgain = false;
          for (let j = i + 1; j < lines.length; j++) {
               if (lines[j].includes('b[0]')) {
                    hitZeroAgain = true;
                    break;
               }
          }
          if (!hitZeroAgain) {
               console.log("FIRST LEAK AT: " + lines[i]);
               process.exit(0);
          }
     }
}
