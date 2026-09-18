import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  vertices: readonly (readonly number[])[];
  weights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "vertices", label: "vertices", kind: "matrix" },
  { id: "weights", label: "weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.vertices.length === 3 &&
      i.weights.length === 3 &&
      Math.abs(i.weights.reduce((s, x) => s + x, 0) - 1) < 1e-12,
  );
  i.vertices.forEach(H.point);
  return H.finish({
    point: [0, 1].map((j) =>
      i.vertices.reduce((s, v, k) => s + v[j] * i.weights[k], 0),
    ),
  });
};
export const example = {
  input: {
    vertices: [
      [0, 0],
      [2, 0],
      [0, 2],
    ],
    weights: [0.5, 0.25, 0.25],
  },
  output: { result: { point: [0.5, 0.5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/triangle-barycentric-point",
  title: "Triangle Barycentric Point",
  description:
    "Map three supplied barycentric weights summing to one to a planar triangle point; weights may be negative, no inside-triangle claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
