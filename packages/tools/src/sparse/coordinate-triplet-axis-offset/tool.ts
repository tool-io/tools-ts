import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  tripletsJson: string;
  rows: number;
  columns: number;
  rowOffset: number;
  columnOffset: number;
  targetRows: number;
  targetColumns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tripletsJson", label: "tripletsJson", kind: "string" },
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "rowOffset", label: "rowOffset", kind: "integer" },
  { id: "columnOffset", label: "columnOffset", kind: "integer" },
  { id: "targetRows", label: "targetRows", kind: "integer" },
  { id: "targetColumns", label: "targetColumns", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.triplets(i.tripletsJson, i.rows, i.columns);
  H.int(i.targetRows, 0, 128);
  H.int(i.targetColumns, 0, 128);
  H.int(i.rowOffset, -128, 128);
  H.int(i.columnOffset, -128, 128);
  return H.finish({
    triplets: r.map((v) => {
      const row = v.row + i.rowOffset,
        column = v.column + i.columnOffset;
      H.int(row, 0, i.targetRows - 1);
      H.int(column, 0, i.targetColumns - 1);
      return { ...v, row, column };
    }),
  });
};
export const example = {
  input: {
    tripletsJson:
      '[{"row":0,"column":1,"value":2},{"row":0,"column":1,"value":3},{"row":1,"column":0,"value":0}]',
    rows: 2,
    columns: 2,
    rowOffset: 1,
    columnOffset: 1,
    targetRows: 3,
    targetColumns: 3,
  },
  output: {
    result: {
      triplets: [
        { row: 1, column: 2, value: 2 },
        { row: 1, column: 2, value: 3 },
        { row: 2, column: 1, value: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-axis-offset",
  title: "Sparse Coordinate Axis Offset",
  description:
    "Translate bounded COO coordinates into explicitly supplied target dimensions; out-of-target entries are rejected rather than clipped.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
