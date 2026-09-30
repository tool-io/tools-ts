import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly actual: number; readonly predicted: number };
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { actual: { type: "number" }, predicted: { type: "number" } },
  required: ["actual", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "integer" } },
  required: ["gradient"],
} as const;
/** Compute mae single observation gradient from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actual, predicted } = input;
  const compute = (): Output => {
    domain(
      actual !== predicted,
      "predicted",
      "Use the explicit zero-subgradient tool at equality.",
    );
    return { gradient: Math.sign(predicted - actual) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actual: 2, predicted: 5 },
  output: { gradient: 1 },
} satisfies ToolExample<Input, Output>;
export const maeSingleObservationGradientTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/mae-single-observation-gradient",
  title: "Mae Single Observation Gradient Tool",
  description:
    "Compute mae single observation gradient from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "gradient", label: "Gradient", valueType: { type: "integer" } },
    ],
  },
});
export const run = maeSingleObservationGradientTool.execute;
export default maeSingleObservationGradientTool;
