import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AverageWordLengthInput = {
  readonly text: string;
};

export type AverageWordLengthOutput = {
  readonly averageLength: number;
};

export const averageWordLengthExample = {
  input: { text: "the quick brown fox" },
  output: { averageLength: 4 },
} satisfies ToolExample<AverageWordLengthInput, AverageWordLengthOutput>;

const wordsOf = (text: string): string[] =>
  text.trim() === "" ? [] : text.trim().split(/\s+/u);

export const averageWordLengthTool = createSimpleTool({
  id: "text/average-word-length",
  title: "Average Word Length Calculator",
  description:
    "Calculate the mean character length of whitespace-delimited words in text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "averageLength",
      label: "Average length",
      kind: "number",
      unit: "characters",
    },
  ],
  calculate: (input) => {
    const words = wordsOf(input.text as string);
    if (words.length === 0)
      simpleError("text", "Provide at least one word.", "empty_text");
    const total = words.reduce((sum, word) => sum + word.length, 0);
    return { averageLength: total / words.length };
  },
});
export const runAverageWordLength = averageWordLengthTool.execute;
export default averageWordLengthTool;
