import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffffffn,
    polynomial: 0x741b8cd7n,
    reflectInput: true,
    reflectOutput: true,
    width: 32,
    xorOutput: 0xffffffffn,
  });

export const example = createChecksumExample("2D3DD0AE");
export const crc32KoopmanTool = createChecksumTool({
  aliases: ["CRC-32/KOOPMAN"],
  calculate,
  checkValue: "2D3DD0AE",
  description:
    "Calculate CRC-32/KOOPMAN over UTF-8 text with polynomial 0x741B8CD7, initial value 0xFFFFFFFF, and final XOR 0xFFFFFFFF.",
  id: "checksum/crc-32-koopman",
  keywords: ["crc", "32-bit"],
  title: "CRC-32/KOOPMAN Checksum",
  width: 8,
});
export const runCrc32Koopman = crc32KoopmanTool.execute;
export default crc32KoopmanTool;
