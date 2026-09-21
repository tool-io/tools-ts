import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  exponents: readonly number[];
  weights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "exponents", label: "Exponents", kind: "numberList" },
  { id: "weights", label: "Weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.exponents.length === i.weights.length);
  i.exponents.forEach((x) => H.int(x, 0, 1000000));
  i.weights.forEach((x) => H.int(x, 1, 1000000));
  return H.finish({
    weightedDegree: i.exponents.reduce((s, x, j) => s + x * i.weights[j], 0),
  });
};
export const example = {
  input: { exponents: [2, 3], weights: [1, 2] },
  output: { result: { weightedDegree: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-weighted-degree-point",
  title: "Algebra: Monomial Weighted Degree Point Tool",
  description:
    "Compute one weighted monomial degree from nonnegative integer exponents and positive integer variable weights.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { weightedDegree: { type: "number" } },
        required: ["weightedDegree"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
