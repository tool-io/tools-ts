import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  rowIndex: number;
  column: number;
  rowCount: number;
  columnCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rowIndex", label: "Row index", kind: "integer" },
  { id: "column", label: "Column", kind: "integer" },
  { id: "rowCount", label: "Row count", kind: "integer" },
  { id: "columnCount", label: "Column count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rowCount, 1, 26);
  H.int(i.columnCount, 1, 128);
  H.int(i.rowIndex, 0, i.rowCount - 1);
  H.int(i.column, 1, i.columnCount);
  return H.finish({
    well: String.fromCharCode(65 + i.rowIndex) + i.column,
    linearIndex: i.rowIndex * i.columnCount + i.column - 1,
  });
};
export const example = {
  input: { rowIndex: 1, column: 3, rowCount: 8, columnCount: 12 },
  output: { result: { well: "B3", linearIndex: 14 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "biotechnology/assay-plate-row-column-well",
  title: "Biotechnology: Assay Plate Row Column Well Tool",
  description:
    "Resolve a bounded rectangular assay-plate well from zero-based alphabetic row and one-based column; not a plate-layout generator or experimental protocol.",
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
          linearIndex: { type: "number" },
          well: { type: "string" },
        },
        required: ["linearIndex", "well"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
