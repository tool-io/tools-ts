import { createSimpleTool } from "../../core/simple.js";
export const uniqueLinesTool = createSimpleTool({
  id: "text/unique-lines",
  title: "Text Unique Lines Tool",
  description:
    "Remove duplicate text lines while preserving first occurrence order.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "text", label: "Unique lines", kind: "string" }],
  calculate: (input) => {
    return {
      text: [...new Set((input.text as string).split(/\r\n|\r|\n/u))].join(
        "\n",
      ),
    };
  },
});
export const runUniqueLines = uniqueLinesTool.execute;
export default uniqueLinesTool;
