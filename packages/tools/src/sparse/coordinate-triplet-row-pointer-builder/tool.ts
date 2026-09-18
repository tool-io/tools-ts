import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  tripletsJson: string;
  rows: number;
  columns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tripletsJson", label: "tripletsJson", kind: "string" },
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.triplets(i.tripletsJson, i.rows, i.columns);
  const sorted = r
    .map((v, index) => ({ ...v, index }))
    .sort((a, b) => a.row - b.row || a.index - b.index);
  H.check(i.rows <= 127);
  return H.finish({
    rowPointers: Array.from(
      { length: i.rows + 1 },
      (_, j) => sorted.filter((v) => v.row < j).length,
    ),
    columnIndexes: sorted.map((v) => v.column),
    values: sorted.map((v) => v.value),
    sourceIndexes: sorted.map((v) => v.index),
  });
};
export const example = {
  input: {
    tripletsJson:
      '[{"row":0,"column":1,"value":2},{"row":0,"column":1,"value":3},{"row":1,"column":0,"value":0}]',
    rows: 2,
    columns: 2,
  },
  output: {
    result: {
      rowPointers: [0, 2, 3],
      columnIndexes: [1, 1, 0],
      values: [2, 3, 0],
      sourceIndexes: [0, 1, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-row-pointer-builder",
  title: "Sparse Coordinate Row Pointer Builder",
  description:
    "Build stable CSR row pointers and aligned column/value/source-index arrays from COO observations; no duplicate combination or per-row column sorting.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
