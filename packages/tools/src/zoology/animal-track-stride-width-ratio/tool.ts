import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strideLength: number;
  readonly trackWidth: number;
  readonly footLength: number;
};
export type Output = {
  readonly strideWidthRatio: number;
  readonly relativeStride: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strideLength: { type: "number", minimum: 0 },
    trackWidth: { type: "number", exclusiveMinimum: 0 },
    footLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["strideLength", "trackWidth", "footLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strideWidthRatio: { type: "number" },
    relativeStride: { type: "number" },
  },
  required: ["strideWidthRatio", "relativeStride"],
} as const;
/** Calculate animal track stride width ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strideLength, trackWidth, footLength } = request;
  const compute = (): Output => {
    H.domain(strideLength >= 0);
    H.positive(trackWidth);
    H.positive(footLength);
    return {
      strideWidthRatio: strideLength / trackWidth,
      relativeStride: strideLength / footLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strideLength: 60, trackWidth: 10, footLength: 15 },
  output: { strideWidthRatio: 6, relativeStride: 4 },
} satisfies ToolExample<Input, Output>;
export const animalTrackStrideWidthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-track-stride-width-ratio",
    title: "Animal Track Stride Width Ratio Tool",
    description:
      "Calculate animal track stride width ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strideLength: { type: "number", minimum: 0 },
        trackWidth: { type: "number", exclusiveMinimum: 0 },
        footLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["strideLength", "trackWidth", "footLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strideWidthRatio: { type: "number" },
        relativeStride: { type: "number" },
      },
      required: ["strideWidthRatio", "relativeStride"],
    },
    ports: {
      inputs: [
        {
          id: "strideLength",
          label: "Stride Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trackWidth",
          label: "Track Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "footLength",
          label: "Foot Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "strideWidthRatio",
          label: "Stride Width Ratio",
          valueType: { type: "number" },
        },
        {
          id: "relativeStride",
          label: "Relative Stride",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalTrackStrideWidthRatioTool.execute;
export default animalTrackStrideWidthRatioTool;
