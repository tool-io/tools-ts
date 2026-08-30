import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffn,
    polynomial: 0x04c11db7n,
    reflectInput: true,
    reflectOutput: true,
    width: 32,
    xorOutput: 0x00000000n,
  });

export const example = createChecksumExample("340BC6D9");
export const crc32JamcrcTool = createChecksumTool({
  aliases: ["CRC-32/JAMCRC"],
  calculate,
  checkValue: "340BC6D9",
  description:
    "Calculate CRC-32/JAMCRC over UTF-8 text with polynomial 0x04C11DB7, initial value 0xFFFFFFFF, and final XOR 0x00000000.",
  id: "checksum/crc-32-jamcrc",
  keywords: ["crc", "32-bit"],
  title: "CRC-32/JAMCRC Checksum",
  width: 8,
});
export const runCrc32Jamcrc = crc32JamcrcTool.execute;
export default crc32JamcrcTool;
