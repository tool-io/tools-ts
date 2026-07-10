import { createSimpleTool } from "../../core/simple.js";
export const removeBlankLinesTool = createSimpleTool({
  id: "text/remove-blank-lines",
  title: "Text Remove Blank Lines Tool",
  description: "Remove lines that contain only whitespace.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "text", label: "Text without blank lines", kind: "string" }],
  calculate: (input) => {
    return {
      text: (input.text as string)
        .split(/\r\n|\r|\n/u)
        .filter((line) => line.trim() !== "")
        .join("\n"),
    };
  },
});
export const runRemoveBlankLines = removeBlankLinesTool.execute;
export default removeBlankLinesTool;
