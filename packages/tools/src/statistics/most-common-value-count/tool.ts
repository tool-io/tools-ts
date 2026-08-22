import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MostCommonValueCountInput = {
  readonly values: readonly number[];
};

export type MostCommonValueCountOutput = {
  readonly count: number;
};

export const calculateMostCommonValueCount = (
  input: MostCommonValueCountInput,
): MostCommonValueCountOutput => {
  const frequencies = new Map<number, number>();
  let count = 0;
  for (const value of input.values) {
    const next = (frequencies.get(value) ?? 0) + 1;
    frequencies.set(value, next);
    if (next > count) count = next;
  }
  return { count };
};

export const mostCommonValueCountExample = {
  input: { values: [2, 7, 2, 4, 2, 7] },
  output: { count: 3 },
} satisfies ToolExample<MostCommonValueCountInput, MostCommonValueCountOutput>;

export const mostCommonValueCountTool = createSimpleTool({
  id: "statistics/most-common-value-count",
  title: "Most Common Value Count Tool",
  description:
    "Count how many times the most frequent value appears in a list of numbers.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "count", label: "Most common count", kind: "integer" }],
  calculate: (input) =>
    calculateMostCommonValueCount(input as MostCommonValueCountInput),
});
export const runMostCommonValueCount = mostCommonValueCountTool.execute;
export default mostCommonValueCountTool;
