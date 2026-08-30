import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, besselJ0 } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{ readonly besselJ0Value: number }>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { besselJ0Value: besselJ0(input.x) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 1 } satisfies Input;
export const exampleOutput = {
  besselJ0Value: 0.7651976865579666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/bessel-j0-approx",
  title: "Bessel J0 Approximation",
  description:
    "Evaluate real Bessel J0 by bounded convergent power series on |x|≤20; outside-series regime refused rather than an unstated asymptotic formula.",
  inputs: inputFields,
  outputs: [{ id: "besselJ0Value", label: "Bessel j0 value", kind: "number" }],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
