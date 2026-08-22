import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UniqueWordRatioInput = {
  readonly text: string;
};

export type UniqueWordRatioOutput = {
  readonly ratio: number;
};

export const uniqueWordRatioExample = {
  input: { text: "Hello hello world world world" },
  output: { ratio: 0.4 },
} satisfies ToolExample<UniqueWordRatioInput, UniqueWordRatioOutput>;

const wordsOf = (text: string): string[] =>
  text.trim() === "" ? [] : text.trim().split(/\s+/u);

export const uniqueWordRatioTool = createSimpleTool({
  id: "text/unique-word-ratio",
  title: "Unique Word Ratio Calculator",
  description:
    "Calculate the ratio of unique words to total words, comparing case-insensitively.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "ratio", label: "Unique word ratio", kind: "number" }],
  calculate: (input) => {
    const words = wordsOf(input.text as string);
    if (words.length === 0)
      simpleError("text", "Provide at least one word.", "empty_text");
    const unique = new Set(words.map((word) => word.toLowerCase()));
    return { ratio: unique.size / words.length };
  },
});
export const runUniqueWordRatio = uniqueWordRatioTool.execute;
export default uniqueWordRatioTool;
