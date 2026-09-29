import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelCount: number;
  readonly xLengthPerPixel: number;
  readonly yLengthPerPixel: number;
  readonly excludedPixels: number;
};
export type Output = {
  readonly pixelArea: number;
  readonly regionArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelCount: { type: "integer", minimum: 0 },
    xLengthPerPixel: { type: "number", exclusiveMinimum: 0 },
    yLengthPerPixel: { type: "number", exclusiveMinimum: 0 },
    excludedPixels: { type: "integer", minimum: 0 },
  },
  required: [
    "pixelCount",
    "xLengthPerPixel",
    "yLengthPerPixel",
    "excludedPixels",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pixelArea: { type: "number" }, regionArea: { type: "number" } },
  required: ["pixelArea", "regionArea"],
} as const;
/** Convert supplied annotated pixel counts to planar area under explicit independent axis calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelCount, xLengthPerPixel, yLengthPerPixel, excludedPixels } =
    request;
  const compute = (): Output => {
    H.integer(pixelCount, 0);
    H.integer(excludedPixels, 0, pixelCount);
    H.positive(xLengthPerPixel);
    H.positive(yLengthPerPixel);
    return {
      pixelArea: xLengthPerPixel * yLengthPerPixel,
      regionArea:
        (pixelCount - excludedPixels) * xLengthPerPixel * yLengthPerPixel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelCount: 100,
    xLengthPerPixel: 0.5,
    yLengthPerPixel: 0.25,
    excludedPixels: 20,
  },
  output: { pixelArea: 0.125, regionArea: 10 },
} satisfies ToolExample<Input, Output>;
export const regionAreaPixelScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/region-area-pixel-scale",
    title: "Region Area Pixel Scale Tool",
    description:
      "Convert supplied annotated pixel counts to planar area under explicit independent axis calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelCount: { type: "integer", minimum: 0 },
        xLengthPerPixel: { type: "number", exclusiveMinimum: 0 },
        yLengthPerPixel: { type: "number", exclusiveMinimum: 0 },
        excludedPixels: { type: "integer", minimum: 0 },
      },
      required: [
        "pixelCount",
        "xLengthPerPixel",
        "yLengthPerPixel",
        "excludedPixels",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelArea: { type: "number" },
        regionArea: { type: "number" },
      },
      required: ["pixelArea", "regionArea"],
    },
    ports: {
      inputs: [
        {
          id: "pixelCount",
          label: "Pixel Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "xLengthPerPixel",
          label: "X Length Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yLengthPerPixel",
          label: "Y Length Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedPixels",
          label: "Excluded Pixels",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "pixelArea", label: "Pixel Area", valueType: { type: "number" } },
        {
          id: "regionArea",
          label: "Region Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = regionAreaPixelScaleTool.execute;
export default regionAreaPixelScaleTool;
