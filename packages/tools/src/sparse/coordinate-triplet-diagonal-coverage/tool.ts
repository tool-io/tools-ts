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
    missing: Array.from(
      { length: Math.min(i.rows, i.columns) },
      (_, j) => j,
    ).filter((j) => !r.some((v) => v.row === j && v.column === j)),
    explicitZeroIndexes: r.flatMap((v, j) =>
      v.row === v.column && v.value === 0 ? [j] : [],
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
  output: { result: { missing: [0, 1], explicitZeroIndexes: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-diagonal-coverage",
  title: "Sparse Diagonal Coverage Check",
  description:
    "Audit COO diagonal observation coverage separately from explicitly observed zero diagonal values; no assumption of implicit zeros as supplied evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
