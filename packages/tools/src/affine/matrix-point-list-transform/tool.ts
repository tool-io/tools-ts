import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly number[];
  points: readonly (readonly number[])[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
  { id: "points", label: "points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.affine(i.matrix);
  return H.finish({ points: i.points.map((p) => H.affinePoint(i.matrix, p)) });
};
export const example = {
  input: {
    matrix: [2, 0, 0, 3, 4, 5],
    points: [
      [0, 0],
      [1, 2],
    ],
  },
  output: {
    result: {
      points: [
        [4, 5],
        [6, 11],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Point List Transform",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-point-list-transform",
  title: "Affine Point List Transform",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; transform an explicit ordered planar point list without topology or visibility inference.",
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
