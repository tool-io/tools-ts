import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "Coefficients", kind: "numberList" },
  { id: "tolerance", label: "Tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0 && i.tolerance >= 0);
  let degree = i.coefficients.length - 1;
  while (degree >= 0 && Math.abs(i.coefficients[degree]) <= i.tolerance)
    degree--;
  return H.finish({
    effectiveDegree: degree,
    removedHighTerms: i.coefficients.length - (degree + 1),
  });
};
export const example = {
  input: { coefficients: [1, 2, 1e-8], tolerance: 1e-7 },
  output: { result: { effectiveDegree: 1, removedHighTerms: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/polynomial-effective-degree-tolerance",
  title: "Algebra: Polynomial Effective Degree Tolerance Tool",
  description:
    "Determine the effective degree of ascending-power coefficients under an explicit absolute coefficient tolerance, retaining -1 for an all-negligible polynomial; not exact normalization.",
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
          effectiveDegree: { type: "number" },
          removedHighTerms: { type: "number" },
        },
        required: ["effectiveDegree", "removedHighTerms"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
