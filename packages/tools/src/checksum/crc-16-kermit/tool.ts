import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x0000n,
    polynomial: 0x1021n,
    reflectInput: true,
    reflectOutput: true,
    width: 16,
    xorOutput: 0x0000n,
  });

export const example = createChecksumExample("2189");
export const crc16KermitTool = createChecksumTool({
  aliases: ["CRC-16/KERMIT"],
  calculate,
  checkValue: "2189",
  description:
    "Calculate CRC-16/KERMIT over UTF-8 text with polynomial 0x1021, initial value 0x0000, and final XOR 0x0000.",
  id: "checksum/crc-16-kermit",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/KERMIT Checksum",
  width: 4,
});
export const runCrc16Kermit = crc16KermitTool.execute;
export default crc16KermitTool;
