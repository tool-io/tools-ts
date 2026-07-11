import { createSimpleTool } from "../../core/simple.js";
export const wordCountTool = createSimpleTool({
  id: "text/word-count",
  title: "Word Count Tool",
  description: "Count whitespace-delimited words in plain text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "words", label: "Words", kind: "integer", format: "count" }],
  calculate: (input) => {
    const text = (input.text as string).trim();
    return { words: text === "" ? 0 : text.split(/\s+/u).length };
  },
});
export const runWordCount = wordCountTool.execute;
export default wordCountTool;
