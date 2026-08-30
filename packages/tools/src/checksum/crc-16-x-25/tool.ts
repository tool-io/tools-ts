import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffn,
    polynomial: 0x1021n,
    reflectInput: true,
    reflectOutput: true,
    width: 16,
    xorOutput: 0xffffn,
  });

export const example = createChecksumExample("906E");
export const crc16X25Tool = createChecksumTool({
  aliases: ["CRC-16/IBM-SDLC (X-25)"],
  calculate,
  checkValue: "906E",
  description:
    "Calculate CRC-16/IBM-SDLC (X-25) over UTF-8 text with polynomial 0x1021, initial value 0xFFFF, and final XOR 0xFFFF.",
  id: "checksum/crc-16-x-25",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/IBM-SDLC (X-25) Checksum",
  width: 4,
});
export const runCrc16X25 = crc16X25Tool.execute;
export default crc16X25Tool;
