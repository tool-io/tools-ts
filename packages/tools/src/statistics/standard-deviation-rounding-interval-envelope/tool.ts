import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rounded: number; readonly resolution: number };
export type Output = { readonly minimum: number; readonly maximum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rounded: { type: "number", minimum: 0 },
    resolution: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rounded", "resolution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "number" }, maximum: { type: "number" } },
  required: ["minimum", "maximum"],
} as const;
/** Calculate standard deviation rounding interval envelope from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rounded, resolution } = request;
  const compute = (): Output => {
    H.domain(rounded >= 0);
    H.positive(resolution);
    return {
      minimum: Math.max(0, rounded - resolution / 2),
      maximum: rounded + resolution / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rounded: 2, resolution: 0.2 },
  output: { minimum: 1.9, maximum: 2.1 },
} satisfies ToolExample<Input, Output>;
export const standardDeviationRoundingIntervalEnvelopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/standard-deviation-rounding-interval-envelope",
      title: "Standard Deviation Rounding Interval Envelope Tool",
      description:
        "Calculate standard deviation rounding interval envelope from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rounded: { type: "number", minimum: 0 },
          resolution: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["rounded", "resolution"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimum: { type: "number" },
          maximum: { type: "number" },
        },
        required: ["minimum", "maximum"],
      },
      ports: {
        inputs: [
          {
            id: "rounded",
            label: "Rounded",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "resolution",
            label: "Resolution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "minimum", label: "Minimum", valueType: { type: "number" } },
          { id: "maximum", label: "Maximum", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = standardDeviationRoundingIntervalEnvelopeTool.execute;
export default standardDeviationRoundingIntervalEnvelopeTool;
