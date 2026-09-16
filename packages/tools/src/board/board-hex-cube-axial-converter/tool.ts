import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ x: number; y: number; z: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", kind: "integer", label: "x" },
  { id: "y", kind: "integer", label: "y" },
  { id: "z", kind: "integer", label: "z" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  for (const v of [i.x, i.y, i.z]) H.int(v, -1e9, 1e9);
  H.check(i.x + i.y + i.z === 0);
  return H.finish({ q: i.x, r: i.z });
};
export const example = {
  input: { x: 2, y: -1, z: -1 },
  output: { result: { q: 2, r: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-hex-cube-axial-converter",
  title: "Board Hex Cube Axial Converter",
  description:
    "Convert validated zero-sum integer hex cube coordinates to axial q=x,r=z; invalid cube coordinates are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
