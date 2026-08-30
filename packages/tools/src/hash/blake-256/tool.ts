import { blake256 } from "@noble/hashes/blake1.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake256);
export const blake256Tool = createTextHashTool({
  aliases: ["blake256", "blake-256"],
  algorithm: blake256,
  description:
    "Calculate a 256-bit digest with the original SHA-3 finalist BLAKE algorithm, distinct from the later BLAKE2 and BLAKE3 designs.",
  digestLength: 64,
  id: "hash/blake-256",
  keywords: ["blake", "blake-256"],
  title: "BLAKE-256 Hash Generator",
});
export const runBlake256 = blake256Tool.execute;
export default blake256Tool;
