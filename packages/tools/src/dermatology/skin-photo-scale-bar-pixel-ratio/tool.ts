import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaleBarMillimeters: number;
  readonly scaleBarPixels: number;
  readonly measuredPixels: number;
};
export type Output = {
  readonly millimetersPerPixel: number;
  readonly measuredMillimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleBarMillimeters: { type: "number", exclusiveMinimum: 0 },
    scaleBarPixels: { type: "number", exclusiveMinimum: 0 },
    measuredPixels: { type: "number", minimum: 0 },
  },
  required: ["scaleBarMillimeters", "scaleBarPixels", "measuredPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    millimetersPerPixel: { type: "number" },
    measuredMillimeters: { type: "number" },
  },
  required: ["millimetersPerPixel", "measuredMillimeters"],
} as const;
/** Scale an explicit skin-photo image-plane measurement from a coplanar scale bar without assessing a lesion or correcting perspective. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleBarMillimeters, scaleBarPixels, measuredPixels } = request;
  const compute = (): Output => {
    (H.domain(scaleBarMillimeters > 0, "scaleBarMillimeters"),
      scaleBarMillimeters);
    (H.domain(scaleBarPixels > 0, "scaleBarPixels"), scaleBarPixels);
    H.domain(measuredPixels >= 0, "measuredPixels");
    return {
      millimetersPerPixel: scaleBarMillimeters / scaleBarPixels,
      measuredMillimeters:
        (measuredPixels * scaleBarMillimeters) / scaleBarPixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaleBarMillimeters: 10, scaleBarPixels: 200, measuredPixels: 350 },
  output: { millimetersPerPixel: 0.05, measuredMillimeters: 17.5 },
} satisfies ToolExample<Input, Output>;
export const skinPhotoScaleBarPixelRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/skin-photo-scale-bar-pixel-ratio",
    title: "Skin Photo Scale Bar Pixel Ratio",
    description:
      "Scale an explicit skin-photo image-plane measurement from a coplanar scale bar without assessing a lesion or correcting perspective.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleBarMillimeters: { type: "number", exclusiveMinimum: 0 },
        scaleBarPixels: { type: "number", exclusiveMinimum: 0 },
        measuredPixels: { type: "number", minimum: 0 },
      },
      required: ["scaleBarMillimeters", "scaleBarPixels", "measuredPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millimetersPerPixel: { type: "number" },
        measuredMillimeters: { type: "number" },
      },
      required: ["millimetersPerPixel", "measuredMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "scaleBarMillimeters",
          label: "Scale Bar Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleBarPixels",
          label: "Scale Bar Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPixels",
          label: "Measured Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "millimetersPerPixel",
          label: "Millimeters Per Pixel",
          valueType: { type: "number" },
        },
        {
          id: "measuredMillimeters",
          label: "Measured Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = skinPhotoScaleBarPixelRatioTool.execute;
export default skinPhotoScaleBarPixelRatioTool;
