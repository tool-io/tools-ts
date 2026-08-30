import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0x0000n,
    polynomial: 0x3d65n,
    reflectInput: true,
    reflectOutput: true,
    width: 16,
    xorOutput: 0xffffn,
  });

export const example = createChecksumExample("EA82");
export const crc16DnpTool = createChecksumTool({
  aliases: ["CRC-16/DNP"],
  calculate,
  checkValue: "EA82",
  description:
    "Calculate CRC-16/DNP over UTF-8 text with polynomial 0x3D65, initial value 0x0000, and final XOR 0xFFFF.",
  id: "checksum/crc-16-dnp",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/DNP Checksum",
  width: 4,
});
export const runCrc16Dnp = crc16DnpTool.execute;
export default crc16DnpTool;
