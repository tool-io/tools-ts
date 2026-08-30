import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly branchOneValues: readonly number[];
  readonly branchTwoValues: readonly number[];
  readonly minimumDivergence: number;
}>;
export type Output = Readonly<{
  readonly meanAbsoluteDivergence: number;
  readonly maxDivergence: number;
  readonly divergent: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.branchOneValues.length === 0 ||
    input.branchOneValues.length !== input.branchTwoValues.length
  )
    simpleError("branchOneValues", "Aligned branch profiles are required.");
  const differences = input.branchOneValues.map((v, i) =>
      Math.abs(v - input.branchTwoValues[i]),
    ),
    meanAbsoluteDivergence =
      differences.reduce((a, b) => a + b, 0) / differences.length;
  return {
    meanAbsoluteDivergence,
    maxDivergence: Math.max(...differences),
    divergent: meanAbsoluteDivergence >= input.minimumDivergence,
  };
};

export const exampleInput = {
  branchOneValues: [1, 2],
  branchTwoValues: [3, 4],
  minimumDivergence: 2,
} satisfies Input;
export const exampleOutput = {
  meanAbsoluteDivergence: 2,
  maxDivergence: 2,
  divergent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/branch-divergence",
  title: "Branch Divergence",
  description:
    "Measure trajectory branch divergence from aligned expression profiles.",
  inputs: [
    { id: "branchOneValues", kind: "numberList", label: "Branch one values" },
    { id: "branchTwoValues", kind: "numberList", label: "Branch two values" },
    { id: "minimumDivergence", kind: "number", label: "Minimum divergence" },
  ],
  outputs: [
    {
      id: "meanAbsoluteDivergence",
      kind: "number",
      label: "Mean absolute divergence",
    },
    { id: "maxDivergence", kind: "number", label: "Max divergence" },
    { id: "divergent", kind: "boolean", label: "Divergent" },
  ],
  calculate: (value) =>
    calculate({
      branchOneValues: value.branchOneValues as readonly number[],
      branchTwoValues: value.branchTwoValues as readonly number[],
      minimumDivergence: value.minimumDivergence as number,
    }),
});
export const run = tool.execute;
export default tool;
