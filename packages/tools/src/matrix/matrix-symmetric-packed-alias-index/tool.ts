import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ size: number; row: number; column: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "size", label: "Size", kind: "integer" },
  { id: "row", label: "Row", kind: "integer" },
  { id: "column", label: "Column", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 1, 1000000);
  H.int(i.row, 0, i.size - 1);
  H.int(i.column, 0, i.size - 1);
  const r = Math.max(i.row, i.column),
    c = Math.min(i.row, i.column);
  return H.finish({
    packedLowerOffset: (r * (r + 1)) / 2 + c,
    mirrored: i.row < i.column,
  });
};
export const example = {
  input: { size: 4, row: 1, column: 3 },
  output: { result: { packedLowerOffset: 7, mirrored: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-symmetric-packed-alias-index",
  title: "Matrix: Matrix Symmetric Packed Alias Index Tool",
  description:
    "Resolve a symmetric matrix entry to inclusive row-wise lower-triangle packed storage, reflecting upper entries instead of rejecting them.",
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
          mirrored: { type: "boolean" },
          packedLowerOffset: { type: "number" },
        },
        required: ["mirrored", "packedLowerOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
