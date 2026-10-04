import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageWidthPixels: number;
  readonly wallWidth: number;
  readonly featurePixels: number;
};
export type Output = {
  readonly lengthPerPixel: number;
  readonly featureLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageWidthPixels: { type: "integer", minimum: 1 },
    wallWidth: { type: "number", minimum: 0 },
    featurePixels: { type: "number", minimum: 0 },
  },
  required: ["imageWidthPixels", "wallWidth", "featurePixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthPerPixel: { type: "number" },
    featureLength: { type: "number" },
  },
  required: ["lengthPerPixel", "featureLength"],
} as const;
/** Calculate mural scaling pixel to wall length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageWidthPixels, wallWidth, featurePixels } = request;
  const compute = (): Output => {
    H.integer(imageWidthPixels, 1);
    H.domain(wallWidth >= 0 && featurePixels >= 0);
    return {
      lengthPerPixel: wallWidth / imageWidthPixels,
      featureLength: (featurePixels * wallWidth) / imageWidthPixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageWidthPixels: 1000, wallWidth: 10, featurePixels: 250 },
  output: { lengthPerPixel: 0.01, featureLength: 2.5 },
} satisfies ToolExample<Input, Output>;
export const muralScalingPixelToWallLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/mural-scaling-pixel-to-wall-length",
    title: "Mural Scaling Pixel To Wall Length Tool",
    description:
      "Calculate mural scaling pixel to wall length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageWidthPixels: { type: "integer", minimum: 1 },
        wallWidth: { type: "number", minimum: 0 },
        featurePixels: { type: "number", minimum: 0 },
      },
      required: ["imageWidthPixels", "wallWidth", "featurePixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthPerPixel: { type: "number" },
        featureLength: { type: "number" },
      },
      required: ["lengthPerPixel", "featureLength"],
    },
    ports: {
      inputs: [
        {
          id: "imageWidthPixels",
          label: "Image Width Pixels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "wallWidth",
          label: "Wall Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "featurePixels",
          label: "Feature Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthPerPixel",
          label: "Length Per Pixel",
          valueType: { type: "number" },
        },
        {
          id: "featureLength",
          label: "Feature Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = muralScalingPixelToWallLengthTool.execute;
export default muralScalingPixelToWallLengthTool;
