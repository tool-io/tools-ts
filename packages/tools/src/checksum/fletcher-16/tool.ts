import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint => {
  let sum1 = 0;
  let sum2 = 0;
  for (const byte of bytes) {
    sum1 = (sum1 + byte) % 255;
    sum2 = (sum2 + sum1) % 255;
  }
  return BigInt((sum2 << 8) | sum1);
};

export const example = createChecksumExample("1EDE");
export const fletcher16Tool = createChecksumTool({
  aliases: ["fletcher checksum"],
  calculate,
  checkValue: "1EDE",
  description:
    "Calculate the two-sum Fletcher-16 checksum of UTF-8 text modulo 255.",
  id: "checksum/fletcher-16",
  title: "Fletcher-16 Checksum",
  width: 4,
});
export const runFletcher16 = fletcher16Tool.execute;
export default fletcher16Tool;
