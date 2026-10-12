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
  H.curve(i.points, 3);
  return H.finish({ value: H.bezier(H.bezierDerivative(i.points), i.t) });
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
  output: { result: { value: [3, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Cubic Bezier Tangent Value", "Bezier curves", "geometry"],
    collections: ["data", "learn"],
    fields: ["bezier", "Bezier curves", "geometry"],
    keywords: ["Bezier curves", "geometry"],
  },
  id: "bezier/cubic-tangent-value",
  title: "Cubic Bezier Tangent Value",
  description:
    "Finite planar Bezier control points in supplied order, unit parameter t; evaluate first derivative tangent using De Casteljau arithmetic, not a screen-space or arc-length parameter.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "array", items: { type: "number" } } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
