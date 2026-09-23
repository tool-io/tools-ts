import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePixels: number;
  readonly suppliedReferenceLength: number;
  readonly sourceUnitInTargetUnits: number;
};
export type Output = {
  readonly lengthPerPixel: number;
  readonly areaPerPixel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceLength: { type: "number", exclusiveMinimum: 0 },
    sourceUnitInTargetUnits: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "referencePixels",
    "suppliedReferenceLength",
    "sourceUnitInTargetUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthPerPixel: { type: "number" },
    areaPerPixel: { type: "number" },
  },
  required: ["lengthPerPixel", "areaPerPixel"],
} as const;
/** Derive one measured image-reference area multiplier in target length units squared per pixel squared, without leaf segmentation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePixels, suppliedReferenceLength, sourceUnitInTargetUnits } =
    request;
  const compute = (): Output => {
    H.positive(referencePixels);
    H.positive(suppliedReferenceLength);
    H.positive(sourceUnitInTargetUnits);
    return {
      lengthPerPixel:
        (suppliedReferenceLength * sourceUnitInTargetUnits) / referencePixels,
      areaPerPixel:
        ((suppliedReferenceLength * sourceUnitInTargetUnits) /
          referencePixels) **
        2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referencePixels: 20,
    suppliedReferenceLength: 5,
    sourceUnitInTargetUnits: 1,
  },
  output: { lengthPerPixel: 0.25, areaPerPixel: 0.0625 },
} satisfies ToolExample<Input, Output>;
export const leafAreaScaleFactorTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "botany/leaf-area-scale-factor",
      title: "Leaf Area Scale Factor Tool",
      description:
        "Derive one measured image-reference area multiplier in target length units squared per pixel squared, without leaf segmentation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referencePixels: { type: "number", exclusiveMinimum: 0 },
          suppliedReferenceLength: { type: "number", exclusiveMinimum: 0 },
          sourceUnitInTargetUnits: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "referencePixels",
          "suppliedReferenceLength",
          "sourceUnitInTargetUnits",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lengthPerPixel: { type: "number" },
          areaPerPixel: { type: "number" },
        },
        required: ["lengthPerPixel", "areaPerPixel"],
      },
      ports: {
        inputs: [
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
            id: "sourceUnitInTargetUnits",
            label: "Source Unit In Target Units",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lengthPerPixel",
            label: "Length Per Pixel",
            valueType: { type: "number" },
          },
          {
            id: "areaPerPixel",
            label: "Area Per Pixel",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = leafAreaScaleFactorTool.execute;
export default leafAreaScaleFactorTool;
