import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint => {
  let sum = 0;
  for (let index = 0; index < bytes.length; index += 2) {
    sum += (bytes[index]! << 8) | (bytes[index + 1] ?? 0);
    sum = (sum & 0xffff) + (sum >>> 16);
  }
  sum = (sum & 0xffff) + (sum >>> 16);
  return BigInt(~sum & 0xffff);
};

export const example = createChecksumExample("F62A");
export const internet16Tool = createChecksumTool({
  aliases: ["ip checksum"],
  calculate,
  checkValue: "F62A",
  description:
    "Calculate the 16-bit one's-complement Internet checksum used by IP, TCP, UDP, and related protocols over UTF-8 bytes.",
  id: "checksum/internet-16",
  title: "Internet Checksum",
  width: 4,
});
export const runInternet16 = internet16Tool.execute;
export default internet16Tool;
