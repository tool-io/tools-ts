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
  return H.finish({
    inclusive: i.mass.map((_, j) => i.mass.slice(j).reduce((s, x) => s + x, 0)),
  });
};
export const example = {
  input: { mass: [1, 3, 0] },
  output: { result: { inclusive: [4, 3, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-tail-mass-table",
  title: "Histogram Tail Mass Table",
  description:
    "Accumulate histogram tail masses including each current bin, preserving empty bins and raw nonnegative mass units.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
