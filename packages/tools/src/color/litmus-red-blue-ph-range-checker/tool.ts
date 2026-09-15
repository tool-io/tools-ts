import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly measuredPh: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "measuredPh", label: "Measured ph", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.measuredPh, "pH", 0, 14);
  return {
    illustrativeLitmusBand:
      i.measuredPh < 4.5
        ? "red"
        : i.measuredPh > 8.3
          ? "blue"
          : "transition/indeterminate",
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { measuredPh: 7 },
  output: { result: { illustrativeLitmusBand: "transition/indeterminate" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/litmus-red-blue-ph-range-checker",
  title: "Litmus Red/Blue pH Range Check",
  description:
    "Illustrative aqueous litmus transition ~4.5–8.3, inclusive endpoints indeterminate; not assay calibration or solution identification.",
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
