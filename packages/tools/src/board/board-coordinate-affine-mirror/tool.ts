import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
  mirrorX: boolean;
  mirrorY: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", kind: "integer", label: "x" },
  { id: "y", kind: "integer", label: "y" },
  { id: "width", kind: "integer", label: "width" },
  { id: "height", kind: "integer", label: "height" },
  { id: "mirrorX", kind: "boolean", label: "mirrorX" },
  { id: "mirrorY", kind: "boolean", label: "mirrorY" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.width, 1, 1e6);
  H.int(i.height, 1, 1e6);
  H.int(i.x, 0, i.width - 1);
  H.int(i.y, 0, i.height - 1);
  return H.finish({
    x: i.mirrorX ? i.width - 1 - i.x : i.x,
    y: i.mirrorY ? i.height - 1 - i.y : i.y,
  });
};
export const example = {
  input: { x: 1, y: 2, width: 5, height: 4, mirrorX: true, mirrorY: false },
  output: { result: { x: 3, y: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-coordinate-affine-mirror",
  title: "Board Coordinate Mirror Tool",
  description:
    "Mirror zero-based rectangular board cell coordinates across explicitly selected board centerlines; no piece-state transformation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
