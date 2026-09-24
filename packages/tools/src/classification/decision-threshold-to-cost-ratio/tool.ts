import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  falsePositiveCost: number;
  falseNegativeCost: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "falsePositiveCost", label: "False positive cost", kind: "number" },
  { id: "falseNegativeCost", label: "False negative cost", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.falsePositiveCost);
  H.positive(i.falseNegativeCost);
  return H.finish({
    bayesProbabilityThreshold:
      i.falsePositiveCost / (i.falsePositiveCost + i.falseNegativeCost),
    falsePositiveToFalseNegativeCostRatio:
      i.falsePositiveCost / i.falseNegativeCost,
  });
};
export const example = {
  input: { falsePositiveCost: 2, falseNegativeCost: 8 },
  output: {
    result: {
      bayesProbabilityThreshold: 0.2,
      falsePositiveToFalseNegativeCostRatio: 0.25,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/decision-threshold-to-cost-ratio",
  title: "Classification: Decision Threshold To Cost Ratio Tool",
  description:
    "Derive the calibrated binary posterior decision threshold from positive false-positive/false-negative costs with zero correct-decision cost; not a fitted calibration or recommendation.",
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
          bayesProbabilityThreshold: { type: "number" },
          falsePositiveToFalseNegativeCostRatio: { type: "number" },
        },
        required: [
          "bayesProbabilityThreshold",
          "falsePositiveToFalseNegativeCostRatio",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
