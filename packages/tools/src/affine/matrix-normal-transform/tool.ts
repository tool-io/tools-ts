import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly number[];
  normal: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
  { id: "normal", label: "normal", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.point(i.normal);
  const inverse = H.affineInverse(i.matrix);
  return H.finish({
    normal: [
      inverse[0] * i.normal[0] + inverse[1] * i.normal[1],
      inverse[2] * i.normal[0] + inverse[3] * i.normal[1],
    ],
  });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5], normal: [2, 3] },
  output: { result: { normal: [1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Normal Covector Transform",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-normal-transform",
  title: "Affine Normal Covector Transform",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; transform a normal covector by inverse transpose without unit renormalization; singular linear maps reject.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { normal: { type: "array", items: { type: "number" } } },
        required: ["normal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
