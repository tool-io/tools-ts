import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  monomials: readonly (readonly number[])[];
  expectedDegree: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "monomials", label: "Monomials", kind: "matrix" },
  { id: "expectedDegree", label: "Expected degree", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.expectedDegree, 0, 1000000);
  H.check(i.monomials.every((v) => v.length === (i.monomials[0]?.length ?? 0)));
  i.monomials.flat().forEach((x) => H.int(x, 0, 1000000));
  return H.finish({
    homogeneous: i.monomials.every(
      (v) => v.reduce((s, x) => s + x, 0) === i.expectedDegree,
    ),
    termDegrees: i.monomials.map((v) => v.reduce((s, x) => s + x, 0)),
  });
};
export const example = {
  input: {
    monomials: [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
    expectedDegree: 2,
  },
  output: { result: { homogeneous: true, termDegrees: [2, 2, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-homogeneous-degree-check",
  title: "Algebra: Monomial Homogeneous Degree Check Tool",
  description:
    "Check that every supplied nonzero term monomial has one explicit total degree in a fixed variable dimension; caller omits zero-coefficient terms.",
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
          homogeneous: { type: "boolean" },
          termDegrees: { type: "array", items: { type: "number" } },
        },
        required: ["homogeneous", "termDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
