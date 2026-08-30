import { md5 } from "@noble/hashes/legacy.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(md5);
export const md5Tool = createTextHashTool({
  aliases: ["md5 generator", "text to md5"],
  algorithm: md5,
  description:
    "Calculate the legacy MD5 digest of UTF-8 text for compatibility checks; MD5 is not secure for passwords, signatures, or collision-resistant integrity.",
  digestLength: 32,
  id: "hash/md5",
  keywords: ["md5", "legacy"],
  title: "MD5 Hash Generator",
});
export const runMd5 = md5Tool.execute;
export default md5Tool;
