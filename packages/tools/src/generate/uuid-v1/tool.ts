import {
  createTimeBasedUuidExample,
  createTimeBasedUuidTool,
} from "../../uuid/time-based.js";

export const example = createTimeBasedUuidExample(1);
export const uuidV1Tool = createTimeBasedUuidTool(1);
export const runUuidV1 = uuidV1Tool.execute;
export default uuidV1Tool;
