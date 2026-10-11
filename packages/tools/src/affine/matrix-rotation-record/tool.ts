import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ radians: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "radians", label: "radians", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    matrix: [
      Math.cos(i.radians),
      Math.sin(i.radians),
      -Math.sin(i.radians),
      Math.cos(i.radians),
      0,
      0,
    ],
  });
};
export const example = {
  input: { radians: 0 },
  output: { result: { matrix: [1, 0, 0, 1, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Rotation Matrix Record",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-rotation-record",
  title: "Affine Rotation Matrix Record",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; construct a counterclockwise mathematical-plane rotation from explicit radians, no screen-y convention inferred.",
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
