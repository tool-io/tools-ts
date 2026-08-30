import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly exponent: number;
  readonly seriesTerms: number;
}>;
export type Output = Readonly<{
  readonly finiteDirichletEtaSum: number;
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
  for (let k = 1; k <= n; k++) s += (k % 2 ? 1 : -1) / k ** input.exponent;
  return {
    finiteDirichletEtaSum: s,
    alternatingRemainderAbsoluteBound: (n + 1) ** -input.exponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { exponent: 2, seriesTerms: 3 } satisfies Input;
export const exampleOutput = {
  finiteDirichletEtaSum: 0.8611111111111112,
  alternatingRemainderAbsoluteBound: 0.0625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/dirichlet-eta-approx",
  title: "Dirichlet Eta Approximation",
  description:
    "Compute finite real Dirichlet eta series for s>0 and analytic alternating-tail bound; caller exponent changes function, unlike Catalan constant fixed odd-square series.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteDirichletEtaSum",
      label: "Finite dirichlet eta sum",
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
