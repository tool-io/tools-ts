import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstExposure: number;
  readonly secondExposure: number;
  readonly pinMovement: number;
  readonly years: number;
};
export type Output = {
  readonly rawExposureChange: number;
  readonly correctedErosion: number;
  readonly erosionRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstExposure: { type: "number", minimum: 0 },
    secondExposure: { type: "number", minimum: 0 },
    pinMovement: { type: "number" },
    years: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstExposure", "secondExposure", "pinMovement", "years"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawExposureChange: { type: "number" },
    correctedErosion: { type: "number" },
    erosionRate: { type: "number" },
  },
  required: ["rawExposureChange", "correctedErosion", "erosionRate"],
} as const;
/** Positive exposure increase is erosion; positive upward pin movement is subtracted from the apparent change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstExposure, secondExposure, pinMovement, years } = request;
  const compute = (): Output => {
    H.domain(firstExposure >= 0 && secondExposure >= 0);
    H.positive(years);
    return {
      rawExposureChange: secondExposure - firstExposure,
      correctedErosion: secondExposure - firstExposure - pinMovement,
      erosionRate: (secondExposure - firstExposure - pinMovement) / years,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstExposure: 10, secondExposure: 15, pinMovement: 1, years: 2 },
  output: { rawExposureChange: 5, correctedErosion: 4, erosionRate: 2 },
} satisfies ToolExample<Input, Output>;
export const erosionPinReferenceExposureDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/erosion-pin-reference-exposure-delta",
    title: "Erosion Pin Reference Exposure Delta Tool",
    description:
      "Positive exposure increase is erosion; positive upward pin movement is subtracted from the apparent change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstExposure: { type: "number", minimum: 0 },
        secondExposure: { type: "number", minimum: 0 },
        pinMovement: { type: "number" },
        years: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstExposure", "secondExposure", "pinMovement", "years"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawExposureChange: { type: "number" },
        correctedErosion: { type: "number" },
        erosionRate: { type: "number" },
      },
      required: ["rawExposureChange", "correctedErosion", "erosionRate"],
    },
    ports: {
      inputs: [
        {
          id: "firstExposure",
          label: "First Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondExposure",
          label: "Second Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pinMovement",
          label: "Pin Movement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawExposureChange",
          label: "Raw Exposure Change",
          valueType: { type: "number" },
        },
        {
          id: "correctedErosion",
          label: "Corrected Erosion",
          valueType: { type: "number" },
        },
        {
          id: "erosionRate",
          label: "Erosion Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = erosionPinReferenceExposureDeltaTool.execute;
export default erosionPinReferenceExposureDeltaTool;
