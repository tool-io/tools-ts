import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredCount: number;
  readonly sampledArea: number;
  readonly referenceArea: number;
  readonly recoveryFraction: number;
};
export type Output = {
  readonly normalizedCount: number;
  readonly recoveryAdjusted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredCount: { type: "number", minimum: 0 },
    sampledArea: { type: "number", exclusiveMinimum: 0 },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
    recoveryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "measuredCount",
    "sampledArea",
    "referenceArea",
    "recoveryFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedCount: { type: "number" },
    recoveryAdjusted: { type: "number" },
  },
  required: ["normalizedCount", "recoveryAdjusted"],
} as const;
/** Normalize a supplied analytical count without a pass/fail criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredCount, sampledArea, referenceArea, recoveryFraction } =
    request;
  const compute = (): Output => {
    H.domain(measuredCount >= 0);
    H.positive(sampledArea);
    H.positive(referenceArea);
    H.domain(recoveryFraction > 0 && recoveryFraction <= 1);
    return {
      normalizedCount: (measuredCount * referenceArea) / sampledArea,
      recoveryAdjusted:
        (measuredCount * referenceArea) / sampledArea / recoveryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredCount: 20,
    sampledArea: 100,
    referenceArea: 25,
    recoveryFraction: 0.5,
  },
  output: { normalizedCount: 5, recoveryAdjusted: 10 },
} satisfies ToolExample<Input, Output>;
export const foodSurfaceWipeSampleAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-surface-wipe-sample-area-factor",
    title: "Food Surface Wipe Sample Area Factor Tool",
    description:
      "Normalize a supplied analytical count without a pass/fail criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredCount: { type: "number", minimum: 0 },
        sampledArea: { type: "number", exclusiveMinimum: 0 },
        referenceArea: { type: "number", exclusiveMinimum: 0 },
        recoveryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: [
        "measuredCount",
        "sampledArea",
        "referenceArea",
        "recoveryFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedCount: { type: "number" },
        recoveryAdjusted: { type: "number" },
      },
      required: ["normalizedCount", "recoveryAdjusted"],
    },
    ports: {
      inputs: [
        {
          id: "measuredCount",
          label: "Measured Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledArea",
          label: "Sampled Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "normalizedCount",
          label: "Normalized Count",
          valueType: { type: "number" },
        },
        {
          id: "recoveryAdjusted",
          label: "Recovery Adjusted",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSurfaceWipeSampleAreaFactorTool.execute;
export default foodSurfaceWipeSampleAreaFactorTool;
