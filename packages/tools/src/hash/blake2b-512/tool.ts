import { blake2b } from "@noble/hashes/blake2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake2b);
export const blake2b512Tool = createTextHashTool({
  aliases: ["blake2b512", "blake2b-512"],
  algorithm: blake2b,
  description:
    "Calculate the standard 512-bit BLAKE2b digest of UTF-8 text, optimized for 64-bit software platforms.",
  digestLength: 128,
  id: "hash/blake2b-512",
  keywords: ["blake2", "blake2b", "blake2b-512"],
  title: "BLAKE2b-512 Hash Generator",
});
export const runBlake2b512 = blake2b512Tool.execute;
export default blake2b512Tool;
