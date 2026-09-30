import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  size: number;
  row: number;
  column: number;
  includeDiagonal: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "size", label: "Size", kind: "integer" },
  { id: "row", label: "Row", kind: "integer" },
  { id: "column", label: "Column", kind: "integer" },
  { id: "includeDiagonal", label: "Include diagonal", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 1, 1000000);
  H.int(i.row, 0, i.size - 1);
  H.int(i.column, 0, i.size - 1);
  H.check(i.includeDiagonal ? i.column >= i.row : i.column > i.row);
  const offset =
    i.row * i.size -
    (i.row * (i.row - 1)) / 2 +
    i.column -
    i.row -
    (i.includeDiagonal ? 0 : i.row + 1);
  return H.finish({ packedOffset: offset });
};
export const example = {
  input: { size: 4, row: 1, column: 2, includeDiagonal: true },
  output: { result: { packedOffset: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-packed-upper-index",
  title: "Matrix: Matrix Packed Upper Index Tool",
  description:
    "Map one upper triangle entry to zero-based row-wise packed storage under explicit diagonal inclusion; no matrix allocation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { packedOffset: { type: "number" } },
        required: ["packedOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
