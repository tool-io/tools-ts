import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ indexes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "indexes", label: "indexes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.indexes.forEach((x) => H.int(x, 1, 1e6));
  return H.finish({ repeated: H.duplicates(i.indexes, String) });
};
export const example = {
  input: { indexes: [1, 3, 3] },
  output: { result: { repeated: [{ key: "3", indexes: [1, 2] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/numbered-placeholder-repeat-table",
  title: "SQL Numbered Placeholder Repeat Table",
  description:
    "Audit repeated explicit positive numbered placeholder occurrences and indexes; repeats are legal binding reuse, not automatically errors.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
