import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lowerQuantile: number;
  lowerPrediction: number;
  upperQuantile: number;
  upperPrediction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowerQuantile", label: "Lower quantile", kind: "number" },
  { id: "lowerPrediction", label: "Lower prediction", kind: "number" },
  { id: "upperQuantile", label: "Upper quantile", kind: "number" },
  { id: "upperPrediction", label: "Upper prediction", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.lowerQuantile > 0 &&
      i.upperQuantile < 1 &&
      i.lowerQuantile < i.upperQuantile,
  );
  return H.finish({
    crossed: i.lowerPrediction > i.upperPrediction,
    crossingMagnitude: Math.max(0, i.lowerPrediction - i.upperPrediction),
  });
};
export const example = {
  input: {
    lowerQuantile: 0.1,
    lowerPrediction: 3,
    upperQuantile: 0.9,
    upperPrediction: 2,
  },
  output: { result: { crossed: true, crossingMagnitude: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/quantile-crossing-two-output-flag",
  title: "Metrics: Quantile Crossing Two Output Flag Tool",
  description:
    "Detect crossing between two explicitly ordered quantile forecasts; no rearrangement, calibration test or full quantile curve.",
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
          crossed: { type: "boolean" },
          crossingMagnitude: { type: "number" },
        },
        required: ["crossed", "crossingMagnitude"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
