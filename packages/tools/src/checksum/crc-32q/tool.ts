import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x00000000n,
    polynomial: 0x814141abn,
    reflectInput: false,
    reflectOutput: false,
    width: 32,
    xorOutput: 0x00000000n,
  });

export const example = createChecksumExample("3010BF7F");
export const crc32qTool = createChecksumTool({
  aliases: ["CRC-32Q"],
  calculate,
  checkValue: "3010BF7F",
  description:
    "Calculate CRC-32Q over UTF-8 text with polynomial 0x814141AB, initial value 0x00000000, and final XOR 0x00000000.",
  id: "checksum/crc-32q",
  keywords: ["crc", "32-bit"],
  title: "CRC-32Q Checksum",
  width: 8,
});
export const runCrc32q = crc32qTool.execute;
export default crc32qTool;
