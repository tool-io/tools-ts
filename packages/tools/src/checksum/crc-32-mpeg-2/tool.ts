import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffn,
    polynomial: 0x04c11db7n,
    reflectInput: false,
    reflectOutput: false,
    width: 32,
    xorOutput: 0x00000000n,
  });

export const example = createChecksumExample("0376E6E7");
export const crc32Mpeg2Tool = createChecksumTool({
  aliases: ["CRC-32/MPEG-2"],
  calculate,
  checkValue: "0376E6E7",
  description:
    "Calculate CRC-32/MPEG-2 over UTF-8 text with polynomial 0x04C11DB7, initial value 0xFFFFFFFF, and final XOR 0x00000000.",
  id: "checksum/crc-32-mpeg-2",
  keywords: ["crc", "32-bit"],
  title: "CRC-32/MPEG-2 Checksum",
  width: 8,
});
export const runCrc32Mpeg2 = crc32Mpeg2Tool.execute;
export default crc32Mpeg2Tool;
