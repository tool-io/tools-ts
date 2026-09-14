import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, digamma } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{ readonly digammaValue: number }>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.x < 0.0001 || input.x > 1000000)
    simpleError("x", "Positive argument in [0.0001,10^6] required.");
  return { digammaValue: digamma(input.x) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 1 } satisfies Input;
export const exampleOutput = {
  digammaValue: -0.5772156649015527,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/digamma-approx",
  title: "Digamma Approximation",
  description:
    "Evaluate real positive digamma ψ(x) using upward recurrence and Bernoulli-corrected large-argument expansion, not finite-difference differentiation or negative-pole continuation.",
  inputs: inputFields,
  outputs: [{ id: "digammaValue", label: "Digamma value", kind: "number" }],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
