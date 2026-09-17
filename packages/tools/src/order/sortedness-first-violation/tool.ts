import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const j = i.values.findIndex((v, j) => j > 0 && v < i.values[j - 1]);
  return H.finish({ sorted: j < 0, violation: j < 0 ? null : [j - 1, j] });
};
export const example = {
  input: { values: [1, 3, 2, 0] },
  output: { result: { sorted: false, violation: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/sortedness-first-violation",
  title: "Sortedness First Violation Finder",
  description:
    "Find the first adjacent inversion in a nondecreasing numeric list; exact equal keys are accepted as sorted.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
