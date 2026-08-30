import { sha512_256 } from "@noble/hashes/sha2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha512_256);
export const sha512256Tool = createTextHashTool({
  aliases: ["sha512256", "sha-512-256"],
  algorithm: sha512_256,
  description:
    "Calculate a SHA-512/256 digest from UTF-8 text using SHA-512's compression function with its standardized 256-bit initialization and output.",
  digestLength: 64,
  id: "hash/sha-512-256",
  keywords: ["sha2", "sha512/256", "sha-512/256"],
  title: "SHA-512/256 Hash Generator",
});
export const runSha512256 = sha512256Tool.execute;
export default sha512256Tool;
