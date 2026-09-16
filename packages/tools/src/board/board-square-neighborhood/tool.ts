import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  diagonal: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", kind: "integer", label: "x" },
  { id: "y", kind: "integer", label: "y" },
  { id: "width", kind: "integer", label: "width" },
  { id: "height", kind: "integer", label: "height" },
  { id: "diagonal", kind: "boolean", label: "diagonal" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.width, 1, 1e6);
  H.int(i.height, 1, 1e6);
  H.int(i.x, 0, i.width - 1);
  H.int(i.y, 0, i.height - 1);
  const cells: number[][] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++)
      if ((dx || dy) && (i.diagonal || !dx || !dy)) {
        const x = i.x + dx,
          y = i.y + dy;
        if (x >= 0 && x < i.width && y >= 0 && y < i.height) cells.push([x, y]);
      }
  return H.finish({ cells });
};
export const example = {
  input: { x: 0, y: 0, width: 3, height: 3, diagonal: false },
  output: {
    result: {
      cells: [
        [1, 0],
        [0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-square-neighborhood",
  title: "Board Square Neighborhood",
  description:
    "Enumerate bounded orthogonal or eight-neighbor square-board cells with explicit edge clipping; origin is excluded.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
