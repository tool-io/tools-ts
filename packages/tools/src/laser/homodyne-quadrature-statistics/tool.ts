import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly quadratureSamples: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanQuadrature: number;
  readonly variance: number;
  readonly shotNoiseUnits: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.quadratureSamples.length === 0)
    simpleError(
      "quadratureSamples",
      "At least one quadrature sample is required.",
      "empty_samples",
    );
  const meanQuadrature =
    input.quadratureSamples.reduce((a, b) => a + b, 0) /
    input.quadratureSamples.length;
  const variance =
    input.quadratureSamples.reduce(
      (sum, value) => sum + (value - meanQuadrature) ** 2,
      0,
    ) / input.quadratureSamples.length;
  return { meanQuadrature, variance, shotNoiseUnits: variance };
};

export const exampleInput = {
  quadratureSamples: [-1, 1, -1, 1],
} satisfies Input;
export const exampleOutput = {
  meanQuadrature: 0,
  variance: 1,
  shotNoiseUnits: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      quadratureSamples: input.quadratureSamples as readonly number[],
    }),
  description:
    "Calculate mean and population variance for shot-noise-normalized homodyne quadratures.",
  id: "laser/homodyne-quadrature-statistics",
  inputs: [
    {
      id: "quadratureSamples",
      label: "Homodyne quadrature samples",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "meanQuadrature", label: "Mean quadrature", kind: "number" },
    {
      id: "variance",
      label: "Population variance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "shotNoiseUnits",
      label: "Variance in shot-noise units",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Homodyne Quadrature Statistics",
});

export const run = tool.execute;
export default tool;
