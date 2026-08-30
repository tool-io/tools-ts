import { ripemd160 } from "@noble/hashes/legacy.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(ripemd160);
export const ripemd160Tool = createTextHashTool({
  aliases: ["ripemd160", "ripemd-160"],
  algorithm: ripemd160,
  description:
    "Calculate a RIPEMD-160 digest from UTF-8 text for compatibility with systems such as Bitcoin address pipelines.",
  digestLength: 40,
  id: "hash/ripemd-160",
  keywords: ["ripemd", "ripemd160", "ripemd-160"],
  title: "RIPEMD-160 Hash Generator",
});
export const runRipemd160 = ripemd160Tool.execute;
export default ripemd160Tool;
