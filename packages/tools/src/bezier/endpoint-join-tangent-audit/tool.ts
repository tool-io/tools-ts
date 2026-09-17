import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly (readonly number[])[];
  right: readonly (readonly number[])[];
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "matrix" },
  { id: "right", label: "right", kind: "matrix" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.curve(i.left);
  H.curve(i.right);
  H.check(i.tolerance >= 0);
  const a = H.bezierDerivative(i.left).at(-1)!,
    b = H.bezierDerivative(i.right)[0],
    n = Math.hypot(...a) * Math.hypot(...b);
  return H.finish({
    leftTangent: a,
    rightTangent: b,
    c1: Math.hypot(a[0] - b[0], a[1] - b[1]) <= i.tolerance,
    directionAligned:
      n === 0
        ? null
        : Math.abs(a[0] * b[1] - a[1] * b[0]) <= i.tolerance * n &&
          a[0] * b[0] + a[1] * b[1] > 0,
  });
};
export const example = {
  input: {
    left: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    right: [
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
    ],
    tolerance: 0,
  },
  output: {
    result: {
      leftTangent: [3, 0],
      rightTangent: [3, 0],
      c1: true,
      directionAligned: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bezier/endpoint-join-tangent-audit",
  title: "Bezier Endpoint Join Tangent Audit",
  description:
    "Audit actual degree-scaled endpoint tangents for C1 equality and same-direction alignment separately; zero tangents yield unknown alignment, position continuity is not assumed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
