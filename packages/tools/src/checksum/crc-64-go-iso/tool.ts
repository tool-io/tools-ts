import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffffffffffn,
    polynomial: 0x000000000000001bn,
    reflectInput: true,
    reflectOutput: true,
    width: 64,
    xorOutput: 0xffffffffffffffffn,
  });

export const example = createChecksumExample("B90956C775A41001");
export const crc64GoIsoTool = createChecksumTool({
  aliases: ["CRC-64/GO-ISO"],
  calculate,
  checkValue: "B90956C775A41001",
  description:
    "Calculate CRC-64/GO-ISO over UTF-8 text with polynomial 0x000000000000001B, initial value 0xFFFFFFFFFFFFFFFF, and final XOR 0xFFFFFFFFFFFFFFFF.",
  id: "checksum/crc-64-go-iso",
  keywords: ["crc", "64-bit"],
  title: "CRC-64/GO-ISO Checksum",
  width: 16,
});
export const runCrc64GoIso = crc64GoIsoTool.execute;
export default crc64GoIsoTool;
