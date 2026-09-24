import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ multiplicities: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "multiplicities", label: "Multiplicities", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.multiplicities.forEach((n) => H.int(n, 0, 128));
  H.check(i.multiplicities.reduce((s, n) => s + n, 0) <= 128);
  return H.finish({
    factorialDenominator: String(
      i.multiplicities.reduce((s, n) => s * H.factorial(n), 1n),
    ),
  });
};
export const example = {
  input: { multiplicities: [2, 3] },
  output: { result: { factorialDenominator: "12" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/multiset-multiplicity-factorial-denominator",
  title: "Combinatorics: Multiset Multiplicity Factorial Denominator Tool",
  description:
    "Compute the exact product of multiplicity factorials for a multiset-count denominator; no distinct permutation numerator assumed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { factorialDenominator: { type: "string" } },
        required: ["factorialDenominator"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
