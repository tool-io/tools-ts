import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ square: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "square", kind: "string", label: "square" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [file, rank] = H.square(i.square);
  return H.finish({ file, rank });
};
export const example = {
  input: { square: "c4" },
  output: { result: { file: 2, rank: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/chess-square-coordinate-parser",
  title: "Chess Square Coordinate Parser",
  description:
    "Parse a strict lowercase a1\u2013h8 chess square into zero-based file and rank; no algebraic move parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
