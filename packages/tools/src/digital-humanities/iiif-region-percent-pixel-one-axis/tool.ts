import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dimension: number;
  readonly startPercent: number;
  readonly extentPercent: number;
};
export type Output = {
  readonly startPixel: number;
  readonly endPixel: number;
  readonly extentPixels: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimension: { type: "integer", minimum: 1 },
    startPercent: { type: "number", minimum: 0 },
    extentPercent: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dimension", "startPercent", "extentPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startPixel: { type: "integer" },
    endPixel: { type: "integer" },
    extentPixels: { type: "integer" },
  },
  required: ["startPixel", "endPixel", "extentPixels"],
} as const;
/** Outward-rounded pixel bounds for one in-bounds percentage crop axis, with an explicit floor-start/ceil-end convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dimension, startPercent, extentPercent } = request;
  const compute = (): Output => {
    H.integer(dimension, 1);
    H.domain(
      startPercent >= 0 &&
        extentPercent > 0 &&
        startPercent + extentPercent <= 100,
    );
    return {
      startPixel: Math.floor((dimension * startPercent) / 100),
      endPixel: Math.ceil((dimension * (startPercent + extentPercent)) / 100),
      extentPixels:
        Math.ceil((dimension * (startPercent + extentPercent)) / 100) -
        Math.floor((dimension * startPercent) / 100),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dimension: 1000, startPercent: 12.5, extentPercent: 25 },
  output: { startPixel: 125, endPixel: 375, extentPixels: 250 },
} satisfies ToolExample<Input, Output>;
export const iiifRegionPercentPixelOneAxisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-region-percent-pixel-one-axis",
    title: "IIIF Region Percent Pixel One Axis Tool",
    description:
      "Outward-rounded pixel bounds for one in-bounds percentage crop axis, with an explicit floor-start/ceil-end convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimension: { type: "integer", minimum: 1 },
        startPercent: { type: "number", minimum: 0 },
        extentPercent: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dimension", "startPercent", "extentPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startPixel: { type: "integer" },
        endPixel: { type: "integer" },
        extentPixels: { type: "integer" },
      },
      required: ["startPixel", "endPixel", "extentPixels"],
    },
    ports: {
      inputs: [
        {
          id: "dimension",
          label: "Dimension",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startPercent",
          label: "Start Percent",
          required: true,
          valueType: { type: "number", unit: "%" },
        },
        {
          id: "extentPercent",
          label: "Extent Percent",
          required: true,
          valueType: { type: "number", unit: "%" },
        },
      ],
      outputs: [
        {
          id: "startPixel",
          label: "Start Pixel",
          valueType: { type: "integer" },
        },
        { id: "endPixel", label: "End Pixel", valueType: { type: "integer" } },
        {
          id: "extentPixels",
          label: "Extent Pixels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = iiifRegionPercentPixelOneAxisTool.execute;
export default iiifRegionPercentPixelOneAxisTool;
