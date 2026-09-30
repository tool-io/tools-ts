import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  residual: number;
  underpredictionWeight: number;
  overpredictionWeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "residual", label: "Residual", kind: "number" },
  {
    id: "underpredictionWeight",
    label: "Underprediction weight",
    kind: "number",
  },
  {
    id: "overpredictionWeight",
    label: "Overprediction weight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.underpredictionWeight >= 0 && i.overpredictionWeight >= 0);
  return H.finish({
    weightedAbsoluteError:
      Math.abs(i.residual) *
      (i.residual >= 0 ? i.underpredictionWeight : i.overpredictionWeight),
    underprediction: i.residual > 0,
  });
};
export const example = {
  input: { residual: 2, underpredictionWeight: 3, overpredictionWeight: 1 },
  output: { result: { weightedAbsoluteError: 6, underprediction: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/forecast-error-underprediction-weight",
  title: "Metrics: Forecast Error Underprediction Weight Tool",
  description:
    "Weight one actual-minus-forecast absolute residual with explicit under/overprediction costs; no fitted asymmetric forecasting model.",
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
          underprediction: { type: "boolean" },
          weightedAbsoluteError: { type: "number" },
        },
        required: ["underprediction", "weightedAbsoluteError"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
