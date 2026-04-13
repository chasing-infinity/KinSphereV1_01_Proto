/**
 * Fix double-encoded UTF-8 in kinsphere_prototype.tsx
 *
 * Root cause: PowerShell's Get-Content read the UTF-8 file using the Windows
 * system codepage (Windows-1252). Each UTF-8 byte was treated as a
 * Windows-1252 character. When Set-Content wrote it back as UTF-8, every
 * non-ASCII byte got double-encoded.
 *
 * Fix: Read the corrupted file as UTF-8, re-interpret each character's
 * code-point as a raw byte (reversing the Windows-1252 -> Unicode step),
 * then decode those bytes as UTF-8 to recover the original text.
 */

const fs = require('fs');

// Windows-1252 byte → Unicode codepoint map for the 0x80-0x9F range
// (Latin-1 is identical to Unicode for 0x00-0xFF except this range)
const WIN1252_MAP = {
  0x80: 0x20AC, 0x81: 0x0081, 0x82: 0x201A, 0x83: 0x0192,
  0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021,
  0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039,
  0x8C: 0x0152, 0x8D: 0x008D, 0x8E: 0x017D, 0x8F: 0x008F,
  0x90: 0x0090, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
  0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A,
  0x9C: 0x0153, 0x9D: 0x009D, 0x9E: 0x017E, 0x9F: 0x0178,
};

// Build reverse map: Unicode codepoint → byte value
const REVERSE_WIN1252 = {};
for (const [byte, cp] of Object.entries(WIN1252_MAP)) {
  REVERSE_WIN1252[cp] = parseInt(byte);
}
// For 0x00-0x7F and 0xA0-0xFF, codepoint == byte value
for (let i = 0; i <= 0xFF; i++) {
  if (!WIN1252_MAP[i]) REVERSE_WIN1252[i] = i;
}

function unicodeToWin1252Byte(cp) {
  if (cp in REVERSE_WIN1252) return REVERSE_WIN1252[cp];
  return null; // not representable in Windows-1252
}

// Read the corrupted file as UTF-8 (as Node sees it)
const corrupt = fs.readFileSync('kinsphere_prototype.tsx', 'utf8');

// Convert each Unicode character back to a Windows-1252 byte
const rawBytes = [];
for (const ch of corrupt) {
  const cp = ch.codePointAt(0);
  if (cp <= 0x7F) {
    rawBytes.push(cp);
  } else {
    const b = unicodeToWin1252Byte(cp);
    if (b !== null) {
      rawBytes.push(b);
    } else {
      // Character not in Windows-1252 — keep as UTF-8 bytes (shouldn't happen)
      const encoded = Buffer.from(ch, 'utf8');
      for (const byte of encoded) rawBytes.push(byte);
    }
  }
}

// Now interpret those bytes as the original UTF-8
const fixed = Buffer.from(rawBytes).toString('utf8');

// Verify it looks better (count occurrences of the tell-tale corruption pattern)
const corruptCount = (corrupt.match(/Ã|â€|Â·|â‚¹/g) || []).length;
const fixedCount  = (fixed.match(/Ã|â€|Â·|â‚¹/g) || []).length;
console.log(`Corruption markers: before=${corruptCount}, after=${fixedCount}`);

if (fixedCount < corruptCount) {
  fs.writeFileSync('kinsphere_prototype.tsx', fixed, 'utf8');
  console.log('✓ Encoding fixed and file written.');
} else {
  console.log('⚠ Fix did not reduce corruption count — file NOT written. Check manually.');
}
