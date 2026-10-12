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
  return H.finish({ matrix: [1, i.y, i.x, 1, 0, 0] });
};
export const example = {
  input: { x: 2, y: 3 },
  output: { result: { matrix: [1, 3, 2, 1, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Shear Matrix Record",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-shear-record",
  title: "Affine Shear Matrix Record",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; construct simultaneous x/y shear coefficients, not angle tangents or a sequential shear composition.",
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
