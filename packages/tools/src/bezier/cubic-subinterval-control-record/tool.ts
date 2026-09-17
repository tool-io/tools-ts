import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  start: number;
  end: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  { id: "start", label: "start", kind: "number" },
  { id: "end", label: "end", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.curve(i.points, 3);
  H.unit(i.start);
  H.unit(i.end);
  H.check(i.end >= i.start);
  return H.finish({
    points:
      i.end === 0
        ? i.points.map(() => [...i.points[0]])
        : H.bezierSplit(H.bezierSplit(i.points, i.end).left, i.start / i.end)
            .right,
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    start: 0.25,
    end: 0.75,
  },
  output: {
    result: {
      points: [
        [0.75, 0],
        [1.25, 0],
        [1.75, 0],
        [2.25, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bezier/cubic-subinterval-control-record",
  title: "Cubic Bezier Subinterval Control Record",
  description:
    "Extract cubic Bezier subinterval control points, reparameterized to the unit interval; equal endpoints produce a point-valued cubic, no extrapolation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
