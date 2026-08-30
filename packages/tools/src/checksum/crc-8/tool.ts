import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x00n,
    polynomial: 0x07n,
    reflectInput: false,
    reflectOutput: false,
    width: 8,
    xorOutput: 0x00n,
  });

export const example = createChecksumExample("F4");
export const crc8Tool = createChecksumTool({
  aliases: ["CRC-8/SMBus"],
  calculate,
  checkValue: "F4",
  description:
    "Calculate CRC-8/SMBus over UTF-8 text with polynomial 0x07, initial value 0x00, and final XOR 0x00.",
  id: "checksum/crc-8",
  keywords: ["crc", "8-bit"],
  title: "CRC-8/SMBus Checksum",
  width: 2,
});
export const runCrc8 = crc8Tool.execute;
export default crc8Tool;
