import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelIndex: number;
  readonly sampleIndex: number;
  readonly pixelsPerFrame: number;
  readonly samplesPerPixel: number;
  readonly planar: boolean;
};
export type Output = { readonly elementOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelIndex: { type: "integer", minimum: 0 },
    sampleIndex: { type: "integer", minimum: 0 },
    pixelsPerFrame: { type: "integer", minimum: 1 },
    samplesPerPixel: { type: "integer", minimum: 1, maximum: 16 },
    planar: { type: "boolean" },
  },
  required: [
    "pixelIndex",
    "sampleIndex",
    "pixelsPerFrame",
    "samplesPerPixel",
    "planar",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elementOffset: { type: "integer" } },
  required: ["elementOffset"],
} as const;
/** Uncompressed zero-based sample-element offset for DICOM planar versus interleaved storage, excluding bit packing and frame byte offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelIndex, sampleIndex, pixelsPerFrame, samplesPerPixel, planar } =
    request;
  const compute = (): Output => {
    H.integer(pixelsPerFrame, 1);
    H.integer(samplesPerPixel, 1, 16);
    H.integer(pixelIndex, 0, pixelsPerFrame - 1);
    H.integer(sampleIndex, 0, samplesPerPixel - 1);
    return {
      elementOffset: planar
        ? sampleIndex * pixelsPerFrame + pixelIndex
        : pixelIndex * samplesPerPixel + sampleIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelIndex: 4,
    sampleIndex: 1,
    pixelsPerFrame: 10,
    samplesPerPixel: 3,
    planar: false,
  },
  output: { elementOffset: 13 },
} satisfies ToolExample<Input, Output>;
export const dicomPlanarConfigurationPixelOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/dicom-planar-configuration-pixel-offset",
      title: "DICOM Planar Configuration Pixel Offset Tool",
      description:
        "Uncompressed zero-based sample-element offset for DICOM planar versus interleaved storage, excluding bit packing and frame byte offsets.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pixelIndex: { type: "integer", minimum: 0 },
          sampleIndex: { type: "integer", minimum: 0 },
          pixelsPerFrame: { type: "integer", minimum: 1 },
          samplesPerPixel: { type: "integer", minimum: 1, maximum: 16 },
          planar: { type: "boolean" },
        },
        required: [
          "pixelIndex",
          "sampleIndex",
          "pixelsPerFrame",
          "samplesPerPixel",
          "planar",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { elementOffset: { type: "integer" } },
        required: ["elementOffset"],
      },
      ports: {
        inputs: [
          {
            id: "pixelIndex",
            label: "Pixel Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sampleIndex",
            label: "Sample Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "pixelsPerFrame",
            label: "Pixels Per Frame",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "samplesPerPixel",
            label: "Samples Per Pixel",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "planar",
            label: "Planar",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "elementOffset",
            label: "Element Offset",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dicomPlanarConfigurationPixelOffsetTool.execute;
export default dicomPlanarConfigurationPixelOffsetTool;
