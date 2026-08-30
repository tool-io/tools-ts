import { keccak_224 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(keccak_224);
export const keccak224Tool = createTextHashTool({
  aliases: ["keccak224", "keccak-224"],
  algorithm: keccak_224,
  description:
    "Calculate a legacy Keccak-224 digest from UTF-8 text; its domain-separation padding differs from standardized SHA3-224.",
  digestLength: 56,
  id: "hash/keccak-224",
  keywords: ["keccak", "keccak-224"],
  title: "Keccak-224 Hash Generator",
});
export const runKeccak224 = keccak224Tool.execute;
export default keccak224Tool;
