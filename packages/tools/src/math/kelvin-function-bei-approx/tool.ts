import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, kelvin } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{ readonly kelvinBeiValue: number }>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { kelvinBeiValue: kelvin(input.x).bei };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 1 } satisfies Input;
export const exampleOutput = {
  kelvinBeiValue: 0.2495660400366597,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/kelvin-function-bei-approx",
  title: "Kelvin Bei Approximation",
  description:
    "Evaluate Kelvin bei(x), the imaginary component of J0(x exp(3πi/4)), from bounded real power series |x|≤20; positive sign convention and real/imaginary operation explicit.",
  inputs: inputFields,
  outputs: [
    { id: "kelvinBeiValue", label: "Kelvin bei value", kind: "number" },
  ],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
