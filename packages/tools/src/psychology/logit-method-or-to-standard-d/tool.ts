import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualOddsRatio: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualOddsRatio", label: "Actual odds ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualOddsRatio, "actualOddsRatio");
  return { value: (Math.log(input.actualOddsRatio) * Math.sqrt(3)) / Math.PI };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOddsRatio: 2 },
  output: { result: { value: 0.3821520694228441 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/logit-method-or-to-standard-d",
  title: "Logit Method OR to d Converter",
  description:
    "Approximate logisticOR\u2192standardizedd lnOR\u221a3/\u03c0under latent logistic assumption, not direct effect size estimate/causal equivalence. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
