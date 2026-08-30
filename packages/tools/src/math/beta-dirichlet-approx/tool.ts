import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly exponent: number;
  readonly seriesTerms: number;
}>;
export type Output = Readonly<{
  readonly finiteDirichletBetaSum: number;
  readonly alternatingRemainderAbsoluteBound: number;
}>;
const inputFields = [
  { id: "exponent", label: "Exponent", kind: "number" },
  { id: "seriesTerms", label: "Series terms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.exponent, "exponent");
  const n = bounded(input.seriesTerms, "terms", 1, 1000000);
  let s = 0;
  for (let k = 0; k < n; k++)
    s += (k % 2 ? -1 : 1) / (2 * k + 1) ** input.exponent;
  return {
    finiteDirichletBetaSum: s,
    alternatingRemainderAbsoluteBound: (2 * n + 1) ** -input.exponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { exponent: 1, seriesTerms: 3 } satisfies Input;
export const exampleOutput = {
  finiteDirichletBetaSum: 0.8666666666666667,
  alternatingRemainderAbsoluteBound: 0.14285714285714285,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/beta-dirichlet-approx",
  title: "Beta Dirichlet Approximation",
  description:
    "Compute finite real Dirichlet beta at supplied s>0 with explicit odd-denominator alternating-tail bound; not a fixed Catalan lookup or invented analytic continuation.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteDirichletBetaSum",
      label: "Finite dirichlet beta sum",
      kind: "number",
    },
    {
      id: "alternatingRemainderAbsoluteBound",
      label: "Alternating remainder absolute bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      exponent: value.exponent as number,
      seriesTerms: value.seriesTerms as number,
    }),
});
export const run = tool.execute;
export default tool;
