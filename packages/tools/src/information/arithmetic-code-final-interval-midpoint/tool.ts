import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lower: number; readonly upper: number };
export type Output = { readonly midpoint: number; readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number", minimum: 0 },
    upper: { type: "number", maximum: 1 },
  },
  required: ["lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, width: { type: "number" } },
  required: ["midpoint", "width"],
} as const;
/** Choose a binary64 midpoint in a supplied half-open arithmetic-coding interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower >= 0 && upper <= 1 && upper > lower);
    const midpoint = lower + (upper - lower) / 2;
    H.domain(
      midpoint >= lower && midpoint < upper,
      "upper",
      "The interval must contain its representable midpoint.",
    );
    return { midpoint, width: upper - lower };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lower: 0.25, upper: 0.5 },
  output: { midpoint: 0.375, width: 0.25 },
} satisfies ToolExample<Input, Output>;
export const arithmeticCodeFinalIntervalMidpointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/arithmetic-code-final-interval-midpoint",
      title: "Arithmetic Code Final Interval Midpoint Tool",
      description:
        "Choose a binary64 midpoint in a supplied half-open arithmetic-coding interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number", minimum: 0 },
          upper: { type: "number", maximum: 1 },
        },
        required: ["lower", "upper"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { midpoint: { type: "number" }, width: { type: "number" } },
        required: ["midpoint", "width"],
      },
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
          { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
          { id: "width", label: "Width", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = arithmeticCodeFinalIntervalMidpointTool.execute;
export default arithmeticCodeFinalIntervalMidpointTool;
