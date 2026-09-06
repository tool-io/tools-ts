import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch45-shared.js";
export type Input = Readonly<{ readonly clockPosition: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clockPosition", label: "Clock position", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.clockPosition, "clock", 1, 12);
  return { axisDegreesClockwise: (input.clockPosition % 12) * 30 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { clockPosition: 12 },
  output: { result: { axisDegreesClockwise: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/die-axis-clock-position-lookup",
  title: "Die Axis Clock Position Lookup",
  description:
    "Convert exact integer die-axis clock notation1\u201312to clockwise angle from12oclock, viewer convention. Not observed rotation deviation or a grade/authenticity determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
