import { sha512_224 } from "@noble/hashes/sha2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha512_224);
export const sha512224Tool = createTextHashTool({
  aliases: ["sha512224", "sha-512-224"],
  algorithm: sha512_224,
  description:
    "Calculate a SHA-512/224 digest from UTF-8 text using SHA-512's compression function with its standardized 224-bit initialization and output.",
  digestLength: 56,
  id: "hash/sha-512-224",
  keywords: ["sha2", "sha512/224", "sha-512/224"],
  title: "SHA-512/224 Hash Generator",
});
export const runSha512224 = sha512224Tool.execute;
export default sha512224Tool;
