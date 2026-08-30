import { blake2s } from "@noble/hashes/blake2.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake2s);
export const blake2s256Tool = createTextHashTool({
  aliases: ["blake2s256", "blake2s-256"],
  algorithm: blake2s,
  description:
    "Calculate the standard 256-bit BLAKE2s digest of UTF-8 text, designed for efficient use on smaller 8- to 32-bit platforms.",
  digestLength: 64,
  id: "hash/blake2s-256",
  keywords: ["blake2", "blake2s", "blake2s-256"],
  title: "BLAKE2s-256 Hash Generator",
});
export const runBlake2s256 = blake2s256Tool.execute;
export default blake2s256Tool;
