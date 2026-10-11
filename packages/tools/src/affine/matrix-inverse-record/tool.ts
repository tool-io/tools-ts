import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ matrix: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ matrix: H.affineInverse(i.matrix) });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5] },
  output: {
    result: {
      matrix: [0.5, 0, 0, 0.3333333333333333, -2, -1.6666666666666667],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Matrix Inverse Record",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-inverse-record",
  title: "Affine Matrix Inverse Record",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; invert a nonsingular transform exactly in finite arithmetic; singular matrices reject without pseudoinverse.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { matrix: { type: "array", items: { type: "number" } } },
        required: ["matrix"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
