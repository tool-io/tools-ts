import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ coefficients: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "Coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.polynomial(i.coefficients);
  return H.finish({
    leadingCoefficient: p[p.length - 1],
    degree: p.length === 1 && p[0] === 0 ? -1 : p.length - 1,
  });
};
export const example = {
  input: { coefficients: [1, 2, 0] },
  output: { result: { leadingCoefficient: 2, degree: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/polynomial-leading-nonzero-coefficient",
  title: "Algebra: Polynomial Leading Nonzero Coefficient Tool",
  description:
    "Extract leading coefficient and degree from ascending-power coefficients using the existing normalization core; zero polynomial has degree -1.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: "number" },
          leadingCoefficient: { type: "number" },
        },
        required: ["degree", "leadingCoefficient"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
