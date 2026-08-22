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

export const trigramCountTool = createSimpleTool({
  id: "text/trigram-count",
  title: "Trigram Counter",
  description:
    "Count adjacent word triples (trigrams) in whitespace-delimited text.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "trigrams", label: "Trigram counts", kind: "object" }],
  calculate: (input) => {
    return { trigrams: buildNgramCounts(input.text as string, 3) };
  },
});
export const runTrigramCount = trigramCountTool.execute;
export default trigramCountTool;

export type TrigramCountInput = {
  readonly text: string;
};

export type TrigramCountOutput = {
  readonly trigrams: Record<string, unknown>;
};

export const trigramCountExample = {
  input: {
    text: "example",
  },
  output: {
    trigrams: {},
  },
} satisfies ToolExample<TrigramCountInput, TrigramCountOutput>;
