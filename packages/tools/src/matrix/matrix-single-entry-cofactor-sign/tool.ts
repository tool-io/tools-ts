import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ row: number; column: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", label: "Row", kind: "integer" },
  { id: "column", label: "Column", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.row, 0, 1000000);
  H.int(i.column, 0, 1000000);
  return H.finish({ cofactorSign: (i.row + i.column) % 2 === 0 ? 1 : -1 });
};
export const example = {
  input: { row: 1, column: 2 },
  output: { result: { cofactorSign: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-single-entry-cofactor-sign",
  title: "Matrix: Matrix Single Entry Cofactor Sign Tool",
  description:
    "Return one checkerboard cofactor sign under zero-based row/column indexing, without a determinant or minor computation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cofactorSign: { type: "number" } },
        required: ["cofactorSign"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
