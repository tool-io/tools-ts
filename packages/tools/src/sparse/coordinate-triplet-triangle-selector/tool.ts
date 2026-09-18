import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  tripletsJson: string;
  rows: number;
  columns: number;
  upper: boolean;
  includeDiagonal: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tripletsJson", label: "tripletsJson", kind: "string" },
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "upper", label: "upper", kind: "boolean" },
  { id: "includeDiagonal", label: "includeDiagonal", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.triplets(i.tripletsJson, i.rows, i.columns);
  return H.finish({
    triplets: r.filter((v) =>
      i.upper
        ? i.includeDiagonal
          ? v.column >= v.row
          : v.column > v.row
        : i.includeDiagonal
          ? v.column <= v.row
          : v.column < v.row,
    ),
  });
};
export const example = {
  input: {
    tripletsJson:
      '[{"row":0,"column":1,"value":2},{"row":0,"column":1,"value":3},{"row":1,"column":0,"value":0}]',
    rows: 2,
    columns: 2,
    upper: true,
    includeDiagonal: false,
  },
  output: {
    result: {
      triplets: [
        { row: 0, column: 1, value: 2 },
        { row: 0, column: 1, value: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-triangle-selector",
  title: "Sparse Coordinate Triangle Selector",
  description:
    "Select explicit upper or lower COO triangular coordinate observations with a caller diagonal policy; no implied symmetric values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
