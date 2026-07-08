import { createSimpleTool } from "../../core/simple.js";
export const reverseTool = createSimpleTool({
  id: "text/reverse",
  title: "Reverse Text Tool",
  description: "Reverse Unicode text by code point.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "text", label: "Reversed text", kind: "string" }],
  calculate: (input) => {
    return { text: [...(input.text as string)].reverse().join("") };
  },
});
export const runReverse = reverseTool.execute;
export default reverseTool;
