import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  tripletsJson: string;
  rows: number;
  columns: number;
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tripletsJson", label: "tripletsJson", kind: "string" },
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "rowStart", label: "rowStart", kind: "integer" },
  { id: "rowEnd", label: "rowEnd", kind: "integer" },
  { id: "columnStart", label: "columnStart", kind: "integer" },
  { id: "columnEnd", label: "columnEnd", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.triplets(i.tripletsJson, i.rows, i.columns);
  H.int(i.rowStart, 0, i.rows);
  H.int(i.rowEnd, i.rowStart, i.rows);
  H.int(i.columnStart, 0, i.columns);
  H.int(i.columnEnd, i.columnStart, i.columns);
  return H.finish({
    rows: i.rowEnd - i.rowStart,
    columns: i.columnEnd - i.columnStart,
    triplets: r
      .filter(
        (v) =>
          v.row >= i.rowStart &&
          v.row < i.rowEnd &&
          v.column >= i.columnStart &&
          v.column < i.columnEnd,
      )
      .map((v) => ({
        ...v,
        row: v.row - i.rowStart,
        column: v.column - i.columnStart,
      })),
  });
};
export const example = {
  input: {
    tripletsJson:
      '[{"row":0,"column":1,"value":2},{"row":0,"column":1,"value":3},{"row":1,"column":0,"value":0}]',
    rows: 2,
    columns: 2,
    rowStart: 0,
    rowEnd: 1,
    columnStart: 1,
    columnEnd: 2,
  },
  output: {
    result: {
      rows: 1,
      columns: 1,
      triplets: [
        { row: 0, column: 0, value: 2 },
        { row: 0, column: 0, value: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-crop",
  title: "Sparse Coordinate Triplet Crop",
  description:
    "Crop a COO matrix to a half-open coordinate rectangle and rebase retained entries, preserving duplicates and explicit zero observations.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
