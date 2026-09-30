import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ rows: number; columns: number; offset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", label: "Rows", kind: "integer" },
  { id: "columns", label: "Columns", kind: "integer" },
  { id: "offset", label: "Offset", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rows, 0, 1000000);
  H.int(i.columns, 0, 1000000);
  H.int(i.offset, -1000000, 1000000);
  return H.finish({
    length: Math.max(
      0,
      Math.min(
        i.rows - Math.max(0, -i.offset),
        i.columns - Math.max(0, i.offset),
      ),
    ),
  });
};
export const example = {
  input: { rows: 3, columns: 5, offset: 2 },
  output: { result: { length: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-diagonal-offset-length",
  title: "Matrix: Matrix Diagonal Offset Length Tool",
  description:
    "Compute the number of entries on one rectangular matrix diagonal with column-minus-row signed offset, without allocating a matrix.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { length: { type: "number" } },
        required: ["length"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
