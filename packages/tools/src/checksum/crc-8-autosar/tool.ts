import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffn,
    polynomial: 0x2fn,
    reflectInput: false,
    reflectOutput: false,
    width: 8,
    xorOutput: 0xffn,
  });

export const example = createChecksumExample("DF");
export const crc8AutosarTool = createChecksumTool({
  aliases: ["CRC-8/AUTOSAR"],
  calculate,
  checkValue: "DF",
  description:
    "Calculate CRC-8/AUTOSAR over UTF-8 text with polynomial 0x2F, initial value 0xFF, and final XOR 0xFF.",
  id: "checksum/crc-8-autosar",
  keywords: ["crc", "8-bit"],
  title: "CRC-8/AUTOSAR Checksum",
  width: 2,
});
export const runCrc8Autosar = crc8AutosarTool.execute;
export default crc8AutosarTool;
