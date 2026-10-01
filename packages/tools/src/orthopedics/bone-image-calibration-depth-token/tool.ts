import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageLength: number;
  readonly referenceLength: number;
  readonly referencePixels: number;
  readonly suppliedDepthScale: number;
};
export type Output = { readonly calibratedLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    suppliedDepthScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "imageLength",
    "referenceLength",
    "referencePixels",
    "suppliedDepthScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calibratedLength: { type: "number" } },
  required: ["calibratedLength"],
} as const;
/** Apply independently supplied image reference and depth scale factors without deriving geometry from an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageLength, referenceLength, referencePixels, suppliedDepthScale } =
    request;
  const compute = (): Output => {
    H.domain(imageLength >= 0 && referenceLength >= 0);
    H.positive(referencePixels);
    H.positive(suppliedDepthScale);
    return {
      calibratedLength:
        ((imageLength * referenceLength) / referencePixels) *
        suppliedDepthScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageLength: 40,
    referenceLength: 10,
    referencePixels: 20,
    suppliedDepthScale: 1.5,
  },
  output: { calibratedLength: 30 },
} satisfies ToolExample<Input, Output>;
export const boneImageCalibrationDepthTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/bone-image-calibration-depth-token",
    title: "Bone Image Calibration Depth Token Tool",
    description:
      "Apply independently supplied image reference and depth scale factors without deriving geometry from an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        suppliedDepthScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "imageLength",
        "referenceLength",
        "referencePixels",
        "suppliedDepthScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { calibratedLength: { type: "number" } },
      required: ["calibratedLength"],
    },
    ports: {
      inputs: [
        {
          id: "imageLength",
          label: "Image Length",
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
          id: "referencePixels",
          label: "Reference Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDepthScale",
          label: "Supplied Depth Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calibratedLength",
          label: "Calibrated Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boneImageCalibrationDepthTokenTool.execute;
export default boneImageCalibrationDepthTokenTool;
