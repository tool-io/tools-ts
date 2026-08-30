import {
  createTimeBasedUuidExample,
  createTimeBasedUuidTool,
} from "../../uuid/time-based.js";

export const example = createTimeBasedUuidExample(6);
export const uuidV6Tool = createTimeBasedUuidTool(6);
export const runUuidV6 = uuidV6Tool.execute;
export default uuidV6Tool;
