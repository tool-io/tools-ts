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
  H.curve(i.points);
  return H.finish({ points: [...i.points].reverse().map((p) => [...p]) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
  },
  output: {
    result: {
      points: [
        [2, 0],
        [1, 1],
        [0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Bezier Control Point Order Reversal",
      "Bezier curves",
      "geometry",
    ],
    collections: ["data", "learn"],
    fields: ["bezier", "Bezier curves", "geometry"],
    keywords: ["Bezier curves", "geometry"],
  },
  id: "bezier/control-point-order-reverse",
  title: "Bezier Control Point Order Reversal",
  description:
    "Reverse a planar quadratic/cubic control polygon to represent the same Bezier curve under t -> 1-t, not a spatial mirror.",
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
