import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  points: readonly (readonly number[])[];
  parameters: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "points", label: "points", kind: "matrix" },
  { id: "parameters", label: "parameters", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.curve(i.points);
  return H.finish({
    samples: i.parameters.map((t) => ({ t, point: H.bezier(i.points, t) })),
  });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
    parameters: [0, 0.5, 1],
  },
  output: {
    result: {
      samples: [
        { t: 0, point: [0, 0] },
        { t: 0.5, point: [1, 0.5] },
        { t: 1, point: [2, 0] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Bezier Fixed Parameter Sample Table",
      "Bezier curves",
      "geometry",
    ],
    collections: ["data", "learn"],
    fields: ["bezier", "Bezier curves", "geometry"],
    keywords: ["Bezier curves", "geometry"],
  },
  id: "bezier/fixed-parameter-sample-table",
  title: "Bezier Fixed Parameter Sample Table",
  description:
    "Sample an explicit planar quadratic/cubic Bezier at caller unit parameters in caller order, preserving repeats; not equal arc-length sampling.",
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
          samples: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                t: { type: "number" },
                point: { type: "array", items: { type: "number" } },
              },
              required: ["t", "point"],
            },
          },
        },
        required: ["samples"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
