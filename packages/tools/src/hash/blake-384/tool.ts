import { blake384 } from "@noble/hashes/blake1.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake384);
export const blake384Tool = createTextHashTool({
  aliases: ["blake384", "blake-384"],
  algorithm: blake384,
  description:
    "Calculate a 384-bit digest with the original SHA-3 finalist BLAKE algorithm, distinct from the later BLAKE2 and BLAKE3 designs.",
  digestLength: 96,
  id: "hash/blake-384",
  keywords: ["blake", "blake-384"],
  title: "BLAKE-384 Hash Generator",
});
export const runBlake384 = blake384Tool.execute;
export default blake384Tool;
