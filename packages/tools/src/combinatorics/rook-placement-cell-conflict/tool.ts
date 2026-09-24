import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  existingRows: readonly number[];
  existingColumns: readonly number[];
  candidateRow: number;
  candidateColumn: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "existingRows", label: "Existing rows", kind: "numberList" },
  { id: "existingColumns", label: "Existing columns", kind: "numberList" },
  { id: "candidateRow", label: "Candidate row", kind: "integer" },
  { id: "candidateColumn", label: "Candidate column", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.existingRows.length === i.existingColumns.length);
  [
    ...i.existingRows,
    ...i.existingColumns,
    i.candidateRow,
    i.candidateColumn,
  ].forEach((x) => H.int(x, 0, 1000000));
  return H.finish({
    rowConflict: i.existingRows.includes(i.candidateRow),
    columnConflict: i.existingColumns.includes(i.candidateColumn),
    nonattacking:
      !i.existingRows.includes(i.candidateRow) &&
      !i.existingColumns.includes(i.candidateColumn),
  });
};
export const example = {
  input: {
    existingRows: [0, 2],
    existingColumns: [1, 3],
    candidateRow: 1,
    candidateColumn: 3,
  },
  output: {
    result: { rowConflict: false, columnConflict: true, nonattacking: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/rook-placement-cell-conflict",
  title: "Combinatorics: Rook Placement Cell Conflict Tool",
  description:
    "Check whether one candidate rook attacks an explicitly supplied paired rook placement by row or column, without solving a board-packing problem.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          columnConflict: { type: "boolean" },
          nonattacking: { type: "boolean" },
          rowConflict: { type: "boolean" },
        },
        required: ["columnConflict", "nonattacking", "rowConflict"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
