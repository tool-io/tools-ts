import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SampleSizeProportionInput = {
  readonly proportion: number;
  readonly marginOfError: number;
  readonly zScore?: number;
};

export type SampleSizeProportionOutput = {
  readonly requiredSampleSize: number;
  readonly exactSampleSize: number;
};

export const calculateSampleSizeProportion = (
  input: SampleSizeProportionInput,
): SampleSizeProportionOutput => {
  if (!(input.proportion > 0 && input.proportion < 1))
    return simpleError(
      "proportion",
      "Proportion must be strictly between 0 and 1.",
      "invalid_proportion",
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
  const exact =
    input.proportion *
    (1 - input.proportion) *
    (zScore / input.marginOfError) ** 2;
  return { requiredSampleSize: Math.ceil(exact), exactSampleSize: exact };
};

export const sampleSizeProportionExample = {
  input: {
    proportion: 0.5,
    marginOfError: 0.05,
  },
  output: {
    requiredSampleSize: 385,
    exactSampleSize: 384.1599999999999,
  },
} satisfies ToolExample<SampleSizeProportionInput, SampleSizeProportionOutput>;

export const sampleSizeProportionTool = createSimpleTool({
  id: "statistics/sample-size-proportion",
  title: "Sample Size for Proportion Calculator",
  description:
    "Two-sided sample size for estimating a proportion: n = p*(1-p)*(z/E)^2 with z defaulting to 1.96.",
  inputs: [
    {
      description:
        "Expected proportion p, strictly between 0 and 1 (use 0.5 for maximum variance).",
      id: "proportion",
      kind: "number",
      label: "Proportion",
    },
    {
      description: "Desired margin of error E on the proportion.",
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
      description: "Unrounded n = p*(1-p)*(z/E)^2.",
      id: "exactSampleSize",
      kind: "number",
      label: "Exact sample size",
    },
  ],
  calculate: (input) =>
    calculateSampleSizeProportion({
      marginOfError: input.marginOfError as number,
      proportion: input.proportion as number,
      zScore: input.zScore as number,
    }),
});

export const runSampleSizeProportion = sampleSizeProportionTool.execute;
export default sampleSizeProportionTool;
