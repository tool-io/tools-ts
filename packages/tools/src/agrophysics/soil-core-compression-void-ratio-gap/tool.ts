import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialHeight: number;
  readonly finalHeight: number;
  readonly initialVoidRatio: number;
};
export type Output = {
  readonly finalVoidRatio: number;
  readonly axialStrain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialHeight: { type: "number", exclusiveMinimum: 0 },
    finalHeight: { type: "number", exclusiveMinimum: 0 },
    initialVoidRatio: { type: "number", minimum: 0 },
  },
  required: ["initialHeight", "finalHeight", "initialVoidRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalVoidRatio: { type: "number" },
    axialStrain: { type: "number" },
  },
  required: ["finalVoidRatio", "axialStrain"],
} as const;
/** Constant-area, constant-solid-volume core geometry from supplied measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialHeight, finalHeight, initialVoidRatio } = request;
  const compute = (): Output => {
    H.positive(initialHeight);
    H.domain(
      finalHeight > 0 &&
        initialVoidRatio >= 0 &&
        (1 + initialVoidRatio) * finalHeight >= initialHeight,
    );
    return {
      finalVoidRatio:
        ((1 + initialVoidRatio) * finalHeight) / initialHeight - 1,
      axialStrain: 1 - finalHeight / initialHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialHeight: 10, finalHeight: 8, initialVoidRatio: 1 },
  output: {
    finalVoidRatio: 0.6000000000000001,
    axialStrain: 0.19999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const soilCoreCompressionVoidRatioGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-core-compression-void-ratio-gap",
    title: "Soil Core Compression Void Ratio Gap Tool",
    description:
      "Constant-area, constant-solid-volume core geometry from supplied measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialHeight: { type: "number", exclusiveMinimum: 0 },
        finalHeight: { type: "number", exclusiveMinimum: 0 },
        initialVoidRatio: { type: "number", minimum: 0 },
      },
      required: ["initialHeight", "finalHeight", "initialVoidRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalVoidRatio: { type: "number" },
        axialStrain: { type: "number" },
      },
      required: ["finalVoidRatio", "axialStrain"],
    },
    ports: {
      inputs: [
        {
          id: "initialHeight",
          label: "Initial Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalHeight",
          label: "Final Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialVoidRatio",
          label: "Initial Void Ratio",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "finalVoidRatio",
          label: "Final Void Ratio",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "axialStrain",
          label: "Axial Strain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilCoreCompressionVoidRatioGapTool.execute;
export default soilCoreCompressionVoidRatioGapTool;
