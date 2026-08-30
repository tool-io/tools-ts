import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, kelvin } from "../batch-shared.js";
export type Input = Readonly<{ readonly x: number }>;
export type Output = Readonly<{ readonly kelvinBerValue: number }>;
const inputFields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { kelvinBerValue: kelvin(input.x).ber };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { x: 1 } satisfies Input;
export const exampleOutput = {
  kelvinBerValue: 0.984381781213087,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/kelvin-function-ber-approx",
  title: "Kelvin Ber Approximation",
  description:
    "Evaluate Kelvin ber(x), the real component of J0(x exp(3πi/4)), from bounded real power series |x|≤20; positive sign convention and real/imaginary operation explicit.",
  inputs: inputFields,
  outputs: [
    { id: "kelvinBerValue", label: "Kelvin ber value", kind: "number" },
  ],
  calculate: (value) => calculate({ x: value.x as number }),
});
export const run = tool.execute;
export default tool;
