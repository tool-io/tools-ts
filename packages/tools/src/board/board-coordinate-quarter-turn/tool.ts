import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  turns: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", kind: "integer", label: "x" },
  { id: "y", kind: "integer", label: "y" },
  { id: "width", kind: "integer", label: "width" },
  { id: "height", kind: "integer", label: "height" },
  { id: "turns", kind: "integer", label: "turns" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.width, 1, 1e6);
  H.int(i.height, 1, 1e6);
  H.int(i.x, 0, i.width - 1);
  H.int(i.y, 0, i.height - 1);
  H.int(i.turns, -1e9, 1e9);
  let x = i.x,
    y = i.y,
    width = i.width,
    height = i.height;
  for (let j = 0; j < H.mod(i.turns, 4); j++) {
    [x, y] = [height - 1 - y, x];
    [width, height] = [height, width];
  }
  return H.finish({ x, y, width, height });
};
export const example = {
  input: { x: 1, y: 2, width: 5, height: 4, turns: 1 },
  output: { result: { x: 1, y: 1, width: 4, height: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-coordinate-quarter-turn",
  title: "Board Coordinate Quarter Turn",
  description:
    "Apply signed clockwise quarter turns to zero-based board coordinates, retaining swapped rectangular dimensions; positive y points downward.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
