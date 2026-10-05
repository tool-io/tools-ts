import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
};
export type Output = {
  readonly normalizedX: number;
  readonly normalizedY: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number", minimum: 0 },
    y: { type: "number", minimum: 0 },
    imageWidth: { type: "number", exclusiveMinimum: 0 },
    imageHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["x", "y", "imageWidth", "imageHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedX: { type: "number" },
    normalizedY: { type: "number" },
  },
  required: ["normalizedX", "normalizedY"],
} as const;
/** Normalize a focal point measured from the top-left of a continuous image rectangle to unit coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, imageWidth, imageHeight } = request;
  const compute = (): Output => {
    (H.domain(imageWidth > 0, "imageWidth"), imageWidth);
    (H.domain(imageHeight > 0, "imageHeight"), imageHeight);
    H.domain(x >= 0 && x <= imageWidth && y >= 0 && y <= imageHeight, "x");
    return { normalizedX: x / imageWidth, normalizedY: y / imageHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 300, y: 100, imageWidth: 600, imageHeight: 400 },
  output: { normalizedX: 0.5, normalizedY: 0.25 },
} satisfies ToolExample<Input, Output>;
export const imageFocalPointNormalizedCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "visual-arts/image-focal-point-normalized-coordinate",
      title: "Image Focal Point Normalized Coordinate Tool",
      description:
        "Normalize a focal point measured from the top-left of a continuous image rectangle to unit coordinates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number", minimum: 0 },
          y: { type: "number", minimum: 0 },
          imageWidth: { type: "number", exclusiveMinimum: 0 },
          imageHeight: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["x", "y", "imageWidth", "imageHeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalizedX: { type: "number" },
          normalizedY: { type: "number" },
        },
        required: ["normalizedX", "normalizedY"],
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
          {
            id: "normalizedX",
            label: "Normalized X",
            valueType: { type: "number" },
          },
          {
            id: "normalizedY",
            label: "Normalized Y",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = imageFocalPointNormalizedCoordinateTool.execute;
export default imageFocalPointNormalizedCoordinateTool;
