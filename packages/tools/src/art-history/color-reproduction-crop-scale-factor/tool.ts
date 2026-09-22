import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cropWidth: number;
  readonly cropHeight: number;
  readonly outputWidth: number;
  readonly outputHeight: number;
};
export type Output = {
  readonly widthScale: number;
  readonly heightScale: number;
  readonly uniform: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cropWidth: { type: "number", exclusiveMinimum: 0 },
    cropHeight: { type: "number", exclusiveMinimum: 0 },
    outputWidth: { type: "number", minimum: 0 },
    outputHeight: { type: "number", minimum: 0 },
  },
  required: ["cropWidth", "cropHeight", "outputWidth", "outputHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthScale: { type: "number" },
    heightScale: { type: "number" },
    uniform: { type: "boolean" },
  },
  required: ["widthScale", "heightScale", "uniform"],
} as const;
/** Calculate color reproduction crop scale factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cropWidth, cropHeight, outputWidth, outputHeight } = request;
  const compute = (): Output => {
    H.positive(cropWidth);
    H.positive(cropHeight);
    H.domain(outputWidth >= 0 && outputHeight >= 0);
    return {
      widthScale: outputWidth / cropWidth,
      heightScale: outputHeight / cropHeight,
      uniform: outputWidth / cropWidth === outputHeight / cropHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cropWidth: 20, cropHeight: 30, outputWidth: 40, outputHeight: 60 },
  output: { widthScale: 2, heightScale: 2, uniform: true },
} satisfies ToolExample<Input, Output>;
export const colorReproductionCropScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/color-reproduction-crop-scale-factor",
    title: "Color Reproduction Crop Scale Factor Tool",
    description:
      "Calculate color reproduction crop scale factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cropWidth: { type: "number", exclusiveMinimum: 0 },
        cropHeight: { type: "number", exclusiveMinimum: 0 },
        outputWidth: { type: "number", minimum: 0 },
        outputHeight: { type: "number", minimum: 0 },
      },
      required: ["cropWidth", "cropHeight", "outputWidth", "outputHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthScale: { type: "number" },
        heightScale: { type: "number" },
        uniform: { type: "boolean" },
      },
      required: ["widthScale", "heightScale", "uniform"],
    },
    ports: {
      inputs: [
        {
          id: "cropWidth",
          label: "Crop Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cropHeight",
          label: "Crop Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputWidth",
          label: "Output Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputHeight",
          label: "Output Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "widthScale",
          label: "Width Scale",
          valueType: { type: "number" },
        },
        {
          id: "heightScale",
          label: "Height Scale",
          valueType: { type: "number" },
        },
        { id: "uniform", label: "Uniform", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = colorReproductionCropScaleFactorTool.execute;
export default colorReproductionCropScaleFactorTool;
