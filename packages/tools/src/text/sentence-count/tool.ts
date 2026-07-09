import { createSimpleTool } from "../../core/simple.js";
export const sentenceCountTool = createSimpleTool({
  id: "text/sentence-count",
  title: "Sentence Count Tool",
  description:
    "Estimate sentence count from terminal punctuation in plain text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    { id: "sentences", label: "Sentences", kind: "integer", format: "count" },
  ],
  calculate: (input) => {
    const text = (input.text as string).trim();
    if (text === "") return { sentences: 0 };
    const matches = text.match(/[^.!?]+(?:[.!?]+|$)/gu);
    return {
      sentences:
        matches?.filter((value) => value.trim().length > 0).length ?? 0,
    };
  },
});
export const runSentenceCount = sentenceCountTool.execute;
export default sentenceCountTool;
