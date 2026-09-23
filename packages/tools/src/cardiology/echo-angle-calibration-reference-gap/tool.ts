import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDegrees: number;
  readonly suppliedZeroDegrees: number;
  readonly suppliedScale: number;
  readonly referenceDegrees: number;
};
export type Output = {
  readonly calibratedDegrees: number;
  readonly gapDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDegrees: { type: "number" },
    suppliedZeroDegrees: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    referenceDegrees: { type: "number" },
  },
  required: [
    "recordedDegrees",
    "suppliedZeroDegrees",
    "suppliedScale",
    "referenceDegrees",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calibratedDegrees: { type: "number" },
    gapDegrees: { type: "number" },
  },
  required: ["calibratedDegrees", "gapDegrees"],
} as const;
/** Affine bench angle calibration against an explicit reference, without interpreting echocardiography. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedDegrees,
    suppliedZeroDegrees,
    suppliedScale,
    referenceDegrees,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      calibratedDegrees:
        (recordedDegrees - suppliedZeroDegrees) * suppliedScale,
      gapDegrees:
        (recordedDegrees - suppliedZeroDegrees) * suppliedScale -
        referenceDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedDegrees: 40,
    suppliedZeroDegrees: 10,
    suppliedScale: 0.5,
    referenceDegrees: 12,
  },
  output: { calibratedDegrees: 15, gapDegrees: 3 },
} satisfies ToolExample<Input, Output>;
export const echoAngleCalibrationReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/echo-angle-calibration-reference-gap",
    title: "Echo Angle Calibration Reference Gap Tool",
    description:
      "Affine bench angle calibration against an explicit reference, without interpreting echocardiography.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDegrees: { type: "number" },
        suppliedZeroDegrees: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        referenceDegrees: { type: "number" },
      },
      required: [
        "recordedDegrees",
        "suppliedZeroDegrees",
        "suppliedScale",
        "referenceDegrees",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calibratedDegrees: { type: "number" },
        gapDegrees: { type: "number" },
      },
      required: ["calibratedDegrees", "gapDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDegrees",
          label: "Recorded Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedZeroDegrees",
          label: "Supplied Zero Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDegrees",
          label: "Reference Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calibratedDegrees",
          label: "Calibrated Degrees",
          valueType: { type: "number" },
        },
        {
          id: "gapDegrees",
          label: "Gap Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = echoAngleCalibrationReferenceGapTool.execute;
export default echoAngleCalibrationReferenceGapTool;
