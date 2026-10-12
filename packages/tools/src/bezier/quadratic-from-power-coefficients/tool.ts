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
  H.curve(i.points, 2);
  return H.finish({ points: H.curveFromPower(i.points) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [2, 2],
      [0, -2],
    ],
  },
  output: {
    result: {
      points: [
        [0, 0],
        [1, 1],
        [2, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Quadratic Bezier from Power Coefficients",
      "Bezier curves",
      "geometry",
    ],
    collections: ["data", "learn"],
    fields: ["bezier", "Bezier curves", "geometry"],
    keywords: ["Bezier curves", "geometry"],
  },
  id: "bezier/quadratic-from-power-coefficients",
  title: "Quadratic Bezier from Power Coefficients",
  description:
    "Convert planar ascending power coefficients to Bezier control points for explicit degree 2; exact linear basis change under finite arithmetic.",
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
