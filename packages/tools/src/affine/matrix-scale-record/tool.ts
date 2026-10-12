import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ x: number; y: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "x", label: "x", kind: "number" },
  { id: "y", label: "y", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ matrix: [i.x, 0, 0, i.y, 0, 0] });
};
export const example = {
  input: { x: 2, y: 3 },
  output: { result: { matrix: [2, 0, 0, 3, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Scale Matrix Record",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-scale-record",
  title: "Affine Scale Matrix Record",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; construct a scale transform with signed and zero factors retained.",
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
