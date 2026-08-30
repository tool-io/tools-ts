import { sha1 } from "@noble/hashes/legacy.js";
import { createTextHashExample, createTextHashTool } from "../shared.js";

export const example = createTextHashExample(sha1);
export const sha1Tool = createTextHashTool({
  aliases: ["sha1 generator", "text to sha1", "text to sha-1"],
  algorithm: sha1,
  description:
    "Calculate the legacy SHA-1 digest of UTF-8 text for compatibility checks; SHA-1 is collision-broken and should not protect new security-sensitive data.",
  digestLength: 40,
  id: "hash/sha-1",
  keywords: ["sha1", "sha-1", "legacy"],
  title: "SHA-1 Hash Generator",
});
export const runSha1 = sha1Tool.execute;
export default sha1Tool;
