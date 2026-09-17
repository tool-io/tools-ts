import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  rectangle: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  { id: "rectangle", label: "rectangle", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.rect(i.rectangle);
  let p = i.points.map((r) => [...r]);
  for (const [nx, ny, c] of [
    [-1, 0, -i.rectangle[0]],
    [1, 0, i.rectangle[2]],
    [0, -1, -i.rectangle[1]],
    [0, 1, i.rectangle[3]],
  ])
    p = H.clipPolygon(p, nx, ny, c);
  return H.finish({ points: p });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ],
    rectangle: [0, 0, 1, 1],
  },
  output: {
    result: {
      points: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/polygon-rectangle-clip",
  title: "Polygon Rectangle Clip",
  description:
    "Clip an ordered planar polygon against four rectangle half-planes, preserving algorithm order; floating boundary arithmetic, no polygon topology repair.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
