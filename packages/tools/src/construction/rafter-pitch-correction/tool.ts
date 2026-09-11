import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualRisePerHorizontalRun: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRisePerHorizontalRun",
    label: "Actual rise per horizontal run",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualRisePerHorizontalRun, "actualRisePerHorizontalRun");
  return { value: Math.sqrt(1 + input.actualRisePerHorizontalRun ** 2) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRisePerHorizontalRun: 1 },
  output: { result: { value: 1.4142135623730951 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/rafter-pitch-correction",
  title: "Rafter Pitch Correction Calculator",
  description:
    "Rafter sloping length/horizontal run pitch correction factor\u221a(1+p\u00b2), not theoretical rafter length already covered. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
