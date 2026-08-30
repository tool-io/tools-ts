import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly splicedCounts: readonly number[];
  readonly unsplicedCounts: readonly number[];
  readonly pseudocount: number;
}>;
export type Output = Readonly<{
  readonly unsplicedToSpliced: readonly number[];
  readonly meanRatio: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.splicedCounts.length === 0 ||
    input.splicedCounts.length !== input.unsplicedCounts.length ||
    input.splicedCounts.some((v) => v < 0) ||
    input.unsplicedCounts.some((v) => v < 0) ||
    input.pseudocount < 0
  )
    simpleError(
      "splicedCounts",
      "Aligned nonnegative read counts are required.",
    );
  const unsplicedToSpliced = input.splicedCounts.map((v, i) => {
    if (v + input.pseudocount <= 0)
      simpleError("splicedCounts", "Spliced denominator must be positive.");
    return (
      (input.unsplicedCounts[i] + input.pseudocount) / (v + input.pseudocount)
    );
  });
  return {
    unsplicedToSpliced,
    meanRatio:
      unsplicedToSpliced.reduce((a, b) => a + b, 0) / unsplicedToSpliced.length,
  };
};

export const exampleInput = {
  splicedCounts: [10, 20],
  unsplicedCounts: [5, 5],
  pseudocount: 0,
} satisfies Input;
export const exampleOutput = {
  unsplicedToSpliced: [0.5, 0.25],
  meanRatio: 0.375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/rna-velocity-ratio",
  title: "RNA Velocity Ratio",
  description:
    "Summarize spliced-to-unspliced ratios without claiming inferred latent time.",
  inputs: [
    { id: "splicedCounts", kind: "numberList", label: "Spliced counts" },
    { id: "unsplicedCounts", kind: "numberList", label: "Unspliced counts" },
    { id: "pseudocount", kind: "number", label: "Pseudocount" },
  ],
  outputs: [
    {
      id: "unsplicedToSpliced",
      kind: "numberList",
      label: "Unspliced to spliced",
    },
    { id: "meanRatio", kind: "number", label: "Mean ratio" },
  ],
  calculate: (value) =>
    calculate({
      splicedCounts: value.splicedCounts as readonly number[],
      unsplicedCounts: value.unsplicedCounts as readonly number[],
      pseudocount: value.pseudocount as number,
    }),
});
export const run = tool.execute;
export default tool;
