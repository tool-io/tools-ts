import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly newer: number;
  readonly older: number;
  readonly fraction: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newer: { type: "number" },
    older: { type: "number" },
    fraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["newer", "older", "fraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Linear interpolation between neighboring delayed samples; fraction zero selects the newer sample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { newer, older, fraction } = request;
  const compute = (): Output => {
    H.probability(fraction);
    return { value: (1 - fraction) * newer + fraction * older };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { newer: 10, older: 6, fraction: 0.25 },
  output: { value: 9 },
} satisfies ToolExample<Input, Output>;
export const deadTimeFractionalDelayWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/dead-time-fractional-delay-weight",
    title: "Dead Time Fractional Delay Weight Tool",
    description:
      "Linear interpolation between neighboring delayed samples; fraction zero selects the newer sample.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newer: { type: "number" },
        older: { type: "number" },
        fraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["newer", "older", "fraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "newer",
          label: "Newer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "older",
          label: "Older",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = deadTimeFractionalDelayWeightTool.execute;
export default deadTimeFractionalDelayWeightTool;
