import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ row: number; column: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", label: "row", kind: "integer" },
  { id: "column", label: "column", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.row, 1, 1e6);
  H.int(i.column, 1, 1e6);
  return H.finish({ token: "[" + i.row + ";" + i.column + "H" });
};
export const example = {
  input: { row: 2, column: 3 },
  output: { result: { token: "\u001b[2;3H" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/csi-cursor-position-formatter",
  title: "Terminal CSI Cursor Position Formatter",
  description:
    "Format an explicit one-based CSI CUP row/column position token; does not move a cursor or inspect screen dimensions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
