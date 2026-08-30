import { md5 } from "@noble/hashes/legacy.js";
import {
  createNameBasedUuidExample,
  createNameBasedUuidTool,
} from "../../uuid/name-based.js";

export const example = createNameBasedUuidExample(md5, 3);
export const uuidV3Tool = createNameBasedUuidTool({
  algorithm: md5,
  description:
    "Generate deterministic RFC 9562 version 3 UUIDs by hashing a namespace UUID and UTF-8 name with MD5.",
  id: "generate/uuid-v3",
  title: "UUID v3 Generator",
  version: 3,
});
export const runUuidV3 = uuidV3Tool.execute;
export default uuidV3Tool;
