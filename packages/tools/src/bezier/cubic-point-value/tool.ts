import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  t: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  { id: "t", label: "t", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.curve(i.points, 3);
  return H.finish({ value: H.bezier(i.points, i.t) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    t: 0.5,
  },
  output: { result: { value: [1.5, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bezier/cubic-point-value",
  title: "Cubic Bezier Point Value",
  description:
    "Finite planar Bezier control points in supplied order, unit parameter t; evaluate point using De Casteljau arithmetic, not a screen-space or arc-length parameter.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
