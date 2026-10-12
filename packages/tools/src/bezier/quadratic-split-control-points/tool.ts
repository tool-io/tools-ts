import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  t: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  { id: "t", label: "t", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.curve(i.points, 2);
  return H.finish(H.bezierSplit(i.points, i.t));
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
    t: 0.5,
  },
  output: {
    result: {
      left: [
        [0, 0],
        [0.5, 0.5],
        [1, 0.5],
      ],
      right: [
        [1, 0.5],
        [1.5, 0.5],
        [2, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Quadratic Bezier Split Control Points",
      "Bezier curves",
      "geometry",
    ],
    collections: ["data", "learn"],
    fields: ["bezier", "Bezier curves", "geometry"],
    keywords: ["Bezier curves", "geometry"],
  },
  id: "bezier/quadratic-split-control-points",
  title: "Quadratic Bezier Split Control Points",
  description:
    "Finite planar Bezier control points in supplied order, unit parameter t; split at explicit t into two complete control polygons with duplicated join endpoint, preserving curve geometry.",
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
          left: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          right: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["left", "right"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
