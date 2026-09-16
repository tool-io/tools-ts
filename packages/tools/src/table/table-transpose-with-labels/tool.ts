import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  table: readonly (readonly number[])[];
  rowLabels: readonly string[];
  columnLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "table", kind: "matrix", label: "table" },
  { id: "rowLabels", kind: "stringList", label: "rowLabels" },
  { id: "columnLabels", kind: "stringList", label: "columnLabels" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.table.length === i.rowLabels.length &&
      i.table.every((r) => r.length === i.columnLabels.length),
  );
  return H.finish({
    table: i.columnLabels.map((_, j) => i.table.map((r) => r[j])),
    rowLabels: [...i.columnLabels],
    columnLabels: [...i.rowLabels],
  });
};
export const example = {
  input: {
    table: [
      [1, 2],
      [3, 4],
    ],
    rowLabels: ["a", "b"],
    columnLabels: ["x", "y"],
  },
  output: {
    result: {
      table: [
        [1, 3],
        [2, 4],
      ],
      rowLabels: ["x", "y"],
      columnLabels: ["a", "b"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/table-transpose-with-labels",
  title: "Table Transpose with Labels",
  description:
    "Transpose a rectangular numeric table together with explicit row and column labels; label identities remain unchanged.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
