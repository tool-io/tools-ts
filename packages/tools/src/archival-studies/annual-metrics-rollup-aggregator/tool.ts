import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnnualMetricsRollupAggregatorInput = {
  readonly periodValues: readonly number[];
};

export type AnnualMetricsRollupAggregatorOutput = {
  readonly periodCount: number;
  readonly total: number;
  readonly mean: number;
  readonly minimum: number;
  readonly maximum: number;
};

export const calculateAnnualMetricsRollupAggregator = (
  input: AnnualMetricsRollupAggregatorInput,
): AnnualMetricsRollupAggregatorOutput => {
  const values = input.periodValues;
  if (!Array.isArray(values) || values.length === 0)
    simpleError(
      "periodValues",
      "At least one reporting-period value is required.",
      "invalid_periods",
    );
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i] as number;
    if (!Number.isFinite(v))
      simpleError(
        "periodValues",
        "Period values must be finite numbers.",
        "invalid_period_value",
      );
  }
  let sum = 0;
  let compensation = 0;
  let minimum = values[0] as number;
  let maximum = values[0] as number;
  for (const v of values as readonly number[]) {
    const next = sum + v;
    compensation +=
      Math.abs(sum) >= Math.abs(v) ? sum - next + v : v - next + sum;
    sum = next;
    if (v < minimum) minimum = v;
    if (v > maximum) maximum = v;
  }
  const total = sum + compensation;
  if (!Number.isFinite(total))
    simpleError("periodValues", "Total overflowed.", "numeric_overflow");
  const periodCount = values.length;
  const mean = total / periodCount;
  if (!Number.isFinite(mean))
    simpleError(
      "periodValues",
      "Mean could not be calculated.",
      "numeric_overflow",
    );
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum))
    simpleError(
      "periodValues",
      "Minimum or maximum is not finite.",
      "numeric_overflow",
    );
  return {
    periodCount,
    total: total === 0 ? 0 : total,
    mean: mean === 0 ? 0 : mean,
    minimum: minimum === 0 ? 0 : minimum,
    maximum: maximum === 0 ? 0 : maximum,
  };
};

export const annualMetricsRollupAggregatorExample = {
  input: { periodValues: [120, 180, 150, 210] },
  output: { periodCount: 4, total: 660, mean: 165, minimum: 120, maximum: 210 },
} satisfies ToolExample<
  AnnualMetricsRollupAggregatorInput,
  AnnualMetricsRollupAggregatorOutput
>;

export const annualMetricsRollupAggregatorTool = createSimpleTool({
  id: "archival-studies/annual-metrics-rollup-aggregator",
  title: "Annual Report Output Metrics Rollup Aggregator",
  description:
    "Roll up periodic output metrics such as quarterly accessions or reference counts into a count, total, mean, minimum and maximum for annual reporting.",
  inputs: [
    {
      description: "Metric values for each reporting period.",
      id: "periodValues",
      kind: "numberList",
      label: "Period values",
    },
  ],
  outputs: [
    {
      description: "Number of periods aggregated.",
      id: "periodCount",
      kind: "integer",
      label: "Periods",
    },
    {
      description: "Sum of the period values.",
      id: "total",
      kind: "number",
      label: "Total",
    },
    {
      description: "Arithmetic mean of the period values.",
      id: "mean",
      kind: "number",
      label: "Mean",
    },
    {
      description: "Smallest period value.",
      id: "minimum",
      kind: "number",
      label: "Minimum",
    },
    {
      description: "Largest period value.",
      id: "maximum",
      kind: "number",
      label: "Maximum",
    },
  ],
  calculate: (input) =>
    calculateAnnualMetricsRollupAggregator({
      periodValues: input.periodValues as readonly number[],
    }),
});

export const runAnnualMetricsRollupAggregator =
  annualMetricsRollupAggregatorTool.execute;
export default annualMetricsRollupAggregatorTool;
