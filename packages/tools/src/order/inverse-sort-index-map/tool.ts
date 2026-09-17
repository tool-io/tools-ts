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
  const p = H.sortedIndexes(i.values);
  return H.finish({ positions: i.values.map((_, j) => p.indexOf(j)) });
};
export const example = {
  input: { values: [30, 10, 10, 20] },
  output: { result: { positions: [3, 0, 1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/inverse-sort-index-map",
  title: "Inverse Sort Index Map",
  description:
    "Return each original value\u2019s position in a stable ascending numeric sort, the inverse argsort mapping; ties remain stable.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
