import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffffffffffn,
    polynomial: 0x42f0e1eba9ea3693n,
    reflectInput: true,
    reflectOutput: true,
    width: 64,
    xorOutput: 0xffffffffffffffffn,
  });

export const example = createChecksumExample("995DC9BBDF1939FA");
export const crc64XzTool = createChecksumTool({
  aliases: ["CRC-64/XZ"],
  calculate,
  checkValue: "995DC9BBDF1939FA",
  description:
    "Calculate CRC-64/XZ over UTF-8 text with polynomial 0x42F0E1EBA9EA3693, initial value 0xFFFFFFFFFFFFFFFF, and final XOR 0xFFFFFFFFFFFFFFFF.",
  id: "checksum/crc-64-xz",
  keywords: ["crc", "64-bit"],
  title: "CRC-64/XZ Checksum",
  width: 16,
});
export const runCrc64Xz = crc64XzTool.execute;
export default crc64XzTool;
