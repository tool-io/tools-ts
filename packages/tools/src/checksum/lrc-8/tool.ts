import { createChecksumExample, createChecksumTool } from "../shared.js";

const calculate = (bytes: readonly number[]): bigint => {
  const sum = bytes.reduce((total, byte) => (total + byte) & 0xff, 0);
  return BigInt(-sum & 0xff);
};

export const example = createChecksumExample("23");
export const lrc8Tool = createChecksumTool({
  aliases: ["longitudinal redundancy check"],
  calculate,
  checkValue: "23",
  description:
    "Calculate an 8-bit longitudinal redundancy check as the two's complement of the UTF-8 byte sum.",
  id: "checksum/lrc-8",
  title: "8-bit LRC Checksum",
  width: 2,
});
export const runLrc8 = lrc8Tool.execute;
export default lrc8Tool;
