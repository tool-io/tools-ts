import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x0000n,
    polynomial: 0x1021n,
    reflectInput: false,
    reflectOutput: false,
    width: 16,
    xorOutput: 0x0000n,
  });

export const example = createChecksumExample("31C3");
export const crc16XmodemTool = createChecksumTool({
  aliases: ["CRC-16/XMODEM"],
  calculate,
  checkValue: "31C3",
  description:
    "Calculate CRC-16/XMODEM over UTF-8 text with polynomial 0x1021, initial value 0x0000, and final XOR 0x0000.",
  id: "checksum/crc-16-xmodem",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/XMODEM Checksum",
  width: 4,
});
export const runCrc16Xmodem = crc16XmodemTool.execute;
export default crc16XmodemTool;
