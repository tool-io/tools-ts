import { sha3_224 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha3_224);
export const sha3224Tool = createTextHashTool({
  aliases: ["sha3224", "sha3-224"],
  algorithm: sha3_224,
  description:
    "Calculate a 224-bit SHA-3 digest from UTF-8 text using the FIPS 202 Keccak-based construction.",
  digestLength: 56,
  id: "hash/sha3-224",
  keywords: ["sha3", "sha3-224"],
  title: "SHA3-224 Hash Generator",
});
export const runSha3224 = sha3224Tool.execute;
export default sha3224Tool;
