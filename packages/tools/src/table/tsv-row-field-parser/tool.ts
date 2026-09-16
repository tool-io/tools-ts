import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ row: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", kind: "string", label: "row" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ cells: H.splitEscaped(i.row, "\t") });
};
export const example = {
  input: { row: "a\tb\\nc" },
  output: { result: { cells: ["a", "b\nc"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/tsv-row-field-parser",
  title: "TSV Row Field Parser",
  description:
    "Parse or format a single backslash-escaped TSV row, preserving empty cells and explicit control escapes; not a Markdown table parser.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
