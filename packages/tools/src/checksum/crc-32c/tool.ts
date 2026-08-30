import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffn,
    polynomial: 0x1edc6f41n,
    reflectInput: true,
    reflectOutput: true,
    width: 32,
    xorOutput: 0xffffffffn,
  });

export const example = createChecksumExample("E3069283");
export const crc32cTool = createChecksumTool({
  aliases: ["CRC-32C (Castagnoli)"],
  calculate,
  checkValue: "E3069283",
  description:
    "Calculate CRC-32C (Castagnoli) over UTF-8 text with polynomial 0x1EDC6F41, initial value 0xFFFFFFFF, and final XOR 0xFFFFFFFF.",
  id: "checksum/crc-32c",
  keywords: ["crc", "32-bit"],
  title: "CRC-32C (Castagnoli) Checksum",
  width: 8,
});
export const runCrc32c = crc32cTool.execute;
export default crc32cTool;
