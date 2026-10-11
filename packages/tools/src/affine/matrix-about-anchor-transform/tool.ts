import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly number[];
  anchor: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
  { id: "anchor", label: "anchor", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.affine(i.matrix);
  H.point(i.anchor);
  const p = H.affinePoint(i.matrix, i.anchor, false);
  return H.finish({
    matrix: [
      ...i.matrix.slice(0, 4),
      i.matrix[4] + i.anchor[0] - p[0],
      i.matrix[5] + i.anchor[1] - p[1],
    ],
  });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5], anchor: [1, 1] },
  output: { result: { matrix: [2, 0, 0, 3, 3, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Matrix About Anchor Transform",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-about-anchor-transform",
  title: "Affine Matrix About Anchor Transform",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; move the linear transform’s origin to an explicit anchor, preserving existing translation.",
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
