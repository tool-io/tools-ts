import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffn,
    polynomial: 0x04c11db7n,
    reflectInput: false,
    reflectOutput: false,
    width: 32,
    xorOutput: 0xffffffffn,
  });

export const example = createChecksumExample("FC891918");
export const crc32Bzip2Tool = createChecksumTool({
  aliases: ["CRC-32/BZIP2"],
  calculate,
  checkValue: "FC891918",
  description:
    "Calculate CRC-32/BZIP2 over UTF-8 text with polynomial 0x04C11DB7, initial value 0xFFFFFFFF, and final XOR 0xFFFFFFFF.",
  id: "checksum/crc-32-bzip2",
  keywords: ["crc", "32-bit"],
  title: "CRC-32/BZIP2 Checksum",
  width: 8,
});
export const runCrc32Bzip2 = crc32Bzip2Tool.execute;
export default crc32Bzip2Tool;
