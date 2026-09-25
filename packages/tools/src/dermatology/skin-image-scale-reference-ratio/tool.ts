import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imagePixels: number;
  readonly referencePixels: number;
  readonly suppliedReferenceLength: number;
  readonly secondScale: number;
};
export type Output = {
  readonly physicalLength: number;
  readonly scaleRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imagePixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceLength: { type: "number", exclusiveMinimum: 0 },
    secondScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "imagePixels",
    "referencePixels",
    "suppliedReferenceLength",
    "secondScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalLength: { type: "number" },
    scaleRatio: { type: "number" },
  },
  required: ["physicalLength", "scaleRatio"],
} as const;
/** Compare supplied image reference scales without lesion identification or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imagePixels, referencePixels, suppliedReferenceLength, secondScale } =
    request;
  const compute = (): Output => {
    H.positive(referencePixels);
    H.positive(suppliedReferenceLength);
    H.positive(secondScale);
    H.domain(imagePixels >= 0);
    return {
      physicalLength: (imagePixels * suppliedReferenceLength) / referencePixels,
      scaleRatio: suppliedReferenceLength / referencePixels / secondScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imagePixels: 40,
    referencePixels: 20,
    suppliedReferenceLength: 5,
    secondScale: 0.5,
  },
  output: { physicalLength: 10, scaleRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const skinImageScaleReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-image-scale-reference-ratio",
    title: "Skin Image Scale Reference Ratio Tool",
    description:
      "Compare supplied image reference scales without lesion identification or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imagePixels: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceLength: { type: "number", exclusiveMinimum: 0 },
        secondScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "imagePixels",
        "referencePixels",
        "suppliedReferenceLength",
        "secondScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalLength: { type: "number" },
        scaleRatio: { type: "number" },
      },
      required: ["physicalLength", "scaleRatio"],
    },
    ports: {
      inputs: [
        {
          id: "imagePixels",
          label: "Image Pixels",
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
          id: "suppliedReferenceLength",
          label: "Supplied Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondScale",
          label: "Second Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalLength",
          label: "Physical Length",
          valueType: { type: "number" },
        },
        {
          id: "scaleRatio",
          label: "Scale Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = skinImageScaleReferenceRatioTool.execute;
export default skinImageScaleReferenceRatioTool;
