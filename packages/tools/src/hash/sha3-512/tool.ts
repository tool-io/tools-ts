import { sha3_512 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha3_512);
export const sha3512Tool = createTextHashTool({
  aliases: ["sha3512", "sha3-512"],
  algorithm: sha3_512,
  description:
    "Calculate a 512-bit SHA-3 digest from UTF-8 text using the FIPS 202 Keccak-based construction.",
  digestLength: 128,
  id: "hash/sha3-512",
  keywords: ["sha3", "sha3-512"],
  title: "SHA3-512 Hash Generator",
});
export const runSha3512 = sha3512Tool.execute;
export default sha3512Tool;
