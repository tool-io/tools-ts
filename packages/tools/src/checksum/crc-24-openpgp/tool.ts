import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xb704cen,
    polynomial: 0x864cfbn,
    reflectInput: false,
    reflectOutput: false,
    width: 24,
    xorOutput: 0x000000n,
  });

export const example = createChecksumExample("21CF02");
export const crc24OpenpgpTool = createChecksumTool({
  aliases: ["CRC-24/OpenPGP"],
  calculate,
  checkValue: "21CF02",
  description:
    "Calculate CRC-24/OpenPGP over UTF-8 text with polynomial 0x864CFB, initial value 0xB704CE, and final XOR 0x000000.",
  id: "checksum/crc-24-openpgp",
  keywords: ["crc", "24-bit"],
  title: "CRC-24/OpenPGP Checksum",
  width: 6,
});
export const runCrc24Openpgp = crc24OpenpgpTool.execute;
export default crc24OpenpgpTool;
