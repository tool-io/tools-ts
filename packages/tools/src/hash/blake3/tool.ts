import { blake3 } from "@noble/hashes/blake3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake3);
export const blake3Tool = createTextHashTool({
  aliases: ["blake 3 hash"],
  algorithm: blake3,
  description:
    "Calculate the default 256-bit BLAKE3 digest of UTF-8 text using BLAKE3's tree-hash construction.",
  digestLength: 64,
  id: "hash/blake3",
  keywords: ["blake3", "tree hash"],
  title: "BLAKE3 Hash Generator",
});
export const runBlake3 = blake3Tool.execute;
export default blake3Tool;
