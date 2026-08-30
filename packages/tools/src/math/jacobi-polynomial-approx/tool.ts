import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, orthogonal } from "../batch-shared.js";
export type Input = Readonly<{
  readonly degree: number;
  readonly x: number;
  readonly alpha: number;
  readonly beta: number;
}>;
export type Output = Readonly<{ readonly polynomialValue: number }>;
const inputFields = [
  { id: "degree", label: "Degree", kind: "number" },
  { id: "x", label: "X", kind: "number" },
  { id: "alpha", label: "Alpha", kind: "number" },
  { id: "beta", label: "Beta", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.alpha <= -1 || input.beta <= -1)
    simpleError("parameters", "Orthogonal-family parameters must exceed −1.");
  return {
    polynomialValue: orthogonal(
      "jacobi",
      input.degree,
      input.x,
      input.alpha,
      input.beta,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  degree: 2,
  x: 0.5,
  alpha: 1,
  beta: 1,
} satisfies Input;
export const exampleOutput = { polynomialValue: 0.1875 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/jacobi-polynomial-approx",
  title: "Jacobi Polynomial Approximation",
  description:
    "Evaluate jacobi family polynomial by three-term recurrence for degree 0..128 and |x|≤100; family parameters/domain explicit, not arbitrary caller polynomial evaluation.",
  inputs: inputFields,
  outputs: [
    { id: "polynomialValue", label: "Polynomial value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      degree: value.degree as number,
      x: value.x as number,
      alpha: value.alpha as number,
      beta: value.beta as number,
    }),
});
export const run = tool.execute;
export default tool;
