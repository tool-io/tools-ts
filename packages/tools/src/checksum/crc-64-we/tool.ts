import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffffffffffn,
    polynomial: 0x42f0e1eba9ea3693n,
    reflectInput: false,
    reflectOutput: false,
    width: 64,
    xorOutput: 0xffffffffffffffffn,
  });

export const example = createChecksumExample("62EC59E3F1A4F00A");
export const crc64WeTool = createChecksumTool({
  aliases: ["CRC-64/WE"],
  calculate,
  checkValue: "62EC59E3F1A4F00A",
  description:
    "Calculate CRC-64/WE over UTF-8 text with polynomial 0x42F0E1EBA9EA3693, initial value 0xFFFFFFFFFFFFFFFF, and final XOR 0xFFFFFFFFFFFFFFFF.",
  id: "checksum/crc-64-we",
  keywords: ["crc", "64-bit"],
  title: "CRC-64/WE Checksum",
  width: 16,
});
export const runCrc64We = crc64WeTool.execute;
export default crc64WeTool;
