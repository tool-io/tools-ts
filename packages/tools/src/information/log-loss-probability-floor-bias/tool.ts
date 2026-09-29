import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ probability: number; floor: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "probability", label: "Probability", kind: "number" },
  { id: "floor", label: "Floor", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.probability > 0 && i.probability <= 1 && i.floor > 0 && i.floor <= 1,
  );
  const p = Math.max(i.probability, i.floor);
  return H.finish({
    appliedProbability: p,
    originalLoss: -Math.log(i.probability),
    flooredLoss: -Math.log(p),
    bias: Math.log(i.probability) - Math.log(p),
  });
};
export const example = {
  input: { probability: 0.01, floor: 0.1 },
  output: {
    result: {
      appliedProbability: 0.1,
      originalLoss: 4.605170185988091,
      flooredLoss: 2.3025850929940455,
      bias: -2.3025850929940455,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/log-loss-probability-floor-bias",
  title: "Information: Log Loss Probability Floor Bias Tool",
  description:
    "Quantify the single observed-outcome natural-log-loss change from a supplied lower probability floor, rejecting actual zero rather than masking infinite reference loss.",
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
          appliedProbability: { type: "number" },
          bias: { type: "number" },
          flooredLoss: { type: "number" },
          originalLoss: { type: "number" },
        },
        required: ["appliedProbability", "bias", "flooredLoss", "originalLoss"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
