import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x00000000n,
    polynomial: 0x04c11db7n,
    reflectInput: false,
    reflectOutput: false,
    width: 32,
    xorOutput: 0xffffffffn,
  });

export const example = createChecksumExample("765E7680");
export const crc32PosixTool = createChecksumTool({
  aliases: ["CRC-32/POSIX"],
  calculate,
  checkValue: "765E7680",
  description:
    "Calculate CRC-32/POSIX over UTF-8 text with polynomial 0x04C11DB7, initial value 0x00000000, and final XOR 0xFFFFFFFF.",
  id: "checksum/crc-32-posix",
  keywords: ["crc", "32-bit"],
  title: "CRC-32/POSIX Checksum",
  width: 8,
});
export const runCrc32Posix = crc32PosixTool.execute;
export default crc32PosixTool;
