import { sha512 } from "@noble/hashes/sha2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha512);
export const sha512Tool = createTextHashTool({
  aliases: ["sha512 generator", "text to sha512", "text to sha-512"],
  algorithm: sha512,
  description:
    "Calculate a SHA-512 digest from UTF-8 text and return its 512-bit value as 128 lowercase hexadecimal characters.",
  digestLength: 128,
  id: "hash/sha-512",
  keywords: ["sha2", "sha512", "sha-512"],
  title: "SHA-512 Hash Generator",
});
export const runSha512 = sha512Tool.execute;
export default sha512Tool;
