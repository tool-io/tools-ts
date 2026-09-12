import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, hankel } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualPositiveX: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPositiveX", label: "Actual positive x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return hankel(input.actualPositiveX);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPositiveX: 1 },
  output: {
    result: { real: 0.7651976865579666, imaginary: 0.08825696421567696 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/hankel-function-approx",
  title: "Hankel Function Approximation",
  description:
    "HankelfirstkindH0^(1)=J0+iY0, real positive0<x\u226412, bounded series, complex output not discardYcomponent. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
