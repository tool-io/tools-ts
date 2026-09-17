import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.curve(i.points, 2);
  return H.finish({
    points: [
      i.points[0],
      i.points[0].map((x, j) => (x + 2 * i.points[1][j]) / 3),
      i.points[2].map((x, j) => (x + 2 * i.points[1][j]) / 3),
      i.points[2],
    ],
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
  },
  output: {
    result: {
      points: [
        [0, 0],
        [0.6666666666666666, 0.6666666666666666],
        [1.3333333333333333, 0.6666666666666666],
        [2, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bezier/quadratic-degree-elevation",
  title: "Quadratic Bezier Degree Elevation",
  description:
    "Elevate one planar quadratic Bezier to cubic control points without changing its parameterized geometry; no fitting or approximation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
