import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AttributeSamplingInput = {
  readonly deviations: number;
  readonly sampleSize: number;
  readonly tolerableDeviationRatePercent: number;
};

export type AttributeSamplingOutput = {
  readonly deviationRatePercent: number;
  readonly sampleSize: number;
  readonly withinTolerableRate: boolean;
};

export const computeAttributeSamplingDeviationRate = (
  input: AttributeSamplingInput,
): AttributeSamplingOutput => {
  if (!Number.isSafeInteger(input.sampleSize) || input.sampleSize < 1)
    simpleError(
      "sampleSize",
      "Sample size must be a positive whole number.",
      "invalid_sample_size",
    );
  if (
    !Number.isSafeInteger(input.deviations) ||
    input.deviations < 0 ||
    input.deviations > input.sampleSize
  )
    simpleError(
      "deviations",
      "Deviations must be a whole number from zero through sample size.",
      "invalid_deviation_count",
    );
  if (
    !Number.isFinite(input.tolerableDeviationRatePercent) ||
    input.tolerableDeviationRatePercent < 0 ||
    input.tolerableDeviationRatePercent > 100
  )
    simpleError(
      "tolerableDeviationRatePercent",
      "Tolerable deviation rate must be from 0 through 100 percent.",
      "invalid_tolerable_deviation_rate",
    );
  const deviationRatePercent = (input.deviations / input.sampleSize) * 100;
  return {
    deviationRatePercent,
    sampleSize: input.sampleSize,
    withinTolerableRate:
      deviationRatePercent <= input.tolerableDeviationRatePercent,
  };
};

export const attributeSamplingExample = {
  input: { deviations: 3, sampleSize: 50, tolerableDeviationRatePercent: 5 },
  output: {
    deviationRatePercent: 6,
    sampleSize: 50,
    withinTolerableRate: false,
  },
} satisfies ToolExample<AttributeSamplingInput, AttributeSamplingOutput>;

export const attributeSamplingTool = createSimpleTool({
  calculate: (input) =>
    computeAttributeSamplingDeviationRate({
      deviations: input.deviations as number,
      sampleSize: input.sampleSize as number,
      tolerableDeviationRatePercent:
        input.tolerableDeviationRatePercent as number,
    }),
  description:
    "Compute the exact attribute-sampling deviation rate from a sample and deviation count and compare it with a caller-supplied tolerable rate.",
  id: "auditing/attribute-sampling-deviation-rate-size-computation",
  inputs: [
    {
      description: "Number of deviations observed in the sample.",
      id: "deviations",
      kind: "integer",
      label: "Deviations",
      minimum: 0,
    },
    {
      description: "Number of items examined.",
      id: "sampleSize",
      kind: "integer",
      label: "Sample size",
      minimum: 1,
    },
    {
      description: "Maximum acceptable observed deviation rate.",
      id: "tolerableDeviationRatePercent",
      kind: "number",
      label: "Tolerable deviation rate",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
  ],
  outputs: [
    {
      id: "deviationRatePercent",
      kind: "number",
      label: "Deviation rate",
      minimum: 0,
      maximum: 100,
      unit: "percent",
    },
    { id: "sampleSize", kind: "integer", label: "Sample size", minimum: 1 },
    {
      id: "withinTolerableRate",
      kind: "boolean",
      label: "Within tolerable rate",
    },
  ],
  title: "Attribute Sampling Deviation Rate Size Computation",
});

export const runAttributeSampling = attributeSamplingTool.execute;
export default attributeSamplingTool;
