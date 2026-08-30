import { sha256 } from "@noble/hashes/sha2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha256);
export const sha256Tool = createTextHashTool({
  aliases: ["sha256 generator", "text to sha256", "text to sha-256"],
  algorithm: sha256,
  description:
    "Calculate a SHA-256 digest from UTF-8 text and return its 256-bit value as 64 lowercase hexadecimal characters.",
  digestLength: 64,
  id: "hash/sha-256",
  keywords: ["sha2", "sha256", "sha-256"],
  title: "SHA-256 Hash Generator",
});
export const runSha256 = sha256Tool.execute;
export default sha256Tool;
