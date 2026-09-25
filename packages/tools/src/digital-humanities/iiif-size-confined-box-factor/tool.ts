import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly boxWidth: number;
  readonly boxHeight: number;
  readonly allowUpscale: boolean;
};
export type Output = {
  readonly factor: number;
  readonly outputWidth: number;
  readonly outputHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
    boxWidth: { type: "number", exclusiveMinimum: 0 },
    boxHeight: { type: "number", exclusiveMinimum: 0 },
    allowUpscale: { type: "boolean" },
  },
  required: ["width", "height", "boxWidth", "boxHeight", "allowUpscale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factor: { type: "number" },
    outputWidth: { type: "number" },
    outputHeight: { type: "number" },
  },
  required: ["factor", "outputWidth", "outputHeight"],
} as const;
/** Aspect-preserving continuous confined-box dimensions; final integer raster rounding remains a consuming-app choice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, boxWidth, boxHeight, allowUpscale } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(height);
    H.positive(boxWidth);
    H.positive(boxHeight);
    return {
      factor: Math.min(
        boxWidth / width,
        boxHeight / height,
        allowUpscale ? Infinity : 1,
      ),
      outputWidth:
        width *
        Math.min(
          boxWidth / width,
          boxHeight / height,
          allowUpscale ? Infinity : 1,
        ),
      outputHeight:
        height *
        Math.min(
          boxWidth / width,
          boxHeight / height,
          allowUpscale ? Infinity : 1,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    width: 400,
    height: 200,
    boxWidth: 100,
    boxHeight: 100,
    allowUpscale: false,
  },
  output: { factor: 0.25, outputWidth: 100, outputHeight: 50 },
} satisfies ToolExample<Input, Output>;
export const iiifSizeConfinedBoxFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-size-confined-box-factor",
    title: "IIIF Size Confined Box Factor Tool",
    description:
      "Aspect-preserving continuous confined-box dimensions; final integer raster rounding remains a consuming-app choice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
        boxWidth: { type: "number", exclusiveMinimum: 0 },
        boxHeight: { type: "number", exclusiveMinimum: 0 },
        allowUpscale: { type: "boolean" },
      },
      required: ["width", "height", "boxWidth", "boxHeight", "allowUpscale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        factor: { type: "number" },
        outputWidth: { type: "number" },
        outputHeight: { type: "number" },
      },
      required: ["factor", "outputWidth", "outputHeight"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boxWidth",
          label: "Box Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boxHeight",
          label: "Box Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowUpscale",
          label: "Allow Upscale",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
        {
          id: "outputWidth",
          label: "Output Width",
          valueType: { type: "number" },
        },
        {
          id: "outputHeight",
          label: "Output Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = iiifSizeConfinedBoxFactorTool.execute;
export default iiifSizeConfinedBoxFactorTool;
