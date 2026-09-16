import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ file: number; rank: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "file", kind: "integer", label: "file" },
  { id: "rank", kind: "integer", label: "rank" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.file, 0, 7);
  H.int(i.rank, 0, 7);
  return H.finish({ square: String.fromCharCode(97 + i.file) + (i.rank + 1) });
};
export const example = {
  input: { file: 2, rank: 3 },
  output: { result: { square: "c4" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/chess-square-coordinate-formatter",
  title: "Chess Square Coordinate Formatter",
  description:
    "Format validated zero-based 8\u00d78 chess file/rank coordinates as a lowercase square token.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
