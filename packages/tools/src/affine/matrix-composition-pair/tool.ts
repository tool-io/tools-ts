import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  first: readonly number[];
  second: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "first", label: "first", kind: "numberList" },
  { id: "second", label: "second", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ matrix: H.affineCompose(i.first, i.second) });
};
export const example = {
  input: { first: [1, 0, 0, 1, 1, 2], second: [2, 0, 0, 3, 0, 0] },
  output: { result: { matrix: [2, 0, 0, 3, 2, 6] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Matrix Composition Pair",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-composition-pair",
  title: "Affine Matrix Composition Pair",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; compose by applying first then second, with translation included.",
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
