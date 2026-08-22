import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SentenceLengthAverageInput = {
  readonly text: string;
};

export type SentenceLengthAverageOutput = {
  readonly averageWords: number;
};

export const sentenceLengthAverageExample = {
  input: { text: "The sun rises. Then it sets!" },
  output: { averageWords: 3 },
} satisfies ToolExample<
  SentenceLengthAverageInput,
  SentenceLengthAverageOutput
>;

export const sentenceLengthAverageTool = createSimpleTool({
  id: "text/sentence-length-average",
  title: "Average Sentence Length Calculator",
  description:
    "Calculate the average number of words per sentence in plain text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "averageWords",
      label: "Average words per sentence",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const sentences = (input.text as string)
      .split(/[.!?]+(?=\s|$)/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
    if (sentences.length === 0)
      simpleError("text", "Text must contain at least one sentence.");
    const words = sentences.reduce(
      (total, sentence) => total + sentence.split(/\s+/).length,
      0,
    );
    return { averageWords: words / sentences.length };
  },
});
export const runSentenceLengthAverage = sentenceLengthAverageTool.execute;
export default sentenceLengthAverageTool;
