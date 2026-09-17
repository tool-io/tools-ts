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
  i.points.forEach(H.point);
  H.rect(i.rectangle);
  return H.finish({
    segments: i.points.slice(1).flatMap((p, j) => {
      const segment = H.clipSegment(i.points[j], p, i.rectangle);
      return segment ? [{ sourceSegment: j, points: segment }] : [];
    }),
  });
};
export const example = {
  input: {
    points: [
      [-1, 1],
      [3, 1],
      [4, 1],
    ],
    rectangle: [0, 0, 2, 2],
  },
  output: {
    result: {
      segments: [
        {
          sourceSegment: 0,
          points: [
            [0, 1],
            [2, 1],
          ],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/polyline-rectangle-clip",
  title: "Polyline Rectangle Clip",
  description:
    "Clip each polyline segment independently, retaining source-segment indexes and boundary point intersections instead of inventing path continuity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
