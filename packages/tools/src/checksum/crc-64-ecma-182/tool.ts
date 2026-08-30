import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x0000000000000000n,
    polynomial: 0x42f0e1eba9ea3693n,
    reflectInput: false,
    reflectOutput: false,
    width: 64,
    xorOutput: 0x0000000000000000n,
  });

export const example = createChecksumExample("6C40DF5F0B497347");
export const crc64Ecma182Tool = createChecksumTool({
  aliases: ["CRC-64/ECMA-182"],
  calculate,
  checkValue: "6C40DF5F0B497347",
  description:
    "Calculate CRC-64/ECMA-182 over UTF-8 text with polynomial 0x42F0E1EBA9EA3693, initial value 0x0000000000000000, and final XOR 0x0000000000000000.",
  id: "checksum/crc-64-ecma-182",
  keywords: ["crc", "64-bit"],
  title: "CRC-64/ECMA-182 Checksum",
  width: 16,
});
export const runCrc64Ecma182 = crc64Ecma182Tool.execute;
export default crc64Ecma182Tool;
