import { crc } from "../crc.js";
import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint =>
  crc(bytes, {
    init: 0xffffn,
    polynomial: 0x8005n,
    reflectInput: true,
    reflectOutput: true,
    width: 16,
    xorOutput: 0x0000n,
  });

export const example = createChecksumExample("4B37");
export const crc16ModbusTool = createChecksumTool({
  aliases: ["CRC-16/MODBUS"],
  calculate,
  checkValue: "4B37",
  description:
    "Calculate CRC-16/MODBUS over UTF-8 text with polynomial 0x8005, initial value 0xFFFF, and final XOR 0x0000.",
  id: "checksum/crc-16-modbus",
  keywords: ["crc", "16-bit"],
  title: "CRC-16/MODBUS Checksum",
  width: 4,
});
export const runCrc16Modbus = crc16ModbusTool.execute;
export default crc16ModbusTool;
