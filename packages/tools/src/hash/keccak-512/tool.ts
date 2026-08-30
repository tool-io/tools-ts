import { keccak_512 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(keccak_512);
export const keccak512Tool = createTextHashTool({
  aliases: ["keccak512", "keccak-512"],
  algorithm: keccak_512,
  description:
    "Calculate a legacy Keccak-512 digest from UTF-8 text; its domain-separation padding differs from standardized SHA3-512.",
  digestLength: 128,
  id: "hash/keccak-512",
  keywords: ["keccak", "keccak-512"],
  title: "Keccak-512 Hash Generator",
});
export const runKeccak512 = keccak512Tool.execute;
export default keccak512Tool;
