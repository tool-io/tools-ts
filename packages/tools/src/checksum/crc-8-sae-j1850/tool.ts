import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffn,
    polynomial: 0x1dn,
    reflectInput: false,
    reflectOutput: false,
    width: 8,
    xorOutput: 0xffn,
  });

export const example = createChecksumExample("4B");
export const crc8SaeJ1850Tool = createChecksumTool({
  aliases: ["CRC-8/SAE-J1850"],
  calculate,
  checkValue: "4B",
  description:
    "Calculate CRC-8/SAE-J1850 over UTF-8 text with polynomial 0x1D, initial value 0xFF, and final XOR 0xFF.",
  id: "checksum/crc-8-sae-j1850",
  keywords: ["crc", "8-bit"],
  title: "CRC-8/SAE-J1850 Checksum",
  width: 2,
});
export const runCrc8SaeJ1850 = crc8SaeJ1850Tool.execute;
export default crc8SaeJ1850Tool;
