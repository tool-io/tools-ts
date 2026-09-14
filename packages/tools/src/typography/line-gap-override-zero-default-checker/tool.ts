import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly measuredLineGapUnits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "measuredLineGapUnits",
    label: "Measured line gap units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.measuredLineGapUnits, "gap");
  return { hasZeroMeasuredGap: i.measuredLineGapUnits === 0 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { measuredLineGapUnits: 0 },
  output: { result: { hasZeroMeasuredGap: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/line-gap-override-zero-default-checker",
  title: "Line-Gap Override Zero Default Check",
  description:
    "Check whether actual measured font line gap is zero; CSS normal does not itself guarantee zero.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
