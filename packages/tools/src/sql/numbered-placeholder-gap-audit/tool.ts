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
  i.indexes.forEach((x) => H.int(x, 1, 128));
  const maximum = i.indexes.length ? Math.max(...i.indexes) : 0;
  return H.finish({
    missing: Array.from({ length: maximum }, (_, j) => j + 1).filter(
      (j) => !i.indexes.includes(j),
    ),
  });
};
export const example = {
  input: { indexes: [1, 3, 3] },
  output: { result: { missing: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/numbered-placeholder-gap-audit",
  title: "SQL Numbered Placeholder Gap Audit",
  description:
    "Audit gaps in explicit numbered SQL placeholder occurrences from one through the observed maximum; bounded to 128, no SQL lexer or parameter-count assumption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
