import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  size: number;
  row: number;
  column: number;
  firstVector: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "size", label: "Size", kind: "integer" },
  { id: "row", label: "Row", kind: "integer" },
  { id: "column", label: "Column", kind: "integer" },
  {
    id: "firstVector",
    label: "First vector",
    kind: "string",
    enum: ["column", "row"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 1, 1000000000);
  H.int(i.row, 0, i.size - 1);
  H.int(i.column, 0, i.size - 1);
  H.choice(i.firstVector, ["column", "row"]);
  return H.finish({
    sourceIndex: H.mod(
      i.firstVector === "column" ? i.row - i.column : i.column - i.row,
      i.size,
    ),
  });
};
export const example = {
  input: { size: 5, row: 1, column: 3, firstVector: "column" },
  output: { result: { sourceIndex: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-circulant-source-index",
  title: "Matrix: Matrix Circulant Source Index Tool",
  description:
    "Resolve one circulant entry to its source first-column or first-row vector index under an explicit convention, without creating a matrix.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { sourceIndex: { type: "number" } },
        required: ["sourceIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
