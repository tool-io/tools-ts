import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photoPixels: number;
  readonly scalePixels: number;
  readonly suppliedScaleLength: number;
  readonly secondLength: number;
};
export type Output = {
  readonly measuredLength: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photoPixels: { type: "number", minimum: 0 },
    scalePixels: { type: "number", exclusiveMinimum: 0 },
    suppliedScaleLength: { type: "number", exclusiveMinimum: 0 },
    secondLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "photoPixels",
    "scalePixels",
    "suppliedScaleLength",
    "secondLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { measuredLength: { type: "number" }, ratio: { type: "number" } },
  required: ["measuredLength", "ratio"],
} as const;
/** Compare supplied photographed ruler measurements without forensic identification or evidentiary conclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photoPixels, scalePixels, suppliedScaleLength, secondLength } =
    request;
  const compute = (): Output => {
    H.domain(photoPixels >= 0);
    H.positive(scalePixels);
    H.positive(suppliedScaleLength);
    H.positive(secondLength);
    return {
      measuredLength: (photoPixels * suppliedScaleLength) / scalePixels,
      ratio: (photoPixels * suppliedScaleLength) / scalePixels / secondLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    photoPixels: 40,
    scalePixels: 20,
    suppliedScaleLength: 5,
    secondLength: 8,
  },
  output: { measuredLength: 10, ratio: 1.25 },
} satisfies ToolExample<Input, Output>;
export const measurementScalePhotoRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/measurement-scale-photo-ratio",
    title: "Measurement Scale Photo Ratio Tool",
    description:
      "Compare supplied photographed ruler measurements without forensic identification or evidentiary conclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photoPixels: { type: "number", minimum: 0 },
        scalePixels: { type: "number", exclusiveMinimum: 0 },
        suppliedScaleLength: { type: "number", exclusiveMinimum: 0 },
        secondLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "photoPixels",
        "scalePixels",
        "suppliedScaleLength",
        "secondLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLength: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["measuredLength", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "photoPixels",
          label: "Photo Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scalePixels",
          label: "Scale Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScaleLength",
          label: "Supplied Scale Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredLength",
          label: "Measured Length",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = measurementScalePhotoRatioTool.execute;
export default measurementScalePhotoRatioTool;
