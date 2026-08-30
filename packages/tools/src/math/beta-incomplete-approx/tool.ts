import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, logGamma, betaRatio } from "../batch-shared.js";
export type Input = Readonly<{
  readonly a: number;
  readonly b: number;
  readonly x: number;
}>;
export type Output = Readonly<{
  readonly regularizedLowerBetaFraction: number;
  readonly lowerIncompleteBetaValue: number;
}>;
const inputFields = [
  { id: "a", label: "A", kind: "number" },
  { id: "b", label: "B", kind: "number" },
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const r = betaRatio(input.a, input.b, input.x),
    l = logGamma(input.a) + logGamma(input.b) - logGamma(input.a + input.b);
  return {
    regularizedLowerBetaFraction: r,
    lowerIncompleteBetaValue: Math.exp(l) * r,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { a: 2, b: 3, x: 0.5 } satisfies Input;
export const exampleOutput = {
  regularizedLowerBetaFraction: 0.6875,
  lowerIncompleteBetaValue: 0.057291666666666664,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/beta-incomplete-approx",
  title: "Incomplete Beta Approximation",
  description:
    "Evaluate lower incomplete B_x(a,b) and regularized I_x using symmetry-aware continued fractions, separating normalization; shapes (0,1000], x∈[0,1], bounded iteration with failure refusal.",
  inputs: inputFields,
  outputs: [
    {
      id: "regularizedLowerBetaFraction",
      label: "Regularized lower beta fraction",
      kind: "number",
    },
    {
      id: "lowerIncompleteBetaValue",
      label: "Lower incomplete beta value",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      a: value.a as number,
      b: value.b as number,
      x: value.x as number,
    }),
});
export const run = tool.execute;
export default tool;
