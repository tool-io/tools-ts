import { blake224 } from "@noble/hashes/blake1.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(blake224);
export const blake224Tool = createTextHashTool({
  aliases: ["blake224", "blake-224"],
  algorithm: blake224,
  description:
    "Calculate a 224-bit digest with the original SHA-3 finalist BLAKE algorithm, distinct from the later BLAKE2 and BLAKE3 designs.",
  digestLength: 56,
  id: "hash/blake-224",
  keywords: ["blake", "blake-224"],
  title: "BLAKE-224 Hash Generator",
});
export const runBlake224 = blake224Tool.execute;
export default blake224Tool;
