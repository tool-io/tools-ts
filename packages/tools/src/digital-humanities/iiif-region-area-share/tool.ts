import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly regionWidth: number;
  readonly regionHeight: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number", minimum: 0 },
    y: { type: "number", minimum: 0 },
    regionWidth: { type: "number", minimum: 0 },
    regionHeight: { type: "number", minimum: 0 },
    imageWidth: { type: "number", exclusiveMinimum: 0 },
    imageHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "x",
    "y",
    "regionWidth",
    "regionHeight",
    "imageWidth",
    "imageHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Compute a supplied pixel region’s unit-fraction area within an image; no IIIF request is generated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, regionWidth, regionHeight, imageWidth, imageHeight } = request;
  const compute = (): Output => {
    H.positive(imageWidth);
    H.positive(imageHeight);
    H.domain(
      x >= 0 &&
        y >= 0 &&
        regionWidth >= 0 &&
        regionHeight >= 0 &&
        x + regionWidth <= imageWidth &&
        y + regionHeight <= imageHeight,
    );
    return { share: (regionWidth / imageWidth) * (regionHeight / imageHeight) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    x: 10,
    y: 20,
    regionWidth: 40,
    regionHeight: 20,
    imageWidth: 100,
    imageHeight: 100,
  },
  output: { share: 0.08000000000000002 },
} satisfies ToolExample<Input, Output>;
export const iiifRegionAreaShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "digital-humanities/iiif-region-area-share",
      title: "IIIF Region Area Share Tool",
      description:
        "Compute a supplied pixel region’s unit-fraction area within an image; no IIIF request is generated.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number", minimum: 0 },
          y: { type: "number", minimum: 0 },
          regionWidth: { type: "number", minimum: 0 },
          regionHeight: { type: "number", minimum: 0 },
          imageWidth: { type: "number", exclusiveMinimum: 0 },
          imageHeight: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "x",
          "y",
          "regionWidth",
          "regionHeight",
          "imageWidth",
          "imageHeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { share: { type: "number" } },
        required: ["share"],
      },
      ports: {
        inputs: [
          {
            id: "x",
            label: "X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y",
            label: "Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "regionWidth",
            label: "Region Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "regionHeight",
            label: "Region Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "imageWidth",
            label: "Image Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "imageHeight",
            label: "Image Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = iiifRegionAreaShareTool.execute;
export default iiifRegionAreaShareTool;
