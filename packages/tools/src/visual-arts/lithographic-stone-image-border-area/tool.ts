import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stoneWidth: number;
  readonly stoneHeight: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
};
export type Output = {
  readonly borderArea: number;
  readonly imageFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stoneWidth: { type: "number", exclusiveMinimum: 0 },
    stoneHeight: { type: "number", exclusiveMinimum: 0 },
    imageWidth: { type: "number", minimum: 0 },
    imageHeight: { type: "number", minimum: 0 },
  },
  required: ["stoneWidth", "stoneHeight", "imageWidth", "imageHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    borderArea: { type: "number" },
    imageFraction: { type: "number" },
  },
  required: ["borderArea", "imageFraction"],
} as const;
/** Calculate lithographic stone image border area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stoneWidth, stoneHeight, imageWidth, imageHeight } = request;
  const compute = (): Output => {
    H.positive(stoneWidth);
    H.positive(stoneHeight);
    H.domain(
      imageWidth >= 0 &&
        imageWidth <= stoneWidth &&
        imageHeight >= 0 &&
        imageHeight <= stoneHeight,
    );
    return {
      borderArea: stoneWidth * stoneHeight - imageWidth * imageHeight,
      imageFraction: (imageWidth * imageHeight) / (stoneWidth * stoneHeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stoneWidth: 40, stoneHeight: 50, imageWidth: 30, imageHeight: 40 },
  output: { borderArea: 800, imageFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const lithographicStoneImageBorderAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/lithographic-stone-image-border-area",
    title: "Lithographic Stone Image Border Area Tool",
    description:
      "Calculate lithographic stone image border area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stoneWidth: { type: "number", exclusiveMinimum: 0 },
        stoneHeight: { type: "number", exclusiveMinimum: 0 },
        imageWidth: { type: "number", minimum: 0 },
        imageHeight: { type: "number", minimum: 0 },
      },
      required: ["stoneWidth", "stoneHeight", "imageWidth", "imageHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        borderArea: { type: "number" },
        imageFraction: { type: "number" },
      },
      required: ["borderArea", "imageFraction"],
    },
    ports: {
      inputs: [
        {
          id: "stoneWidth",
          label: "Stone Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stoneHeight",
          label: "Stone Height",
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
          id: "borderArea",
          label: "Border Area",
          valueType: { type: "number" },
        },
        {
          id: "imageFraction",
          label: "Image Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lithographicStoneImageBorderAreaTool.execute;
export default lithographicStoneImageBorderAreaTool;
