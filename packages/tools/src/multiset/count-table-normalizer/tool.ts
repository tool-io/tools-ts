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
  return H.finish({ counts: H.msRows(H.multiset(i.countsJson)) });
};
export const example = {
  input: {
    countsJson:
      '[{"value":"x","count":1},{"value":"x","count":2},{"value":"y","count":0}]',
  },
  output: { result: { counts: [{ value: "x", count: 3 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/count-table-normalizer",
  title: "Multiset Count Table Normalizer",
  description:
    "Normalize typed scalar count rows by exact identity, summing duplicates and dropping zeros; counts must be nonnegative integers.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
