import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly mean: number;
  readonly variance: number;
  readonly totalWeight: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    mean: { type: "number" },
    variance: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "mean", "variance", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate population weighted variance with respect to one observation weight, accounting for the moving weighted mean. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, mean, variance, totalWeight } = request;
  const compute = (): Output => {
    H.domain(variance >= 0);
    H.positive(totalWeight);
    return { derivative: ((value - mean) ** 2 - variance) / totalWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 7, mean: 3, variance: 4, totalWeight: 10 },
  output: { derivative: 1.2 },
} satisfies ToolExample<Input, Output>;
export const weightedVarianceOneWeightDerivativeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/weighted-variance-one-weight-derivative",
      title: "Weighted Variance One Weight Derivative Tool",
      description:
        "Differentiate population weighted variance with respect to one observation weight, accounting for the moving weighted mean.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          mean: { type: "number" },
          variance: { type: "number", minimum: 0 },
          totalWeight: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["value", "mean", "variance", "totalWeight"],
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
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mean",
            label: "Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "variance",
            label: "Variance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalWeight",
            label: "Total Weight",
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
export const run = weightedVarianceOneWeightDerivativeTool.execute;
export default weightedVarianceOneWeightDerivativeTool;
