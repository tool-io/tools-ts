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
  i.points.forEach(H.point);
  return H.finish({
    edges: i.points.map((p, j) => {
      const q = i.points[(j + 1) % i.points.length],
        dx = q[0] - p[0],
        dy = q[1] - p[1];
      return {
        index: j,
        dx,
        dy,
        angle: dx === 0 && dy === 0 ? null : Math.atan2(dy, dx),
      };
    }),
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [0, 0],
    ],
  },
  output: {
    result: {
      edges: [
        { index: 0, dx: 1, dy: 0, angle: 0 },
        { index: 1, dx: -1, dy: 0, angle: 3.141592653589793 },
        { index: 2, dx: 0, dy: 0, angle: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polygon Edge Orientation Table", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/polygon-edge-orientation-table",
  title: "Polygon Edge Orientation Table",
  description:
    "Report directed polygon edge displacements and radian orientations; zero edges have null direction, and the cycle is implicitly closed.",
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
          edges: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                dx: { type: "number" },
                dy: { type: "number" },
                angle: { anyOf: [{ type: "number" }, { type: "null" }] },
              },
              required: ["index", "dx", "dy", "angle"],
            },
          },
        },
        required: ["edges"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
