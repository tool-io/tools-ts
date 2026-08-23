import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LevenshteinInput = {
  readonly a: string;
  readonly b: string;
};

export type LevenshteinOutput = {
  readonly distance: number;
};

export const calculateLevenshtein = (
  input: LevenshteinInput,
): LevenshteinOutput => {
  const left = Array.from(input.a);
  const right = Array.from(input.b);
  let previous = Array.from(
    { length: right.length + 1 },
    (_, column) => column,
  );
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= right.length; j += 1)
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  return { distance: previous[right.length] };
};

export const levenshteinExample = {
  input: {
    a: "kitten",
    b: "sitting",
  },
  output: {
    distance: 3,
  },
} satisfies ToolExample<LevenshteinInput, LevenshteinOutput>;

export const levenshteinTool = createSimpleTool({
  id: "distance/levenshtein",
  title: "Levenshtein Distance",
  description:
    "Minimum number of single-character insertions, deletions or substitutions needed to turn one string into another.",
  inputs: [
    {
      description: "Source string, compared by Unicode code points.",
      id: "a",
      kind: "string",
      label: "First string",
    },
    {
      description: "Target string, compared by Unicode code points.",
      id: "b",
      kind: "string",
      label: "Second string",
    },
  ],
  outputs: [
    {
      description: "Edit distance between a and b.",
      id: "distance",
      kind: "integer",
      label: "distance",
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateLevenshtein({
      a: input.a as string,
      b: input.b as string,
    }),
});

export const runLevenshtein = levenshteinTool.execute;
export default levenshteinTool;
