import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly values: readonly number[];
}>;
export type Output = Readonly<{
  readonly zScores: readonly number[];
  readonly mean: number;
}>;
export const calculate = (input: Input): Output => {
  const x = input.values;
  if (x.length < 2)
    simpleError("values", "At least two measurements required.");
  const mean = x.reduce((a, b) => a + b, 0) / x.length,
    sd = Math.sqrt(x.reduce((s, v) => s + (v - mean) ** 2, 0) / x.length);
  if (sd <= 0) simpleError("values", "Measurements must vary.");
  return { zScores: x.map((v) => (v - mean) / sd), mean };
};
export const exampleInput = { values: [1, 2, 3] } satisfies Input;
export const exampleOutput = {
  zScores: [-1.224744871391589, 0, 1.224744871391589],
  mean: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/unit-variance-scaling",
  title: "Unit Variance Scaling",
  description: "Autoscale a feature to zero mean and unit population variance.",
  inputs: [{ id: "values", kind: "numberList", label: "Values" }],
  outputs: [
    { id: "zScores", kind: "numberList", label: "Z scores" },
    { id: "mean", kind: "number", label: "Mean" },
  ],
  calculate: (value) =>
    calculate({
      values: value.values as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
