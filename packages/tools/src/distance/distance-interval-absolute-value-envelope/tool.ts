import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lower: number; readonly upper: number };
export type Output = { readonly minimum: number; readonly maximum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "number" }, maximum: { type: "number" } },
  required: ["minimum", "maximum"],
} as const;
/** Compute distance interval absolute value envelope from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lower, upper } = input;
  const compute = (): Output => {
    domain(lower <= upper);
    return {
      minimum:
        lower <= 0 && upper >= 0
          ? 0
          : Math.min(Math.abs(lower), Math.abs(upper)),
      maximum: Math.max(Math.abs(lower), Math.abs(upper)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lower: -2, upper: 3 },
  output: { minimum: 0, maximum: 3 },
} satisfies ToolExample<Input, Output>;
export const distanceIntervalAbsoluteValueEnvelopeTool =
  defineSchemaCalculation<Input, Output>({
    id: "distance/distance-interval-absolute-value-envelope",
    title: "Distance Interval Absolute Value Envelope Tool",
    description:
      "Compute distance interval absolute value envelope from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
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
export const run = distanceIntervalAbsoluteValueEnvelopeTool.execute;
export default distanceIntervalAbsoluteValueEnvelopeTool;
