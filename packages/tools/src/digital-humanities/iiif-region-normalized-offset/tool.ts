import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
};
export type Output = {
  readonly xFraction: number;
  readonly yFraction: number;
  readonly widthFraction: number;
  readonly heightFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number", minimum: 0 },
    y: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    imageWidth: { type: "number", exclusiveMinimum: 0 },
    imageHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "y", "width", "height", "imageWidth", "imageHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xFraction: { type: "number" },
    yFraction: { type: "number" },
    widthFraction: { type: "number" },
    heightFraction: { type: "number" },
  },
  required: ["xFraction", "yFraction", "widthFraction", "heightFraction"],
} as const;
/** Normalize an already resolved image-region rectangle to unit fractions; not an IIIF pct URL formatter or image fetcher. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, width, height, imageWidth, imageHeight } = request;
  const compute = (): Output => {
    H.positive(imageWidth);
    H.positive(imageHeight);
    H.domain(
      x >= 0 &&
        y >= 0 &&
        width >= 0 &&
        height >= 0 &&
        x + width <= imageWidth &&
        y + height <= imageHeight,
    );
    return {
      xFraction: x / imageWidth,
      yFraction: y / imageHeight,
      widthFraction: width / imageWidth,
      heightFraction: height / imageHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    x: 20,
    y: 10,
    width: 40,
    height: 30,
    imageWidth: 100,
    imageHeight: 50,
  },
  output: {
    xFraction: 0.2,
    yFraction: 0.2,
    widthFraction: 0.4,
    heightFraction: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const iiifRegionNormalizedOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-region-normalized-offset",
    title: "IIIF Region Normalized Offset Tool",
    description:
      "Normalize an already resolved image-region rectangle to unit fractions; not an IIIF pct URL formatter or image fetcher.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number", minimum: 0 },
        y: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
        imageWidth: { type: "number", exclusiveMinimum: 0 },
        imageHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["x", "y", "width", "height", "imageWidth", "imageHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xFraction: { type: "number" },
        yFraction: { type: "number" },
        widthFraction: { type: "number" },
        heightFraction: { type: "number" },
      },
      required: ["xFraction", "yFraction", "widthFraction", "heightFraction"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
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
        { id: "xFraction", label: "X Fraction", valueType: { type: "number" } },
        { id: "yFraction", label: "Y Fraction", valueType: { type: "number" } },
        {
          id: "widthFraction",
          label: "Width Fraction",
          valueType: { type: "number" },
        },
        {
          id: "heightFraction",
          label: "Height Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = iiifRegionNormalizedOffsetTool.execute;
export default iiifRegionNormalizedOffsetTool;
