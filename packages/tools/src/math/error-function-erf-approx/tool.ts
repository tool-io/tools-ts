import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, erf } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{ readonly errorFunctionValue: number }>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    errorFunctionValue: erf(input.x),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 1 } satisfies Input;
export const exampleOutput = {
  errorFunctionValue: 0.8427007877600067,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/error-function-erf-approx",
  title: "Error Function Erf Approximation",
  description:
    "Evaluate real erf using direct near-zero Taylor series, odd symmetry and complementary approximation on |x|≤26; roughly 1.5e−7 absolute accuracy outside Taylor regime, not arbitrary precision.",
  inputs: inputFields,
  outputs: [
    { id: "errorFunctionValue", label: "Error function value", kind: "number" },
  ],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
