import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ n: number; k: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "n", label: "N", kind: "integer" },
  { id: "k", label: "K", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.n, 1, 1000000);
  H.int(i.k, 0, i.n - 1);
  return H.finish({ adjacentRatio: (i.n - i.k) / (i.k + 1) });
};
export const example = {
  input: { n: 5, k: 2 },
  output: { result: { adjacentRatio: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/binomial-adjacent-coefficient-ratio",
  title: "Combinatorics: Binomial Adjacent Coefficient Ratio Tool",
  description:
    "Compute C(n,k+1)/C(n,k) for one valid k<n without building a binomial row.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { adjacentRatio: { type: "number" } },
        required: ["adjacentRatio"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
