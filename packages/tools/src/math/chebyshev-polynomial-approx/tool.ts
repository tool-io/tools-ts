import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orthogonal } from "../batch-shared.js";
export type Input = Readonly<{ readonly degree: number; readonly x: number }>;
export type Output = Readonly<{ readonly polynomialValue: number }>;
const inputFields = [
  { id: "degree", label: "Degree", kind: "number" },
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { polynomialValue: orthogonal("chebyshev", input.degree, input.x) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { degree: 3, x: 0.5 } satisfies Input;
export const exampleOutput = { polynomialValue: -1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/chebyshev-polynomial-approx",
  title: "Chebyshev Polynomial Approximation",
  description:
    "Evaluate chebyshev family polynomial by three-term recurrence for degree 0..128 and |x|≤100; first-kind T_n convention.",
  inputs: inputFields,
  outputs: [
    { id: "polynomialValue", label: "Polynomial value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ degree: value.degree as number, x: value.x as number }),
});
export const run = tool.execute;
export default tool;
