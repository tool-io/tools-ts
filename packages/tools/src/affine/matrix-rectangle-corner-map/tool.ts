import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly number[];
  rectangle: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
  { id: "rectangle", label: "rectangle", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.affine(i.matrix);
  H.rect(i.rectangle);
  return H.finish({
    corners: [
      [i.rectangle[0], i.rectangle[1]],
      [i.rectangle[2], i.rectangle[1]],
      [i.rectangle[2], i.rectangle[3]],
      [i.rectangle[0], i.rectangle[3]],
    ].map((p) => H.affinePoint(i.matrix, p)),
  });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5], rectangle: [0, 0, 1, 1] },
  output: {
    result: {
      corners: [
        [4, 5],
        [6, 5],
        [6, 8],
        [4, 8],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Rectangle Corner Map",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-rectangle-corner-map",
  title: "Affine Rectangle Corner Map",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; map rectangle corners to an ordered quadrilateral; no assumption that the transformed shape stays axis-aligned.",
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
          corners: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["corners"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
