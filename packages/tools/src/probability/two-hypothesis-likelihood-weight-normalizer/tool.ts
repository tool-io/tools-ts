import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstLikelihood: number;
  secondLikelihood: number;
  firstPrior: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstLikelihood", label: "First likelihood", kind: "number" },
  { id: "secondLikelihood", label: "Second likelihood", kind: "number" },
  { id: "firstPrior", label: "First prior", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.firstLikelihood >= 0 && i.secondLikelihood >= 0);
  H.bounded(i.firstPrior, 0, 1);
  const a = i.firstLikelihood * i.firstPrior,
    b = i.secondLikelihood * (1 - i.firstPrior);
  H.positive(a + b);
  return H.finish({
    firstPosterior: a / (a + b),
    secondPosterior: b / (a + b),
    evidence: a + b,
  });
};
export const example = {
  input: { firstLikelihood: 0.8, secondLikelihood: 0.2, firstPrior: 0.5 },
  output: {
    result: { firstPosterior: 0.8, secondPosterior: 0.2, evidence: 0.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/two-hypothesis-likelihood-weight-normalizer",
  title: "Probability: Two Hypothesis Likelihood Weight Normalizer Tool",
  description:
    "Normalize two nonnegative hypothesis likelihood weights against a supplied binary prior, rejecting zero evidence; likelihoods may be densities above one.",
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
          evidence: { type: "number" },
          firstPosterior: { type: "number" },
          secondPosterior: { type: "number" },
        },
        required: ["evidence", "firstPosterior", "secondPosterior"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
