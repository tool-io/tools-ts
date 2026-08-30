import { sha384 } from "@noble/hashes/sha2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha384);
export const sha384Tool = createTextHashTool({
  aliases: ["sha384 generator", "text to sha384", "text to sha-384"],
  algorithm: sha384,
  description:
    "Calculate a SHA-384 digest from UTF-8 text and return its 384-bit value as 96 lowercase hexadecimal characters.",
  digestLength: 96,
  id: "hash/sha-384",
  keywords: ["sha2", "sha384", "sha-384"],
  title: "SHA-384 Hash Generator",
});
export const runSha384 = sha384Tool.execute;
export default sha384Tool;
