import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly values: readonly number[];
  readonly standardDeviation: number;
}>;
export type Output = Readonly<{
  readonly paretoScaled: readonly number[];
  readonly mean: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.values.length === 0 || input.standardDeviation <= 0)
    simpleError(
      "standardDeviation",
      "Positive standard deviation and data required.",
    );
  const mean = input.values.reduce((a, b) => a + b, 0) / input.values.length,
    scale = Math.sqrt(input.standardDeviation);
  return { paretoScaled: input.values.map((v) => (v - mean) / scale), mean };
};
export const exampleInput = {
  values: [1, 2, 3],
  standardDeviation: 4,
} satisfies Input;
export const exampleOutput = {
  paretoScaled: [-0.5, 0, 0.5],
  mean: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/pareto-scaling",
  title: "Pareto Scaling",
  description:
    "Apply mean-centered Pareto scaling by the square root of standard deviation.",
  inputs: [
    { id: "values", kind: "numberList", label: "Values" },
    { id: "standardDeviation", kind: "number", label: "Standard deviation" },
  ],
  outputs: [
    { id: "paretoScaled", kind: "numberList", label: "Pareto scaled" },
    { id: "mean", kind: "number", label: "Mean" },
  ],
  calculate: (value) =>
    calculate({
      values: value.values as readonly number[],
      standardDeviation: value.standardDeviation as number,
    }),
});
export const run = tool.execute;
export default tool;
