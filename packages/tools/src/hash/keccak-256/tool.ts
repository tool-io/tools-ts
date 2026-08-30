import { keccak_256 } from "@noble/hashes/sha3.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(keccak_256);
export const keccak256Tool = createTextHashTool({
  aliases: ["keccak256", "keccak-256"],
  algorithm: keccak_256,
  description:
    "Calculate a Keccak-256 digest from UTF-8 text, as used by Ethereum; Keccak-256 is not byte-for-byte equivalent to SHA3-256.",
  digestLength: 64,
  id: "hash/keccak-256",
  keywords: ["ethereum", "keccak", "keccak-256"],
  title: "Keccak-256 Hash Generator",
});
export const runKeccak256 = keccak256Tool.execute;
export default keccak256Tool;
