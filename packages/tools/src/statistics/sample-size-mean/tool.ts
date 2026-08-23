import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SampleSizeMeanInput = {
  readonly populationStdDev: number;
  readonly marginOfError: number;
  readonly zScore?: number;
};

export type SampleSizeMeanOutput = {
  readonly requiredSampleSize: number;
  readonly exactSampleSize: number;
};

export const calculateSampleSizeMean = (
  input: SampleSizeMeanInput,
): SampleSizeMeanOutput => {
  if (!(input.populationStdDev > 0))
    return simpleError(
      "populationStdDev",
      "Population standard deviation must be positive.",
      "invalid_sigma",
    );
  if (!(input.marginOfError > 0))
    return simpleError(
      "marginOfError",
      "Margin of error must be positive.",
      "invalid_margin",
    );
  const zScore = input.zScore ?? 1.96;
  if (!(zScore > 0))
    return simpleError("zScore", "z score must be positive.", "invalid_z");
  const exact = ((zScore * input.populationStdDev) / input.marginOfError) ** 2;
  return { requiredSampleSize: Math.ceil(exact), exactSampleSize: exact };
};

export const sampleSizeMeanExample = {
  input: {
    populationStdDev: 15,
    marginOfError: 5,
  },
  output: {
    requiredSampleSize: 35,
    exactSampleSize: 34.5744,
  },
} satisfies ToolExample<SampleSizeMeanInput, SampleSizeMeanOutput>;

export const sampleSizeMeanTool = createSimpleTool({
  id: "statistics/sample-size-mean",
  title: "Sample Size for Mean Calculator",
  description:
    "Two-sided sample size for estimating a population mean: n = (z*sigma/E)^2 with z defaulting to 1.96.",
  inputs: [
    {
      description: "Population standard deviation sigma.",
      id: "populationStdDev",
      kind: "number",
      label: "Population std dev",
    },
    {
      description: "Desired margin of error E on the mean.",
      id: "marginOfError",
      kind: "number",
      label: "Margin of error",
    },
    {
      description:
        "Two-sided critical z value; defaults to 1.96 (95% confidence).",
      default: 1.96,
      id: "zScore",
      kind: "number",
      label: "z score",
    },
  ],
  outputs: [
    {
      description: "Ceiling of the exact requirement.",
      id: "requiredSampleSize",
      kind: "integer",
      label: "Required sample size",
    },
    {
      description: "Unrounded n = (z*sigma/E)^2.",
      id: "exactSampleSize",
      kind: "number",
      label: "Exact sample size",
    },
  ],
  calculate: (input) =>
    calculateSampleSizeMean({
      marginOfError: input.marginOfError as number,
      populationStdDev: input.populationStdDev as number,
      zScore: input.zScore as number,
    }),
});

export const runSampleSizeMean = sampleSizeMeanTool.execute;
export default sampleSizeMeanTool;
