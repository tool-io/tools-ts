import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ countsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "countsJson", kind: "string", label: "countsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.msRows(H.multiset(i.countsJson));
  H.check(r.reduce((s, v) => s + v.count, 0) <= 128);
  return H.finish({ values: r.flatMap((v) => Array(v.count).fill(v.value)) });
};
export const example = {
  input: { countsJson: '[{"value":1,"count":2},{"value":"a","count":1}]' },
  output: { result: { values: [1, 1, "a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/count-table-expander",
  title: "Multiset Count Table Expander",
  description:
    "Expand normalized typed multiplicity rows into a bounded occurrence list, preserving first key appearance order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
