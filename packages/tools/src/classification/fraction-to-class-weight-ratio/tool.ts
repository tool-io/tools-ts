import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ positiveFraction: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "positiveFraction", label: "Positive fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.positiveFraction > 0 && i.positiveFraction < 1);
  return H.finish({
    positiveToNegativeBalancedWeightRatio:
      (1 - i.positiveFraction) / i.positiveFraction,
  });
};
export const example = {
  input: { positiveFraction: 0.2 },
  output: { result: { positiveToNegativeBalancedWeightRatio: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/fraction-to-class-weight-ratio",
  title: "Classification: Fraction To Class Weight Ratio Tool",
  description:
    "Derive the positive-to-negative inverse-frequency class-weight ratio from an explicit binary training fraction; not an inferred prevalence or fairness criterion.",
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
          positiveToNegativeBalancedWeightRatio: { type: "number" },
        },
        required: ["positiveToNegativeBalancedWeightRatio"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
