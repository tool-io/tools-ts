import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly number[];
  point: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
  { id: "point", label: "point", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ point: H.affinePoint(i.matrix, i.point) });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5], point: [1, 2] },
  output: { result: { point: [6, 11] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Point Transform",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-point-transform",
  title: "Affine Point Transform",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; transform one supplied planar point including translation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { point: { type: "array", items: { type: "number" } } },
        required: ["point"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
