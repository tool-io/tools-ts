import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ mass: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mass", label: "mass", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.nonnegative(i.mass);
  const total = i.mass.reduce((s, x) => s + x, 0);
  return H.finish({
    total,
    probabilities: i.mass.map((x) => (total ? x / total : null)),
  });
};
export const example = {
  input: { mass: [1, 3, 0] },
  output: { result: { total: 4, probabilities: [0.25, 0.75, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-count-probability-table",
  title: "Histogram Bin Probability Table",
  description:
    "Normalize supplied nonnegative histogram counts/weights into per-bin observed mass, with null for a zero-total bank; no underlying distribution claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
