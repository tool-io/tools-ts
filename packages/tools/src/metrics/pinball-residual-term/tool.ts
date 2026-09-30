import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ residual: number; quantile: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "residual", label: "Residual", kind: "number" },
  { id: "quantile", label: "Quantile", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.quantile > 0 && i.quantile < 1);
  return H.finish({
    loss:
      i.residual >= 0 ? i.quantile * i.residual : (i.quantile - 1) * i.residual,
  });
};
export const example = {
  input: { residual: -2, quantile: 0.25 },
  output: { result: { loss: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/pinball-residual-term",
  title: "Metrics: Pinball Residual Term Tool",
  description:
    "Compute one pinball/quantile-loss contribution for residual actual-minus-prediction at a supplied open-unit quantile.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { loss: { type: "number" } },
        required: ["loss"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
