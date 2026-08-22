import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculatePercentileValue = (
  values: readonly number[],
  percentile: number,
): number | null => {
  if (
    values.length === 0 ||
    !values.every(Number.isFinite) ||
    !Number.isFinite(percentile) ||
    percentile < 0 ||
    percentile > 100
  )
    return null;

  const sorted = [...values].sort((left, right) => left - right);
  const rank = ((sorted.length - 1) * percentile) / 100;
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) return sorted[lower] as number;
  return (
    (sorted[lower] as number) +
    (rank - lower) * ((sorted[upper] as number) - (sorted[lower] as number))
  );
};

export type PercentileValueInput = {
  readonly values: readonly number[];
  readonly percentile: number;
};

export type PercentileValueOutput = {
  readonly value: number;
};

export const percentileValueExample = {
  input: { values: [1, 2, 3, 4, 5], percentile: 25 },
  output: { value: 2 },
} satisfies ToolExample<PercentileValueInput, PercentileValueOutput>;

export const percentileValueTool = createSimpleTool({
  id: "statistics/percentile-value",
  title: "Percentile Value Calculator",
  description:
    "Calculate the value at a percentile of a dataset using linear interpolation between closest ranks.",
  inputs: [
    { id: "values", label: "Values", kind: "numberList" },
    { id: "percentile", label: "Percentile", kind: "number" },
  ],
  outputs: [
    {
      format: "percentile-value",
      id: "value",
      kind: "number",
      label: "Percentile value",
    },
  ],
  calculate: (input) => {
    const percentile = input.percentile as number;
    if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100)
      simpleError(
        "percentile",
        "Enter a percentile between 0 and 100.",
        "invalid_percentile",
      );
    const value = calculatePercentileValue(
      input.values as number[],
      percentile,
    );
    if (value === null)
      simpleError(
        "values",
        "Enter at least one finite number.",
        "empty_values",
      );
    return { value };
  },
});

export const runPercentileValue = percentileValueTool.execute;
export default percentileValueTool;
