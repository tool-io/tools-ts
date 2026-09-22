import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly targetRatio: number;
};
export type Output = {
  readonly currentRatio: number;
  readonly cropWidth: number;
  readonly cropHeight: number;
  readonly retainedAreaFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
    targetRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["width", "height", "targetRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentRatio: { type: "number" },
    cropWidth: { type: "number" },
    cropHeight: { type: "number" },
    retainedAreaFraction: { type: "number" },
  },
  required: ["currentRatio", "cropWidth", "cropHeight", "retainedAreaFraction"],
} as const;
/** Calculate painting canvas aspect reframing gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, targetRatio } = request;
  const compute = (): Output => {
    H.positive(width);
    H.positive(height);
    H.positive(targetRatio);
    return {
      currentRatio: width / height,
      cropWidth: Math.min(width, height * targetRatio),
      cropHeight: Math.min(height, width / targetRatio),
      retainedAreaFraction:
        (Math.min(width, height * targetRatio) *
          Math.min(height, width / targetRatio)) /
        (width * height),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 60, height: 40, targetRatio: 1 },
  output: {
    currentRatio: 1.5,
    cropWidth: 40,
    cropHeight: 40,
    retainedAreaFraction: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const paintingCanvasAspectReframingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/painting-canvas-aspect-reframing-gap",
    title: "Painting Canvas Aspect Reframing Gap Tool",
    description:
      "Calculate painting canvas aspect reframing gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", exclusiveMinimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
        targetRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["width", "height", "targetRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentRatio: { type: "number" },
        cropWidth: { type: "number" },
        cropHeight: { type: "number" },
        retainedAreaFraction: { type: "number" },
      },
      required: [
        "currentRatio",
        "cropWidth",
        "cropHeight",
        "retainedAreaFraction",
      ],
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
          id: "targetRatio",
          label: "Target Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "currentRatio",
          label: "Current Ratio",
          valueType: { type: "number" },
        },
        { id: "cropWidth", label: "Crop Width", valueType: { type: "number" } },
        {
          id: "cropHeight",
          label: "Crop Height",
          valueType: { type: "number" },
        },
        {
          id: "retainedAreaFraction",
          label: "Retained Area Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paintingCanvasAspectReframingGapTool.execute;
export default paintingCanvasAspectReframingGapTool;
