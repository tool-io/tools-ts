import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const zScores = {
  80: 1.2815515655446004,
  85: 1.4395314709384563,
  90: 1.6448536269514722,
  95: 1.959963984540054,
  98: 2.3263478740408408,
  99: 2.5758293035489004,
} as const;

export type ZConfidenceLevel = keyof typeof zScores;

export const calculateZConfidenceInterval = (
  sampleSize: number,
  mean: number,
  populationStandardDeviation: number,
  confidenceLevel: ZConfidenceLevel,
): readonly [number, number] | null => {
  if (
    !Number.isSafeInteger(sampleSize) ||
    sampleSize < 1 ||
    !Number.isFinite(mean) ||
    !Number.isFinite(populationStandardDeviation) ||
    populationStandardDeviation < 0
  )
    return null;
  const zScore = zScores[confidenceLevel];
  if (zScore === undefined) return null;
  const margin = (zScore * populationStandardDeviation) / Math.sqrt(sampleSize);
  const lower = mean - margin;
  const upper = mean + margin;
  return Number.isFinite(lower) && Number.isFinite(upper)
    ? [lower, upper]
    : null;
};

export const zConfidenceIntervalExample = {
  input: {
    confidenceLevel: 95,
    mean: 5.4,
    populationStandardDeviation: 1.2,
    sampleSize: 30,
  },
  output: {
    lower: 4.970593405507882,
    upper: 5.829406594492118,
  },
} satisfies ToolExample<
  {
    readonly confidenceLevel: number;
    readonly mean: number;
    readonly populationStandardDeviation: number;
    readonly sampleSize: number;
  },
  { readonly lower: number; readonly upper: number }
>;

export const zConfidenceIntervalTool = createSimpleTool({
  id: "statistics/z-confidence-interval",
  title: "Z Confidence Interval Calculator",
  description:
    "Calculate a two-sided confidence interval for a population mean when the population standard deviation is known.",
  inputs: [
    { id: "sampleSize", kind: "integer", label: "Sample size", minimum: 1 },
    { id: "mean", kind: "number", label: "Sample mean" },
    {
      id: "populationStandardDeviation",
      kind: "number",
      label: "Population standard deviation",
      minimum: 0,
    },
    {
      enum: ["80", "85", "90", "95", "98", "99"],
      id: "confidenceLevel",
      kind: "integer",
      label: "Confidence level",
    },
  ],
  outputs: [
    { id: "lower", kind: "number", label: "Lower bound" },
    { id: "upper", kind: "number", label: "Upper bound" },
  ],
  calculate: (input) => {
    const interval = calculateZConfidenceInterval(
      input.sampleSize as number,
      input.mean as number,
      input.populationStandardDeviation as number,
      input.confidenceLevel as ZConfidenceLevel,
    );
    if (!interval)
      return simpleError(
        "sampleSize",
        "Enter a valid sample and confidence level.",
      );
    return { lower: interval[0], upper: interval[1] };
  },
});

export const runZConfidenceInterval = zConfidenceIntervalTool.execute;
export default zConfidenceIntervalTool;
