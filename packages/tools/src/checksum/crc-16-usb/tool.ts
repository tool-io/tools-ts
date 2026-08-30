import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffn,
    polynomial: 0x8005n,
    reflectInput: true,
    reflectOutput: true,
    width: 16,
    xorOutput: 0xffffn,
  });

export const example = createChecksumExample("B4C8");
export const crc16UsbTool = createChecksumTool({
  aliases: ["CRC-16/USB"],
  calculate,
  checkValue: "B4C8",
  description:
    "Calculate CRC-16/USB over UTF-8 text with polynomial 0x8005, initial value 0xFFFF, and final XOR 0xFFFF.",
  id: "checksum/crc-16-usb",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/USB Checksum",
  width: 4,
});
export const runCrc16Usb = crc16UsbTool.execute;
export default crc16UsbTool;
