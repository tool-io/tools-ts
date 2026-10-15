import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  vertices: readonly (readonly number[])[];
  point: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "vertices", label: "vertices", kind: "matrix" },
  { id: "point", label: "point", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.vertices.length === 3);
  i.vertices.forEach(H.point);
  H.point(i.point);
  const [a, b, c] = i.vertices,
    den = H.cross(a, b, c);
  H.check(den !== 0);
  const u = H.cross(a, i.point, c) / den,
    v = H.cross(a, b, i.point) / den;
  return H.finish({ weights: [1 - u - v, u, v] });
};
export const example = {
  input: {
    vertices: [
      [0, 0],
      [2, 0],
      [0, 2],
    ],
    point: [0.5, 0.5],
  },
  output: { result: { weights: [0.5, 0.25, 0.25] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Triangle Point Barycentric Coordinates", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/triangle-point-barycentric",
  title: "Triangle Point Barycentric Coordinates",
  description:
    "Invert planar barycentric coordinates on a nondegenerate supplied triangle; floating arithmetic and signed exterior weights are retained.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { weights: { type: "array", items: { type: "number" } } },
        required: ["weights"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
