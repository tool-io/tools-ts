import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly quantile: number;
  readonly weight: number;
};
export type Output = { readonly loss: number; readonly informative: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    quantile: { type: "number", minimum: 0, maximum: 1 },
    weight: { type: "number", minimum: 0 },
  },
  required: ["actual", "predicted", "quantile", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loss: { type: "number" }, informative: { type: "boolean" } },
  required: ["loss", "informative"],
} as const;
/** Calculate weighted pinball zero weight flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, quantile, weight } = request;
  const compute = (): Output => {
    H.probability(quantile);
    H.domain(weight >= 0);
    return {
      loss:
        weight *
        (actual >= predicted
          ? quantile * (actual - predicted)
          : (1 - quantile) * (predicted - actual)),
      informative: weight > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: 3, predicted: 1, quantile: 0.5, weight: 0 },
  output: { loss: 0, informative: false },
} satisfies ToolExample<Input, Output>;
export const weightedPinballZeroWeightFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/weighted-pinball-zero-weight-flag",
    title: "Weighted Pinball Zero Weight Flag Tool",
    description:
      "Calculate weighted pinball zero weight flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        quantile: { type: "number", minimum: 0, maximum: 1 },
        weight: { type: "number", minimum: 0 },
      },
      required: ["actual", "predicted", "quantile", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loss: { type: "number" },
        informative: { type: "boolean" },
      },
      required: ["loss", "informative"],
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
        {
          id: "quantile",
          label: "Quantile",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "loss", label: "Loss", valueType: { type: "number" } },
        {
          id: "informative",
          label: "Informative",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedPinballZeroWeightFlagTool.execute;
export default weightedPinballZeroWeightFlagTool;
