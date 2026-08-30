import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x0000n,
    polynomial: 0x8005n,
    reflectInput: true,
    reflectOutput: true,
    width: 16,
    xorOutput: 0x0000n,
  });

export const example = createChecksumExample("BB3D");
export const crc16ArcTool = createChecksumTool({
  aliases: ["CRC-16/ARC"],
  calculate,
  checkValue: "BB3D",
  description:
    "Calculate CRC-16/ARC over UTF-8 text with polynomial 0x8005, initial value 0x0000, and final XOR 0x0000.",
  id: "checksum/crc-16-arc",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/ARC Checksum",
  width: 4,
});
export const runCrc16Arc = crc16ArcTool.execute;
export default crc16ArcTool;
