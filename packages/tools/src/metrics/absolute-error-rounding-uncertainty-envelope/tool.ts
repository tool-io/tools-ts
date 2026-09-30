import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly actualHalfwidth: number;
  readonly predictedHalfwidth: number;
};
export type Output = { readonly minimum: number; readonly maximum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    actualHalfwidth: { type: "number" },
    predictedHalfwidth: { type: "number" },
  },
  required: ["actual", "predicted", "actualHalfwidth", "predictedHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "number" }, maximum: { type: "number" } },
  required: ["minimum", "maximum"],
} as const;
/** Compute absolute error rounding uncertainty envelope from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actual, predicted, actualHalfwidth, predictedHalfwidth } = input;
  const compute = (): Output => {
    domain(actualHalfwidth >= 0 && predictedHalfwidth >= 0);
    const d = Math.abs(predicted - actual),
      h = actualHalfwidth + predictedHalfwidth;
    return { minimum: Math.max(0, d - h), maximum: d + h };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 3, predicted: 7, actualHalfwidth: 1, predictedHalfwidth: 1 },
  output: { minimum: 2, maximum: 6 },
} satisfies ToolExample<Input, Output>;
export const absoluteErrorRoundingUncertaintyEnvelopeTool =
  defineSchemaCalculation<Input, Output>({
    id: "metrics/absolute-error-rounding-uncertainty-envelope",
    title: "Absolute Error Rounding Uncertainty Envelope Tool",
    description:
      "Compute absolute error rounding uncertainty envelope from explicit bounded inputs.",
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
          id: "actualHalfwidth",
          label: "Actual Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictedHalfwidth",
          label: "Predicted Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "minimum", label: "Minimum", valueType: { type: "number" } },
        { id: "maximum", label: "Maximum", valueType: { type: "number" } },
      ],
    },
  });
export const run = absoluteErrorRoundingUncertaintyEnvelopeTool.execute;
export default absoluteErrorRoundingUncertaintyEnvelopeTool;
