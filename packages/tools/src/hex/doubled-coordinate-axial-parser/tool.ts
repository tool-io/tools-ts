import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  column: number;
  row: number;
  horizontal: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "column", label: "column", kind: "integer" },
  { id: "row", label: "row", kind: "integer" },
  { id: "horizontal", label: "horizontal", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.column, -1e9, 1e9);
  H.int(i.row, -1e9, 1e9);
  H.check(H.mod(i.column - i.row, 2) === 0);
  return H.finish({
    q: i.horizontal ? (i.column - i.row) / 2 : i.column,
    r: i.horizontal ? i.row : (i.row - i.column) / 2,
  });
};
export const example = {
  input: { column: 5, row: 1, horizontal: true },
  output: { result: { q: 2, r: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/doubled-coordinate-axial-parser",
  title: "Hex Doubled Coordinate Axial Parser",
  description:
    "Invert doubled hex coordinates only when column-row parity agrees; odd parity is invalid lattice evidence, not rounded silently.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
