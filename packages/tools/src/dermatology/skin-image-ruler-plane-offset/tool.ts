import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPixels: number;
  readonly pixelsPerLength: number;
  readonly suppliedPlaneScale: number;
};
export type Output = {
  readonly uncorrectedLength: number;
  readonly correctedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPixels: { type: "number", minimum: 0 },
    pixelsPerLength: { type: "number", exclusiveMinimum: 0 },
    suppliedPlaneScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredPixels", "pixelsPerLength", "suppliedPlaneScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncorrectedLength: { type: "number" },
    correctedLength: { type: "number" },
  },
  required: ["uncorrectedLength", "correctedLength"],
} as const;
/** Image ruler arithmetic with a separately established plane correction; no lesion measurement reliability is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPixels, pixelsPerLength, suppliedPlaneScale } = request;
  const compute = (): Output => {
    H.domain(measuredPixels >= 0);
    H.positive(pixelsPerLength);
    H.positive(suppliedPlaneScale);
    return {
      uncorrectedLength: measuredPixels / pixelsPerLength,
      correctedLength: (measuredPixels / pixelsPerLength) * suppliedPlaneScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPixels: 100, pixelsPerLength: 20, suppliedPlaneScale: 1.1 },
  output: { uncorrectedLength: 5, correctedLength: 5.5 },
} satisfies ToolExample<Input, Output>;
export const skinImageRulerPlaneOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-image-ruler-plane-offset",
    title: "Skin Image Ruler Plane Offset Tool",
    description:
      "Image ruler arithmetic with a separately established plane correction; no lesion measurement reliability is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPixels: { type: "number", minimum: 0 },
        pixelsPerLength: { type: "number", exclusiveMinimum: 0 },
        suppliedPlaneScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredPixels", "pixelsPerLength", "suppliedPlaneScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncorrectedLength: { type: "number" },
        correctedLength: { type: "number" },
      },
      required: ["uncorrectedLength", "correctedLength"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPixels",
          label: "Measured Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pixelsPerLength",
          label: "Pixels Per Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPlaneScale",
          label: "Supplied Plane Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncorrectedLength",
          label: "Uncorrected Length",
          valueType: { type: "number" },
        },
        {
          id: "correctedLength",
          label: "Corrected Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = skinImageRulerPlaneOffsetTool.execute;
export default skinImageRulerPlaneOffsetTool;
