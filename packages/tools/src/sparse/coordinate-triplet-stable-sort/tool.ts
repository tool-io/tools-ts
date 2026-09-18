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
  return H.finish({
    triplets: r
      .map((v, index) => ({ ...v, index }))
      .sort(
        (a, b) => a.row - b.row || a.column - b.column || a.index - b.index,
      ),
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
      triplets: [
        { row: 0, column: 1, value: 2, index: 0 },
        { row: 0, column: 1, value: 3, index: 1 },
        { row: 1, column: 0, value: 0, index: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-stable-sort",
  title: "Sparse Coordinate Triplet Stable Sort",
  description:
    "Stable row-major COO coordinate ordering with original index provenance; duplicate coordinates and explicit zeros remain observations.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
