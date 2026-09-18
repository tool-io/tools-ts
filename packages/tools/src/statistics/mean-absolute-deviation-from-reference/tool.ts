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
    deviation: H.mean(i.values.map((x) => Math.abs(x - i.reference))),
  });
};
export const example = {
  input: { values: [1, 2, 9], reference: 1 },
  output: { result: { deviation: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "statistics/mean-absolute-deviation-from-reference",
  title: "Mean Absolute Deviation from Reference",
  description:
    "Compute mean absolute deviation about a caller-supplied reference; existing mean-absolute-deviation centers on the sample mean instead.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
