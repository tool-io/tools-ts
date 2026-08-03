import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PopulationSummary = {
  readonly count: number;
  readonly mean: number;
  readonly standardDeviation: number;
  readonly variance: number;
};

export const calculatePopulationSummary = (
  values: readonly number[],
): PopulationSummary | null => {
  if (values.length === 0 || !values.every(Number.isFinite)) return null;

  let count = 0;
  let mean = 0;
  let sumSquaredDifferences = 0;

  for (const value of values) {
    count += 1;
    const difference = value - mean;
    mean += difference / count;
    sumSquaredDifferences += difference * (value - mean);
    if (!Number.isFinite(mean) || !Number.isFinite(sumSquaredDifferences))
      return null;
  }

  const variance = Math.max(0, sumSquaredDifferences / count);
  const standardDeviation = Math.sqrt(variance);
  return Number.isFinite(variance) && Number.isFinite(standardDeviation)
    ? { count, mean, standardDeviation, variance }
    : null;
};

export const populationSummaryExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: {
    count: 5,
    mean: 3,
    standardDeviation: Math.sqrt(2),
    variance: 2,
  },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  PopulationSummary
>;

export const populationSummaryTool = createSimpleTool({
  id: "statistics/population-summary",
  title: "Population Summary Calculator",
  description:
    "Calculate the count, mean, population variance, and population standard deviation of a finite dataset.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    { id: "count", label: "Count", kind: "integer" },
    { format: "mean", id: "mean", label: "Mean", kind: "number" },
    {
      format: "variance",
      id: "variance",
      label: "Population variance",
      kind: "number",
    },
    {
      format: "standard-deviation",
      id: "standardDeviation",
      label: "Population standard deviation",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const summary = calculatePopulationSummary(input.values as number[]);
    if (summary === null)
      return simpleError(
        "values",
        "Enter at least one finite number whose summary stays finite.",
      );
    return summary;
  },
});

export const runPopulationSummary = populationSummaryTool.execute;
export default populationSummaryTool;
