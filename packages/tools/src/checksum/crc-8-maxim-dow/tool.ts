import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x00n,
    polynomial: 0x31n,
    reflectInput: true,
    reflectOutput: true,
    width: 8,
    xorOutput: 0x00n,
  });

export const example = createChecksumExample("A1");
export const crc8MaximDowTool = createChecksumTool({
  aliases: ["CRC-8/MAXIM-DOW"],
  calculate,
  checkValue: "A1",
  description:
    "Calculate CRC-8/MAXIM-DOW over UTF-8 text with polynomial 0x31, initial value 0x00, and final XOR 0x00.",
  id: "checksum/crc-8-maxim-dow",
  keywords: ["crc", "8-bit"],
  title: "CRC-8/MAXIM-DOW Checksum",
  width: 2,
});
export const runCrc8MaximDow = crc8MaximDowTool.execute;
export default crc8MaximDowTool;
