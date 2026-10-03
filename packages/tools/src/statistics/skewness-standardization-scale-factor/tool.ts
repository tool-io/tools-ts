import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thirdCentralMoment: number;
  readonly variance: number;
};
export type Output = { readonly skewness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thirdCentralMoment: { type: "number" },
    variance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["thirdCentralMoment", "variance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { skewness: { type: "number" } },
  required: ["skewness"],
} as const;
/** Calculate skewness standardization scale factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thirdCentralMoment, variance } = request;
  const compute = (): Output => {
    H.positive(variance);
    return { skewness: thirdCentralMoment / variance ** 1.5 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thirdCentralMoment: 16, variance: 4 },
  output: { skewness: 2 },
} satisfies ToolExample<Input, Output>;
export const skewnessStandardizationScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/skewness-standardization-scale-factor",
    title: "Skewness Standardization Scale Factor Tool",
    description:
      "Calculate skewness standardization scale factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thirdCentralMoment: { type: "number" },
        variance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["thirdCentralMoment", "variance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { skewness: { type: "number" } },
      required: ["skewness"],
    },
    ports: {
      inputs: [
        {
          id: "thirdCentralMoment",
          label: "Third Central Moment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variance",
          label: "Variance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "skewness", label: "Skewness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = skewnessStandardizationScaleFactorTool.execute;
export default skewnessStandardizationScaleFactorTool;
