import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly number[]; reference: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "reference", label: "reference", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    below: i.values.reduce((s, x) => s + Math.max(0, i.reference - x), 0),
    above: i.values.reduce((s, x) => s + Math.max(0, x - i.reference), 0),
  });
};
export const example = {
  input: { values: [1, 2, 9], reference: 3 },
  output: { result: { below: 3, above: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/asymmetric-absolute-deviation-totals",
  title: "Asymmetric Absolute Deviation Totals",
  description:
    "Separate total absolute deviations below and above an explicit reference, retaining asymmetric loss evidence without estimating a distribution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
