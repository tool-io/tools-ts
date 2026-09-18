import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ q: number; r: number; horizontal: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "q", label: "q", kind: "integer" },
  { id: "r", label: "r", kind: "integer" },
  { id: "horizontal", label: "horizontal", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.q, -1e9, 1e9);
  H.int(i.r, -1e9, 1e9);
  return H.finish({
    column: i.horizontal ? 2 * i.q + i.r : i.q,
    row: i.horizontal ? i.r : 2 * i.r + i.q,
  });
};
export const example = {
  input: { q: 2, r: 1, horizontal: true },
  output: { result: { column: 5, row: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/axial-doubled-coordinate-formatter",
  title: "Hex Axial Doubled Coordinate Formatter",
  description:
    "Convert integer axial hex coordinates to horizontal- or vertical-doubled coordinates, preserving parity-constrained lattice spacing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
