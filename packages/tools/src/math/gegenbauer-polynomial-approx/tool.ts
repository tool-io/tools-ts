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
}>;
export type Output = Readonly<{ readonly polynomialValue: number }>;
const inputFields = [
  { id: "degree", label: "Degree", kind: "number" },
  { id: "x", label: "X", kind: "number" },
  { id: "alpha", label: "Alpha", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.alpha <= 0)
    simpleError("alpha", "Positive Gegenbauer parameter required.");
  return {
    polynomialValue: orthogonal(
      "gegenbauer",
      input.degree,
      input.x,
      input.alpha,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { degree: 2, x: 0.5, alpha: 1 } satisfies Input;
export const exampleOutput = { polynomialValue: 0 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/gegenbauer-polynomial-approx",
  title: "Gegenbauer Polynomial Approximation",
  description:
    "Evaluate gegenbauer family polynomial by three-term recurrence for degree 0..128 and |x|≤100; family parameters/domain explicit, not arbitrary caller polynomial evaluation.",
  inputs: inputFields,
  outputs: [
    { id: "polynomialValue", label: "Polynomial value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      degree: value.degree as number,
      x: value.x as number,
      alpha: value.alpha as number,
    }),
});
export const run = tool.execute;
export default tool;
