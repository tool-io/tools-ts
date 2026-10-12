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
  H.curve(i.points, 3);
  return H.finish({ points: H.bezierPower(i.points) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },
  output: {
    result: {
      points: [
        [0, 0],
        [3, 0],
        [0, 0],
        [0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Cubic Bezier Power Coefficients", "Bezier curves", "geometry"],
    collections: ["data", "learn"],
    fields: ["bezier", "Bezier curves", "geometry"],
    keywords: ["Bezier curves", "geometry"],
  },
  id: "bezier/cubic-power-coefficients",
  title: "Cubic Bezier Power Coefficients",
  description:
    "Convert planar Bezier control points to ascending power coefficients for explicit degree 3; exact linear basis change under finite arithmetic.",
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
          points: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["points"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
