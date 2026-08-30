import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint => {
  return BigInt(bytes.reduce((value, byte) => value ^ byte, 0));
};

export const example = createChecksumExample("31");
export const xor8Tool = createChecksumTool({
  aliases: ["xor checksum"],
  calculate,
  checkValue: "31",
  description:
    "Calculate an 8-bit block check character by XORing every UTF-8 input byte.",
  id: "checksum/xor-8",
  title: "XOR-8 Checksum",
  width: 2,
});
export const runXor8 = xor8Tool.execute;
export default xor8Tool;
