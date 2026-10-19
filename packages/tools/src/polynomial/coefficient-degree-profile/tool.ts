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
  const p = H.polynomial(i.coefficients);
  return H.finish({
    degree: p.length === 1 && p[0] === 0 ? null : p.length - 1,
    storedDegree: i.coefficients.length - 1,
    zero: p.length === 1 && p[0] === 0,
  });
};
export const example = {
  input: { coefficients: [1, 2, 0, 0] },
  output: { result: { degree: 1, storedDegree: 3, zero: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polynomial Coefficient Degree Profile", "mathematics"],
    collections: ["data", "learn"],
    fields: ["polynomial", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "polynomial/coefficient-degree-profile",
  title: "Polynomial Coefficient Degree Profile",
  description:
    "Profile true versus stored degree of ascending-power coefficients; zero polynomial degree is explicitly null instead of silently zero.",
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
          degree: { anyOf: [{ type: "number" }, { type: "null" }] },
          storedDegree: { type: "number" },
          zero: { type: "boolean" },
        },
        required: ["degree", "storedDegree", "zero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
