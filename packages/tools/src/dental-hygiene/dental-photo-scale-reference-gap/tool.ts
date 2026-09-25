import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredReferencePixels: number;
  readonly referenceLength: number;
  readonly suppliedPixelsPerUnit: number;
};
export type Output = {
  readonly estimatedPixelsPerUnit: number;
  readonly calibrationGap: number;
  readonly relativeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredReferencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    suppliedPixelsPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measuredReferencePixels",
    "referenceLength",
    "suppliedPixelsPerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedPixelsPerUnit: { type: "number" },
    calibrationGap: { type: "number" },
    relativeGap: { type: "number" },
  },
  required: ["estimatedPixelsPerUnit", "calibrationGap", "relativeGap"],
} as const;
/** Calculate dental photo scale reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredReferencePixels, referenceLength, suppliedPixelsPerUnit } =
    request;
  const compute = (): Output => {
    H.positive(measuredReferencePixels);
    H.positive(referenceLength);
    H.positive(suppliedPixelsPerUnit);
    return {
      estimatedPixelsPerUnit: measuredReferencePixels / referenceLength,
      calibrationGap:
        measuredReferencePixels / referenceLength - suppliedPixelsPerUnit,
      relativeGap:
        measuredReferencePixels / referenceLength / suppliedPixelsPerUnit - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredReferencePixels: 120,
    referenceLength: 10,
    suppliedPixelsPerUnit: 10,
  },
  output: {
    estimatedPixelsPerUnit: 12,
    calibrationGap: 2,
    relativeGap: 0.19999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const dentalPhotoScaleReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/dental-photo-scale-reference-gap",
    title: "Dental Photo Scale Reference Gap Tool",
    description:
      "Calculate dental photo scale reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredReferencePixels: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
        suppliedPixelsPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "measuredReferencePixels",
        "referenceLength",
        "suppliedPixelsPerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedPixelsPerUnit: { type: "number" },
        calibrationGap: { type: "number" },
        relativeGap: { type: "number" },
      },
      required: ["estimatedPixelsPerUnit", "calibrationGap", "relativeGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredReferencePixels",
          label: "Measured Reference Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPixelsPerUnit",
          label: "Supplied Pixels Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedPixelsPerUnit",
          label: "Estimated Pixels Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "calibrationGap",
          label: "Calibration Gap",
          valueType: { type: "number" },
        },
        {
          id: "relativeGap",
          label: "Relative Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentalPhotoScaleReferenceGapTool.execute;
export default dentalPhotoScaleReferenceGapTool;
