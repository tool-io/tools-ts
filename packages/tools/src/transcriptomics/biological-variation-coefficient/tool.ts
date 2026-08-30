import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dispersions: readonly number[];
  readonly maximumBcv: number;
}>;
export type Output = Readonly<{
  readonly bcvs: readonly number[];
  readonly passingIndexes: readonly number[];
  readonly meanBcv: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.dispersions.length === 0 ||
    input.dispersions.some((v) => v < 0) ||
    input.maximumBcv < 0
  )
    simpleError("dispersions", "Nonnegative gene dispersions required.");
  const bcvs = input.dispersions.map((v) => Math.sqrt(v));
  return {
    bcvs,
    passingIndexes: bcvs.flatMap((v, i) => (v <= input.maximumBcv ? [i] : [])),
    meanBcv: bcvs.reduce((a, b) => a + b, 0) / bcvs.length,
  };
};

export const exampleInput = {
  dispersions: [0.01, 0.04, 0.09],
  maximumBcv: 0.25,
} satisfies Input;
export const exampleOutput = {
  bcvs: [0.1, 0.2, 0.3],
  passingIndexes: [0, 1],
  meanBcv: 0.20000000000000004,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/biological-variation-coefficient",
  title: "Biological Variation Coefficient",
  description:
    "Convert negative-binomial dispersions to biological coefficients of variation.",
  inputs: [
    { id: "dispersions", kind: "numberList", label: "Dispersions" },
    { id: "maximumBcv", kind: "number", label: "Maximum bcv" },
  ],
  outputs: [
    { id: "bcvs", kind: "numberList", label: "Bcvs" },
    { id: "passingIndexes", kind: "numberList", label: "Passing indexes" },
    { id: "meanBcv", kind: "number", label: "Mean bcv" },
  ],
  calculate: (value) =>
    calculate({
      dispersions: value.dispersions as readonly number[],
      maximumBcv: value.maximumBcv as number,
    }),
});
export const run = tool.execute;
export default tool;
