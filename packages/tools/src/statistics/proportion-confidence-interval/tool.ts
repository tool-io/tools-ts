import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const zScores = {
  90: 1.6448536269514722,
  95: 1.959963984540054,
  99: 2.5758293035489004,
} as const;

export type ProportionConfidenceLevel = keyof typeof zScores;

export const calculateProportionConfidenceInterval = (
  successes: number,
  sampleSize: number,
  confidenceLevel: ProportionConfidenceLevel,
): readonly [number, number] | null => {
  if (
    !Number.isSafeInteger(successes) ||
    !Number.isSafeInteger(sampleSize) ||
    sampleSize < 1 ||
    successes < 0 ||
    successes > sampleSize
  )
    return null;
  const zScore = zScores[confidenceLevel];
  if (zScore === undefined) return null;
  const proportion = successes / sampleSize;
  const margin =
    zScore * Math.sqrt((proportion * (1 - proportion)) / sampleSize);
  return [Math.max(0, proportion - margin), Math.min(1, proportion + margin)];
};

export const proportionConfidenceIntervalExample = {
  input: { confidenceLevel: 95, sampleSize: 100, successes: 60 },
  output: {
    lower: 0.5039817664728938,
    upper: 0.6960182335271061,
  },
} satisfies ToolExample<
  {
    readonly confidenceLevel: number;
    readonly sampleSize: number;
    readonly successes: number;
  },
  { readonly lower: number; readonly upper: number }
>;

export const proportionConfidenceIntervalTool = createSimpleTool({
  id: "statistics/proportion-confidence-interval",
  title: "Proportion Confidence Interval Calculator",
  description:
    "Estimate a population proportion with a two-sided normal-approximation confidence interval.",
  inputs: [
    { id: "successes", kind: "integer", label: "Successes", minimum: 0 },
    { id: "sampleSize", kind: "integer", label: "Sample size", minimum: 1 },
    {
      enum: ["90", "95", "99"],
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
    const interval = calculateProportionConfidenceInterval(
      input.successes as number,
      input.sampleSize as number,
      input.confidenceLevel as ProportionConfidenceLevel,
    );
    if (!interval)
      simpleError("successes", "Enter a valid success count and sample size.");
    return { lower: interval[0], upper: interval[1] };
  },
});

export const runProportionConfidenceInterval =
  proportionConfidenceIntervalTool.execute;
export default proportionConfidenceIntervalTool;
