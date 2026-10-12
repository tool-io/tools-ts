import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coefficients: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    valid: i.coefficients.length === 6,
    determinant:
      i.coefficients.length === 6
        ? i.coefficients[0] * i.coefficients[3] -
          i.coefficients[1] * i.coefficients[2]
        : null,
  });
};
export const example = {
  input: { coefficients: [2, 0, 0, 3, 4, 5] },
  output: { result: { valid: true, determinant: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Six Coefficient Validator",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-six-coefficient-validator",
  title: "Affine Six Coefficient Validator",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; audit explicit finite coefficient arity and linear determinant, no invertibility tolerance inferred.",
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
          valid: { type: "boolean" },
          determinant: { anyOf: [{ type: "number" }, { type: "null" }] },
        },
        required: ["valid", "determinant"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
