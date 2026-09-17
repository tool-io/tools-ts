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
  return H.finish({ indexes: H.sortedIndexes(i.values) });
};
export const example = {
  input: { values: [30, 10, 10, 20] },
  output: { result: { indexes: [1, 2, 3, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/stable-argsort-indexes",
  title: "Stable Argsort Indexes",
  description:
    "Return stable ascending numeric argsort indexes, retaining equal-key original order without mutating values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
