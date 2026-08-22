import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const buildNgramCounts = (
  text: string,
  size: number,
): Record<string, number> => {
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/u);
  const counts: Record<string, number> = {};
  for (let index = 0; index + size <= words.length; index += 1) {
    const key = words.slice(index, index + size).join(" ");
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

export const bigramCountTool = createSimpleTool({
  id: "text/bigram-count",
  title: "Bigram Counter",
  description:
    "Count adjacent word pairs (bigrams) in whitespace-delimited text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "bigrams", label: "Bigram counts", kind: "object" }],
  calculate: (input) => {
    return { bigrams: buildNgramCounts(input.text as string, 2) };
  },
});
export const runBigramCount = bigramCountTool.execute;
export default bigramCountTool;

export type BigramCountInput = {
  readonly text: string;
};

export type BigramCountOutput = {
  readonly bigrams: Record<string, unknown>;
};

export const bigramCountExample = {
  input: {
    text: "example",
  },
  output: {
    bigrams: {},
  },
} satisfies ToolExample<BigramCountInput, BigramCountOutput>;
