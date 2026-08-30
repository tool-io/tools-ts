import { sha224 } from "@noble/hashes/sha2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha224);
export const sha224Tool = createTextHashTool({
  aliases: ["sha224", "sha-224"],
  algorithm: sha224,
  description:
    "Calculate a SHA-224 digest from UTF-8 text using the 224-bit SHA-2 function standardized in FIPS 180-4.",
  digestLength: 56,
  id: "hash/sha-224",
  keywords: ["sha2", "sha224", "sha-224"],
  title: "SHA-224 Hash Generator",
});
export const runSha224 = sha224Tool.execute;
export default sha224Tool;
