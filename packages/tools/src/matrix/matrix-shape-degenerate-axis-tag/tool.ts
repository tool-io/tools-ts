import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ rows: number; columns: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", label: "Rows", kind: "integer" },
  { id: "columns", label: "Columns", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rows, 0, 1000000000);
  H.int(i.columns, 0, 1000000000);
  return H.finish({
    empty: i.rows === 0 || i.columns === 0,
    rowSingleton: i.rows === 1,
    columnSingleton: i.columns === 1,
    scalarShape: i.rows === 1 && i.columns === 1,
  });
};
export const example = {
  input: { rows: 0, columns: 3 },
  output: {
    result: {
      empty: true,
      rowSingleton: false,
      columnSingleton: false,
      scalarShape: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-shape-degenerate-axis-tag",
  title: "Matrix: Matrix Shape Degenerate Axis Tag Tool",
  description:
    "Tag an explicit matrix shape for empty and singleton axes without needing rows that cannot represent zero-by-N shape unambiguously.",
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
          columnSingleton: { type: "boolean" },
          empty: { type: "boolean" },
          rowSingleton: { type: "boolean" },
          scalarShape: { type: "boolean" },
        },
        required: ["columnSingleton", "empty", "rowSingleton", "scalarShape"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
