import { createSimpleTool } from "../../core/simple.js";
export const lineCountTool = createSimpleTool({
  id: "text/line-count",
  title: "Line Count Tool",
  description: "Count logical lines separated by LF, CRLF, or CR.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "lines", label: "Lines", kind: "integer", format: "count" }],
  calculate: (input) => {
    const text = input.text as string;
    return { lines: text.length === 0 ? 0 : text.split(/\r\n|\r|\n/u).length };
  },
});
export const runLineCount = lineCountTool.execute;
export default lineCountTool;
