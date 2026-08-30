import { keccak_384 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(keccak_384);
export const keccak384Tool = createTextHashTool({
  aliases: ["keccak384", "keccak-384"],
  algorithm: keccak_384,
  description:
    "Calculate a legacy Keccak-384 digest from UTF-8 text; its domain-separation padding differs from standardized SHA3-384.",
  digestLength: 96,
  id: "hash/keccak-384",
  keywords: ["keccak", "keccak-384"],
  title: "Keccak-384 Hash Generator",
});
export const runKeccak384 = keccak384Tool.execute;
export default keccak384Tool;
