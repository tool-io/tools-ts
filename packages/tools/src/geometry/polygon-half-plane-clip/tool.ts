import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  normalX: number;
  normalY: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  { id: "normalX", label: "normalX", kind: "number" },
  { id: "normalY", label: "normalY", kind: "number" },
  { id: "maximum", label: "maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    points: H.clipPolygon(i.points, i.normalX, i.normalY, i.maximum),
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ],
    normalX: 1,
    normalY: 0,
    maximum: 1,
  },
  output: {
    result: {
      points: [
        [0, 0],
        [1, 0],
        [1, 2],
        [0, 2],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/polygon-half-plane-clip",
  title: "Polygon Half Plane Clip",
  description:
    "Clip an ordered polygon against the closed half-plane nx*x+ny*y<=maximum; no self-intersection validation or geographic geometry.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
