import { shake256 } from "@noble/hashes/sha3.js";
import { createTextXofExample, createTextXofTool } from "../shared.js";

export const example = createTextXofExample(shake256, 64);
export const shake256Tool = createTextXofTool({
  aliases: ["shake256", "shake-256"],
  algorithm: shake256,
  defaultOutputLengthBytes: 64,
  description:
    "Generate a variable-length SHAKE256 extendable-output digest from UTF-8 text with 256-bit collision-security capacity.",
  id: "hash/shake-256",
  keywords: ["fips-202", "shake"],
  title: "SHAKE256 Hash Generator",
});
export const runShake256 = shake256Tool.execute;
export default shake256Tool;
