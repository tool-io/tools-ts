import { createSimpleTool } from "../../core/simple.js";
export const splitTool = createSimpleTool({
  id: "text/split",
  title: "Split Text Tool",
  description: "Split text by a literal delimiter.",
  inputs: [
    { id: "text", label: "Text", kind: "string" },
    { id: "delimiter", label: "Delimiter", kind: "string" },
  ],
  outputs: [{ id: "parts", label: "Parts", kind: "stringList" }],
  calculate: (input) => {
    const delimiter = input.delimiter as string;
    return {
      parts:
        delimiter === ""
          ? [...(input.text as string)]
          : (input.text as string).split(delimiter),
    };
  },
});
export const runSplit = splitTool.execute;
export default splitTool;
