import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  rows: number;
  columns: number;
  rowLabels: readonly string[];
  columnLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", kind: "integer", label: "rows" },
  { id: "columns", kind: "integer", label: "columns" },
  { id: "rowLabels", kind: "stringList", label: "rowLabels" },
  { id: "columnLabels", kind: "stringList", label: "columnLabels" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rows, 0, 128);
  H.int(i.columns, 0, 128);
  return H.finish({
    rowCountMatches: i.rowLabels.length === i.rows,
    columnCountMatches: i.columnLabels.length === i.columns,
    duplicateRows: H.duplicates(i.rowLabels, (x) => x),
    duplicateColumns: H.duplicates(i.columnLabels, (x) => x),
  });
};
export const example = {
  input: { rows: 2, columns: 1, rowLabels: ["a", "a"], columnLabels: [] },
  output: {
    result: {
      rowCountMatches: true,
      columnCountMatches: false,
      duplicateRows: [{ key: "a", indexes: [0, 1] }],
      duplicateColumns: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/table-row-column-label-coverage",
  title: "Table Row Column Label Coverage",
  description:
    "Audit explicit table label counts and exact duplicate labels, without inventing missing identifiers.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
