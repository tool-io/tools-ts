import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleCounts: readonly number[];
  readonly referenceCounts: readonly number[];
  readonly sampleLibrarySize: number;
  readonly referenceLibrarySize: number;
  readonly trimFraction: number;
}>;
export type Output = Readonly<{
  readonly trimmedFeatureCount: number;
  readonly meanLogRatio: number;
  readonly scalingFactor: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.sampleCounts.length;
  if (
    n === 0 ||
    input.referenceCounts.length !== n ||
    input.sampleLibrarySize <= 0 ||
    input.referenceLibrarySize <= 0 ||
    input.trimFraction < 0 ||
    input.trimFraction >= 0.5 ||
    input.sampleCounts.some((v, i) => v <= 0 || input.referenceCounts[i] <= 0)
  )
    simpleError(
      "sampleCounts",
      "Positive aligned counts, library totals and valid trimming fraction required.",
    );
  const m = input.sampleCounts
      .map((v, i) =>
        Math.log2(
          v /
            input.sampleLibrarySize /
            (input.referenceCounts[i] / input.referenceLibrarySize),
        ),
      )
      .sort((a, b) => a - b),
    k = Math.floor(n * input.trimFraction),
    kept = m.slice(k, n - k),
    meanLogRatio = kept.reduce((a, b) => a + b, 0) / kept.length;
  return {
    trimmedFeatureCount: kept.length,
    meanLogRatio,
    scalingFactor: 2 ** meanLogRatio,
  };
};

export const exampleInput = {
  sampleCounts: [100, 200, 300],
  referenceCounts: [100, 100, 100],
  sampleLibrarySize: 600,
  referenceLibrarySize: 300,
  trimFraction: 0.34,
} satisfies Input;
export const exampleOutput = {
  trimmedFeatureCount: 1,
  meanLogRatio: 0,
  scalingFactor: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/tmm-scaling-factor",
  title: "TMM Scaling Factor",
  description:
    "Estimate an unweighted TMM-style scaling factor after trimming extreme log ratios.",
  inputs: [
    { id: "sampleCounts", kind: "numberList", label: "Sample counts" },
    { id: "referenceCounts", kind: "numberList", label: "Reference counts" },
    { id: "sampleLibrarySize", kind: "number", label: "Sample library size" },
    {
      id: "referenceLibrarySize",
      kind: "number",
      label: "Reference library size",
    },
    { id: "trimFraction", kind: "number", label: "Trim fraction" },
  ],
  outputs: [
    {
      id: "trimmedFeatureCount",
      kind: "number",
      label: "Trimmed feature count",
    },
    { id: "meanLogRatio", kind: "number", label: "Mean log ratio" },
    { id: "scalingFactor", kind: "number", label: "Scaling factor" },
  ],
  calculate: (value) =>
    calculate({
      sampleCounts: value.sampleCounts as readonly number[],
      referenceCounts: value.referenceCounts as readonly number[],
      sampleLibrarySize: value.sampleLibrarySize as number,
      referenceLibrarySize: value.referenceLibrarySize as number,
      trimFraction: value.trimFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
