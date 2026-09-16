import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ x: number; y: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", kind: "integer", label: "x" },
  { id: "y", kind: "integer", label: "y" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.x);
  H.int(i.y);
  return H.finish({ parity: (i.x + i.y) % 2 });
};
export const example = {
  input: { x: 2, y: 3 },
  output: { result: { parity: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-cell-checker-parity",
  title: "Board Cell Checker Parity",
  description:
    "Compute abstract checkerboard cell parity on nonnegative integer coordinates; does not assign chess color names.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
