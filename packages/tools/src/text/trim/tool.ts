import { createSimpleTool } from "../../core/simple.js";
export const trimTool = createSimpleTool({
  id: "text/trim",
  title: "Text Trim Tool",
  description: "Remove leading and trailing Unicode whitespace from text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "text", label: "Trimmed text", kind: "string" }],
  calculate: (input) => {
    return { text: (input.text as string).trim() };
  },
});
export const runTrim = trimTool.execute;
export default trimTool;
