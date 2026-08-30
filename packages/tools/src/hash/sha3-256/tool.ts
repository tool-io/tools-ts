import { sha3_256 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha3_256);
export const sha3256Tool = createTextHashTool({
  aliases: ["sha3256", "sha3-256"],
  algorithm: sha3_256,
  description:
    "Calculate a 256-bit SHA-3 digest from UTF-8 text using the FIPS 202 Keccak-based construction.",
  digestLength: 64,
  id: "hash/sha3-256",
  keywords: ["sha3", "sha3-256"],
  title: "SHA3-256 Hash Generator",
});
export const runSha3256 = sha3256Tool.execute;
export default sha3256Tool;
