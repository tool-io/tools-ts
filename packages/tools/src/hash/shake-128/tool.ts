import { shake128 } from "@noble/hashes/sha3.js";
import { createTextXofExample, createTextXofTool } from "../shared.js";

export const example = createTextXofExample(shake128, 32);
export const shake128Tool = createTextXofTool({
  aliases: ["shake128", "shake-128"],
  algorithm: shake128,
  defaultOutputLengthBytes: 32,
  description:
    "Generate a variable-length SHAKE128 extendable-output digest from UTF-8 text with 128-bit collision-security capacity.",
  id: "hash/shake-128",
  keywords: ["fips-202", "shake"],
  title: "SHAKE128 Hash Generator",
});
export const runShake128 = shake128Tool.execute;
export default shake128Tool;
