import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  probability: number;
  outcome: number;
  weight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "probability", label: "Probability", kind: "number" },
  { id: "outcome", label: "Outcome", kind: "integer" },
  { id: "weight", label: "Weight", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.weight >= 0);
  const loss = H.logLoss(i.probability, i.outcome);
  return H.finish({
    unweightedLogLoss: loss,
    weightedLogLoss: i.weight * loss,
  });
};
export const example = {
  input: { probability: 0.5, outcome: 1, weight: 2 },
  output: {
    result: {
      unweightedLogLoss: 0.6931471805599453,
      weightedLogLoss: 1.3862943611198906,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/log-loss-probability-term",
  title: "Metrics: Log Loss Probability Term Tool",
  description:
    "Return an explicitly weighted single-observation log-loss contribution by invoking the existing strict binary log-loss calculator, not a copied log formula.",
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
          unweightedLogLoss: { type: "number" },
          weightedLogLoss: { type: "number" },
        },
        required: ["unweightedLogLoss", "weightedLogLoss"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
