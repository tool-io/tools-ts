import { blake512 } from "@noble/hashes/blake1.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake512);
export const blake512Tool = createTextHashTool({
  aliases: ["blake512", "blake-512"],
  algorithm: blake512,
  description:
    "Calculate a 512-bit digest with the original SHA-3 finalist BLAKE algorithm, distinct from the later BLAKE2 and BLAKE3 designs.",
  digestLength: 128,
  id: "hash/blake-512",
  keywords: ["blake", "blake-512"],
  title: "BLAKE-512 Hash Generator",
});
export const runBlake512 = blake512Tool.execute;
export default blake512Tool;
