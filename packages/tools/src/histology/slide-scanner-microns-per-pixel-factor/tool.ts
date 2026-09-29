import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseMicronsPerPixel: number;
  readonly downsample: number;
  readonly pixels: number;
};
export type Output = {
  readonly levelMicronsPerPixel: number;
  readonly lengthMicrons: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMicronsPerPixel: { type: "number", exclusiveMinimum: 0 },
    downsample: { type: "number", exclusiveMinimum: 0 },
    pixels: { type: "number", minimum: 0 },
  },
  required: ["baseMicronsPerPixel", "downsample", "pixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelMicronsPerPixel: { type: "number" },
    lengthMicrons: { type: "number" },
  },
  required: ["levelMicronsPerPixel", "lengthMicrons"],
} as const;
/** Calculate slide scanner microns per pixel factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseMicronsPerPixel, downsample, pixels } = request;
  const compute = (): Output => {
    H.positive(baseMicronsPerPixel);
    H.positive(downsample);
    H.domain(pixels >= 0);
    return {
      levelMicronsPerPixel: baseMicronsPerPixel * downsample,
      lengthMicrons: baseMicronsPerPixel * downsample * pixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseMicronsPerPixel: 0.25, downsample: 4, pixels: 200 },
  output: { levelMicronsPerPixel: 1, lengthMicrons: 200 },
} satisfies ToolExample<Input, Output>;
export const slideScannerMicronsPerPixelFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/slide-scanner-microns-per-pixel-factor",
    title: "Slide Scanner Microns Per Pixel Factor Tool",
    description:
      "Calculate slide scanner microns per pixel factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseMicronsPerPixel: { type: "number", exclusiveMinimum: 0 },
        downsample: { type: "number", exclusiveMinimum: 0 },
        pixels: { type: "number", minimum: 0 },
      },
      required: ["baseMicronsPerPixel", "downsample", "pixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelMicronsPerPixel: { type: "number" },
        lengthMicrons: { type: "number" },
      },
      required: ["levelMicronsPerPixel", "lengthMicrons"],
    },
    ports: {
      inputs: [
        {
          id: "baseMicronsPerPixel",
          label: "Base Microns Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downsample",
          label: "Downsample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pixels",
          label: "Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "levelMicronsPerPixel",
          label: "Level Microns Per Pixel",
          valueType: { type: "number" },
        },
        {
          id: "lengthMicrons",
          label: "Length Microns",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = slideScannerMicronsPerPixelFactorTool.execute;
export default slideScannerMicronsPerPixelFactorTool;
