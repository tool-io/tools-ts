import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type S80S20RatioInput = {
  readonly incomes: readonly number[];
};

export type S80S20RatioOutput = {
  readonly s80S20Ratio: number;
};

export const s80S20RatioExample = {
  input: {
    incomes: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  },
  output: {
    s80S20Ratio: 6.333333333333333,
  },
} satisfies ToolExample<S80S20RatioInput, S80S20RatioOutput>;

export const calculateS80S20Ratio = (
  input: S80S20RatioInput,
): S80S20RatioOutput => {
  if (input.incomes.some((income) => !Number.isFinite(income) || income < 0))
    simpleError(
      "incomes",
      "Income values must be finite nonnegative numbers.",
      "invalid_value",
    );
  const values = [...input.incomes].sort((a, b) => a - b);
  const size = Math.floor(values.length / 5);
  if (size < 1)
    simpleError(
      "incomes",
      "At least five income values are needed to form the twentieth and eightieth percentile groups.",
      "invalid_value",
    );
  const bottomMean = values.slice(0, size).reduce((s, v) => s + v, 0) / size;
  const topMean = values.slice(-size).reduce((s, v) => s + v, 0) / size;
  if (bottomMean <= 0)
    simpleError(
      "incomes",
      "The bottom group mean must be positive to form the ratio.",
      "invalid_value",
    );
  return {
    s80S20Ratio: topMean / bottomMean,
  };
};

export const s80S20RatioTool = createSimpleTool({
  calculate: (input) =>
    calculateS80S20Ratio({ incomes: input.incomes as readonly number[] }),
  description:
    "Report the S80/S20 income ratio between the mean of the richest twenty percent and the poorest twenty percent.",
  id: "sociology/s80-s20-ratio",
  inputs: [
    {
      description: "Income values in the sample; at least five entries.",
      id: "incomes",
      kind: "numberList",
      label: "Incomes",
    },
  ],
  outputs: [
    {
      description: "Rich fifth mean income over poor fifth mean income.",
      id: "s80S20Ratio",
      kind: "number",
      label: "S80/S20 ratio",
    },
  ],
  title: "S80/S20 Ratio Calculator",
});
export const runS80S20Ratio = s80S20RatioTool.execute;
export default s80S20RatioTool;
