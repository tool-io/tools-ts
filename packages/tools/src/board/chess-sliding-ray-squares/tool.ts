import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ square: string; dx: number; dy: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "square", kind: "string", label: "square" },
  { id: "dx", kind: "integer", label: "dx" },
  { id: "dy", kind: "integer", label: "dy" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [x, y] = H.square(i.square);
  H.int(i.dx, -1, 1);
  H.int(i.dy, -1, 1);
  H.check(i.dx !== 0 || i.dy !== 0);
  const squares: string[] = [];
  for (
    let a = x + i.dx, b = y + i.dy;
    a >= 0 && a < 8 && b >= 0 && b < 8;
    a += i.dx, b += i.dy
  )
    squares.push(String.fromCharCode(97 + a) + (b + 1));
  return H.finish({ squares });
};
export const example = {
  input: { square: "f6", dx: 1, dy: 1 },
  output: { result: { squares: ["g7", "h8"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/chess-sliding-ray-squares",
  title: "Chess Sliding Ray Squares",
  description:
    "Enumerate an empty-board sliding ray in a supplied unit grid direction, excluding the origin and stopping at the board edge.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
