import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const wordLengthHistogramTool = createSimpleTool({
  id: "text/word-length-histogram",
  title: "Word Length Histogram",
  description:
    "Build a histogram mapping each word length to the number of whitespace-delimited words of that length.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "histogram", label: "Length histogram", kind: "object" }],
  calculate: (input) => {
    const trimmed = (input.text as string).trim();
    const histogram: Record<string, number> = {};
    if (trimmed === "") return { histogram };
    for (const word of trimmed.split(/\s+/u)) {
      const length = String(word.length);
      histogram[length] = (histogram[length] ?? 0) + 1;
    }
    return { histogram };
  },
});
export const runWordLengthHistogram = wordLengthHistogramTool.execute;
export default wordLengthHistogramTool;

export type WordLengthHistogramInput = {
  readonly text: string;
};

export type WordLengthHistogramOutput = {
  readonly histogram: Record<string, unknown>;
};

export const wordLengthHistogramExample = {
  input: {
    text: "example",
  },
  output: {
    histogram: {
      "7": 1,
    },
  },
} satisfies ToolExample<WordLengthHistogramInput, WordLengthHistogramOutput>;
