import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type RiverDischargeSummary = {
  readonly change: number;
  readonly current: number;
  readonly maximum: number;
  readonly mean: number;
  readonly minimum: number;
  readonly observations: number;
  readonly trendPerObservation: number;
};
export const analyzeRiverDischarge = (
  values: readonly number[],
): RiverDischargeSummary | null => {
  if (!values.length || values.some((value) => value < 0)) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length,
    xMean = (values.length - 1) / 2,
    denominator = values.reduce(
      (sum, _, index) => sum + (index - xMean) ** 2,
      0,
    ),
    trend = denominator
      ? values.reduce(
          (sum, value, index) => sum + (index - xMean) * (value - mean),
          0,
        ) / denominator
      : 0;
  return {
    change: values[values.length - 1]! - values[0]!,
    current: values[values.length - 1]!,
    maximum: Math.max(...values),
    mean: Number(mean.toPrecision(10)),
    minimum: Math.min(...values),
    observations: values.length,
    trendPerObservation: Number(trend.toPrecision(10)),
  };
};
export const riverDischargeExample = {
  input: { values: [120, 135, 128, 150] },
  output: {
    summary: {
      change: 30,
      current: 150,
      maximum: 150,
      mean: 133.25,
      minimum: 120,
      observations: 4,
      trendPerObservation: 8.3,
    },
  },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly summary: RiverDischargeSummary }
>;
export const riverDischargeTool = createSimpleTool({
  id: "hydrology/river-discharge",
  title: "River Discharge Analyzer",
  description:
    "Summarize a chronological river-discharge series and its linear trend.",
  inputs: [
    {
      format: "timeseries/river-discharge",
      id: "values",
      kind: "numberList",
      label: "Discharge series",
    },
  ],
  outputs: [
    {
      format: "hydrology/river-discharge-summary",
      id: "summary",
      kind: "object",
      label: "Discharge summary",
    },
  ],
  calculate: (input) => {
    const summary = analyzeRiverDischarge(input.values as number[]);
    if (!summary)
      return simpleError(
        "values",
        "Enter at least one nonnegative discharge observation.",
      );
    return { summary };
  },
});
export const runRiverDischarge = riverDischargeTool.execute;
export default riverDischargeTool;
