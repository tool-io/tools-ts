import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly actual: number; readonly predicted: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number", exclusiveMinimum: 0 },
    predicted: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actual", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Differentiate 2*abs(predicted-actual)/(actual+predicted) on the strictly positive unequal-value domain. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { actual, predicted } = input;
  const compute = (): Output => {
    H.domain(actual > 0 && predicted > 0 && actual !== predicted);
    return {
      derivative:
        (Math.sign(predicted - actual) * 4 * actual) /
        (actual + predicted) ** 2,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 2, predicted: 6 },
  output: { derivative: 0.125 },
} satisfies ToolExample<Input, Output>;
export const symmetricPercentageErrorLocalSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/symmetric-percentage-error-local-slope",
    title: "Symmetric Percentage Error Local Slope Tool",
    description:
      "Differentiate 2*abs(predicted-actual)/(actual+predicted) on the strictly positive unequal-value domain.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number", exclusiveMinimum: 0 },
        predicted: { type: "number", exclusiveMinimum: 0 },
      },
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
export const run = symmetricPercentageErrorLocalSlopeTool.execute;
export default symmetricPercentageErrorLocalSlopeTool;
