import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distancePixels: number;
  readonly intervals: number;
  readonly pixelsPerMm: number;
};
export type Output = {
  readonly meanSpacingPixels: number;
  readonly meanSpacingMm: number;
  readonly ridgesPerMm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distancePixels: { type: "number", exclusiveMinimum: 0 },
    intervals: { type: "integer", minimum: 1 },
    pixelsPerMm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distancePixels", "intervals", "pixelsPerMm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanSpacingPixels: { type: "number" },
    meanSpacingMm: { type: "number" },
    ridgesPerMm: { type: "number" },
  },
  required: ["meanSpacingPixels", "meanSpacingMm", "ridgesPerMm"],
} as const;
/** Scale explicitly observed ridge intervals without feature extraction or identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distancePixels, intervals, pixelsPerMm } = request;
  const compute = (): Output => {
    H.positive(distancePixels);
    H.integer(intervals, 1);
    H.positive(pixelsPerMm);
    return {
      meanSpacingPixels: distancePixels / intervals,
      meanSpacingMm: distancePixels / (intervals * pixelsPerMm),
      ridgesPerMm: (intervals * pixelsPerMm) / distancePixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distancePixels: 100, intervals: 10, pixelsPerMm: 20 },
  output: { meanSpacingPixels: 10, meanSpacingMm: 0.5, ridgesPerMm: 2 },
} satisfies ToolExample<Input, Output>;
export const fingerprintImageRidgeSpacingFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/fingerprint-image-ridge-spacing-factor",
    title: "Fingerprint Image Ridge Spacing Factor Tool",
    description:
      "Scale explicitly observed ridge intervals without feature extraction or identification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distancePixels: { type: "number", exclusiveMinimum: 0 },
        intervals: { type: "integer", minimum: 1 },
        pixelsPerMm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distancePixels", "intervals", "pixelsPerMm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanSpacingPixels: { type: "number" },
        meanSpacingMm: { type: "number" },
        ridgesPerMm: { type: "number" },
      },
      required: ["meanSpacingPixels", "meanSpacingMm", "ridgesPerMm"],
    },
    ports: {
      inputs: [
        {
          id: "distancePixels",
          label: "Distance Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intervals",
          label: "Intervals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pixelsPerMm",
          label: "Pixels Per Mm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanSpacingPixels",
          label: "Mean Spacing Pixels",
          valueType: { type: "number" },
        },
        {
          id: "meanSpacingMm",
          label: "Mean Spacing Mm",
          valueType: { type: "number" },
        },
        {
          id: "ridgesPerMm",
          label: "Ridges Per Mm",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fingerprintImageRidgeSpacingFactorTool.execute;
export default fingerprintImageRidgeSpacingFactorTool;
