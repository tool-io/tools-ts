import { sha1 } from "@noble/hashes/legacy.js";
import {
  createNameBasedUuidExample,
  createNameBasedUuidTool,
} from "../../uuid/name-based.js";

export const example = createNameBasedUuidExample(sha1, 5);
export const uuidV5Tool = createNameBasedUuidTool({
  algorithm: sha1,
  description:
    "Generate deterministic RFC 9562 version 5 UUIDs by hashing a namespace UUID and UTF-8 name with SHA-1.",
  id: "generate/uuid-v5",
  title: "UUID v5 Generator",
  version: 5,
});
export const runUuidV5 = uuidV5Tool.execute;
export default uuidV5Tool;
