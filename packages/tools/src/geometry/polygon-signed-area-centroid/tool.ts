import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "points", label: "points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.points.length >= 3);
  i.points.forEach(H.point);
  let sum = 0,
    x = 0,
    y = 0;
  i.points.forEach((p, j) => {
    const q = i.points[(j + 1) % i.points.length],
      v = p[0] * q[1] - q[0] * p[1];
    sum += v;
    x += (p[0] + q[0]) * v;
    y += (p[1] + q[1]) * v;
  });
  return H.finish({
    signedArea: sum / 2,
    centroid: sum === 0 ? null : [x / (3 * sum), y / (3 * sum)],
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [2, 0],
      [0, 2],
    ],
  },
  output: {
    result: {
      signedArea: 2,
      centroid: [0.6666666666666666, 0.6666666666666666],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polygon Signed Area Centroid", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/polygon-signed-area-centroid",
  title: "Polygon Signed Area Centroid",
  description:
    "Compute algebraic signed polygon area and shoelace centroid, returning null for zero algebraic area; caller supplies a simple ordered polygon, no topology validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedArea: { type: "number" },
          centroid: {
            anyOf: [
              { type: "array", items: { type: "number" } },
              { type: "null" },
            ],
          },
        },
        required: ["signedArea", "centroid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
