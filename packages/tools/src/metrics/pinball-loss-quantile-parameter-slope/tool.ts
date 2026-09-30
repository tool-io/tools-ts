import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly actual: number; readonly predicted: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { actual: { type: "number" }, predicted: { type: "number" } },
  required: ["actual", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate pinball loss with respect to its quantile parameter, holding the residual fixed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted } = request;
  const compute = (): Output => {
    return { derivative: actual - predicted };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: 8, predicted: 5 },
  output: { derivative: 3 },
} satisfies ToolExample<Input, Output>;
export const pinballLossQuantileParameterSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/pinball-loss-quantile-parameter-slope",
    title: "Pinball Loss Quantile Parameter Slope Tool",
    description:
      "Differentiate pinball loss with respect to its quantile parameter, holding the residual fixed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { actual: { type: "number" }, predicted: { type: "number" } },
      required: ["actual", "predicted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predicted",
          label: "Predicted",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pinballLossQuantileParameterSlopeTool.execute;
export default pinballLossQuantileParameterSlopeTool;
