import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, erfc } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{
  readonly complementaryErrorFunctionValue: number;
}>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { complementaryErrorFunctionValue: erfc(input.x) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 1 } satisfies Input;
export const exampleOutput = {
  complementaryErrorFunctionValue: 0.15729921223999332,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/error-function-erfc-approx",
  title: "Error Function Erfc Approximation",
  description:
    "Evaluate real erfc directly to preserve small positive tails without subtracting a saturated erf from one on |x|≤26; Numerical Recipes approximation with roughly 1.5e−7 absolute accuracy, not arbitrary precision.",
  inputs: inputFields,
  outputs: [
    {
      id: "complementaryErrorFunctionValue",
      label: "Complementary error function value",
      kind: "number",
    },
  ],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
