import { createSimpleTool } from "../../core/simple.js";
export const zeroPadNumberTool = createSimpleTool({
  id: "format/zero-pad-number",
  title: "Zero-Pad Number Formatter",
  description:
    "Format a safe integer with leading zeros to a requested digit width.",
  inputs: [
    { id: "value", label: "Integer", kind: "integer" },
    { id: "width", label: "Width", kind: "integer", minimum: 1, maximum: 1000 },
  ],
  outputs: [{ id: "formatted", label: "Formatted integer", kind: "string" }],
  calculate: (input) => {
    const value = input.value as number,
      width = input.width as number,
      digits = Math.abs(value).toString().padStart(width, "0");
    return { formatted: value < 0 ? `-${digits}` : digits };
  },
});
export const runZeroPadNumber = zeroPadNumberTool.execute;
export default zeroPadNumberTool;
