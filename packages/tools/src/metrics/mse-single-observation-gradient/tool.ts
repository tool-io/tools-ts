import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly weight: number;
  readonly denominator: number;
};
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    weight: { type: "number" },
    denominator: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actual", "predicted", "weight", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "number" } },
  required: ["gradient"],
} as const;
/** Compute mse single observation gradient from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actual, predicted, weight, denominator } = input;
  const compute = (): Output => {
    domain(weight >= 0);
    positive(denominator);
    return { gradient: (2 * weight * (predicted - actual)) / denominator };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 2, predicted: 5, weight: 2, denominator: 4 },
  output: { gradient: 3 },
} satisfies ToolExample<Input, Output>;
export const mseSingleObservationGradientTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/mse-single-observation-gradient",
  title: "Mse Single Observation Gradient Tool",
  description:
    "Compute mse single observation gradient from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
        id: "weight",
        label: "Weight",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "denominator",
        label: "Denominator",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "gradient", label: "Gradient", valueType: { type: "number" } },
    ],
  },
});
export const run = mseSingleObservationGradientTool.execute;
export default mseSingleObservationGradientTool;
