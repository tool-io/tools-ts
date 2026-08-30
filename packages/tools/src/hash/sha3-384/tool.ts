import { sha3_384 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha3_384);
export const sha3384Tool = createTextHashTool({
  aliases: ["sha3384", "sha3-384"],
  algorithm: sha3_384,
  description:
    "Calculate a 384-bit SHA-3 digest from UTF-8 text using the FIPS 202 Keccak-based construction.",
  digestLength: 96,
  id: "hash/sha3-384",
  keywords: ["sha3", "sha3-384"],
  title: "SHA3-384 Hash Generator",
});
export const runSha3384 = sha3384Tool.execute;
export default sha3384Tool;
