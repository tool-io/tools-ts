import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DamerauLevenshteinInput = {
  readonly first: string;
  readonly second: string;
};

export type DamerauLevenshteinOutput = {
  readonly distance: number;
};

const MAX_LENGTH = 2048;

export const damerauLevenshteinExample = {
  input: { first: "recieve", second: "receive" },
  output: { distance: 1 },
} satisfies ToolExample<DamerauLevenshteinInput, DamerauLevenshteinOutput>;

export const calculateDamerauLevenshtein = (
  input: DamerauLevenshteinInput,
): DamerauLevenshteinOutput => {
  const first = [...input.first];
  const second = [...input.second];
  if (first.length > MAX_LENGTH)
    return simpleError(
      "first",
      `first must not exceed ${MAX_LENGTH} characters.`,
      "text_too_long",
    );
  if (second.length > MAX_LENGTH)
    return simpleError(
      "second",
      `second must not exceed ${MAX_LENGTH} characters.`,
      "text_too_long",
    );
  let previousRow = Array.from({ length: second.length + 1 }, (_, j) => j);
  let rowBeforePrevious: readonly number[] | undefined;
  for (let i = 1; i <= first.length; i += 1) {
    const currentRow = [i];
    for (let j = 1; j <= second.length; j += 1) {
      const substitutionCost = first[i - 1] === second[j - 1] ? 0 : 1;
      let best = Math.min(
        previousRow[j]! + 1,
        currentRow[j - 1]! + 1,
        previousRow[j - 1]! + substitutionCost,
      );
      if (
        i > 1 &&
        j > 1 &&
        first[i - 1] === second[j - 2] &&
        first[i - 2] === second[j - 1]
      )
        best = Math.min(best, rowBeforePrevious![j - 2]! + 1);
      currentRow.push(best);
    }
    rowBeforePrevious = previousRow;
    previousRow = currentRow;
  }
  return { distance: previousRow[second.length]! };
};

export const damerauLevenshteinTool = createSimpleTool({
  calculate: (input) =>
    calculateDamerauLevenshtein({
      first: input.first as string,
      second: input.second as string,
    }),
  description:
    "Calculate the Damerau-Levenshtein edit distance between two strings, counting insertions, deletions, substitutions and adjacent transpositions (optimal string alignment variant).",
  id: "distance/damerau-levenshtein",
  inputs: [
    { id: "first", kind: "string", label: "First text" },
    { id: "second", kind: "string", label: "Second text" },
  ],
  outputs: [
    { format: "distance", id: "distance", kind: "integer", label: "Distance" },
  ],
  title: "Damerau–Levenshtein Distance Calculator",
});

export const runDamerauLevenshtein = damerauLevenshteinTool.execute;
export default damerauLevenshteinTool;
