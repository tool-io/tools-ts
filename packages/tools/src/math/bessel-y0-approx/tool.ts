import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, besselY0 } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualX: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualX", label: "Actual x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { value: besselY0(input.actualX) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualX: 1 },
  output: { result: { value: 0.08825696421567696 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/bessel-y0-approx",
  title: "Bessel Y0 Approximation",
  description:
    "BesselY0real0<x\u226412convergent power/log series, fixed bounded approximation no large argument claim.",
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
