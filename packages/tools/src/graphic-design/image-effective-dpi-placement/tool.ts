import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelWidth: number;
  readonly pixelHeight: number;
  readonly placedWidthInches: number;
  readonly placedHeightInches: number;
};
export type Output = {
  readonly horizontalDpi: number;
  readonly verticalDpi: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelWidth: { type: "integer", minimum: 1 },
    pixelHeight: { type: "integer", minimum: 1 },
    placedWidthInches: { type: "number", exclusiveMinimum: 0 },
    placedHeightInches: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "pixelWidth",
    "pixelHeight",
    "placedWidthInches",
    "placedHeightInches",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalDpi: { type: "number" },
    verticalDpi: { type: "number" },
  },
  required: ["horizontalDpi", "verticalDpi"],
} as const;
/** Calculate horizontal and vertical effective image resolution from explicit pixel dimensions and placed inches. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelWidth, pixelHeight, placedWidthInches, placedHeightInches } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(pixelWidth) &&
        pixelWidth >= 1 &&
        pixelWidth <= Number.MAX_SAFE_INTEGER,
      "pixelWidth",
    ),
      pixelWidth);
    (H.domain(
      Number.isSafeInteger(pixelHeight) &&
        pixelHeight >= 1 &&
        pixelHeight <= Number.MAX_SAFE_INTEGER,
      "pixelHeight",
    ),
      pixelHeight);
    (H.domain(placedWidthInches > 0, "placedWidthInches"), placedWidthInches);
    (H.domain(placedHeightInches > 0, "placedHeightInches"),
      placedHeightInches);
    return {
      horizontalDpi: pixelWidth / placedWidthInches,
      verticalDpi: pixelHeight / placedHeightInches,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelWidth: 1200,
    pixelHeight: 800,
    placedWidthInches: 4,
    placedHeightInches: 2,
  },
  output: { horizontalDpi: 300, verticalDpi: 400 },
} satisfies ToolExample<Input, Output>;
export const imageEffectiveDpiPlacementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/image-effective-dpi-placement",
    title: "Image Effective DPI Placement",
    description:
      "Calculate horizontal and vertical effective image resolution from explicit pixel dimensions and placed inches.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelWidth: { type: "integer", minimum: 1 },
        pixelHeight: { type: "integer", minimum: 1 },
        placedWidthInches: { type: "number", exclusiveMinimum: 0 },
        placedHeightInches: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "pixelWidth",
        "pixelHeight",
        "placedWidthInches",
        "placedHeightInches",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalDpi: { type: "number" },
        verticalDpi: { type: "number" },
      },
      required: ["horizontalDpi", "verticalDpi"],
    },
    ports: {
      inputs: [
        {
          id: "pixelWidth",
          label: "Pixel Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pixelHeight",
          label: "Pixel Height",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "placedWidthInches",
          label: "Placed Width Inches",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "placedHeightInches",
          label: "Placed Height Inches",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalDpi",
          label: "Horizontal Dpi",
          valueType: { type: "number" },
        },
        {
          id: "verticalDpi",
          label: "Vertical Dpi",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = imageEffectiveDpiPlacementTool.execute;
export default imageEffectiveDpiPlacementTool;
