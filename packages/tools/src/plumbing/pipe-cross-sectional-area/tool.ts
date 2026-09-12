import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualInnerDiameterMeters: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInnerDiameterMeters",
    label: "Actual inner diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualInnerDiameterMeters, "actualInnerDiameterMeters");
  return { value: (Math.PI * input.actualInnerDiameterMeters ** 2) / 4 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualInnerDiameterMeters: 2 },
  output: { result: { value: 3.141592653589793 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-cross-sectional-area",
  title: "Plumbing Pipe Cross Sectional Area Calculator",
  description:
    "Circular PIPE internal wetted cross section\u03c0d\u00b2/4, no nominal DN substitution or wall area. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
