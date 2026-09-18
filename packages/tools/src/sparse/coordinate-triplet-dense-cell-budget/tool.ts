import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  rows: number;
  columns: number;
  bytesPerCell: number;
  budget: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "bytesPerCell", label: "bytesPerCell", kind: "integer" },
  { id: "budget", label: "budget", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rows, 0, 1e9);
  H.int(i.columns, 0, 1e9);
  H.int(i.bytesPerCell, 1, 1024);
  const cells = BigInt(i.rows) * BigInt(i.columns),
    bytes = cells * BigInt(i.bytesPerCell);
  H.check(H.bigint(i.budget) >= 0n);
  return H.finish({
    cells: String(cells),
    bytes: String(bytes),
    fits: bytes <= H.bigint(i.budget),
  });
};
export const example = {
  input: { rows: 100, columns: 100, bytesPerCell: 8, budget: "1000" },
  output: { result: { cells: "10000", bytes: "80000", fits: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/coordinate-triplet-dense-cell-budget",
  title: "Sparse Dense Cell Budget",
  description:
    "Budget exact dense storage for explicit sparse matrix dimensions and bytes per cell without materializing a matrix; excludes allocator overhead.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
