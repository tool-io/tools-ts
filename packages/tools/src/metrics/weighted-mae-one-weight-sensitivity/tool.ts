import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly meanError: number;
  readonly totalWeight: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    meanError: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actual", "predicted", "meanError", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate weighted mae one weight sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, meanError, totalWeight } = request;
  const compute = (): Output => {
    H.domain(meanError >= 0);
    H.positive(totalWeight);
    return {
      derivative: (Math.abs(actual - predicted) - meanError) / totalWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: 8, predicted: 5, meanError: 2, totalWeight: 10 },
  output: { derivative: 0.1 },
} satisfies ToolExample<Input, Output>;
export const weightedMaeOneWeightSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/weighted-mae-one-weight-sensitivity",
    title: "Weighted Mae One Weight Sensitivity Tool",
    description:
      "Calculate weighted mae one weight sensitivity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        meanError: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actual", "predicted", "meanError", "totalWeight"],
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
        {
          id: "meanError",
          label: "Mean Error",
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
export const run = weightedMaeOneWeightSensitivityTool.execute;
export default weightedMaeOneWeightSensitivityTool;
