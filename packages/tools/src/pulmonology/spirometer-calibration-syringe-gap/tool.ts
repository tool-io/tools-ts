import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceVolume: number;
  readonly measuredVolume: number;
  readonly temperatureFactor: number;
};
export type Output = {
  readonly correctedReference: number;
  readonly absoluteError: number;
  readonly relativeError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceVolume: { type: "number", exclusiveMinimum: 0 },
    measuredVolume: { type: "number" },
    temperatureFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceVolume", "measuredVolume", "temperatureFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedReference: { type: "number" },
    absoluteError: { type: "number" },
    relativeError: { type: "number" },
  },
  required: ["correctedReference", "absoluteError", "relativeError"],
} as const;
/** Recorded bench reference-volume comparison with an explicit correction factor, without an instrument calibration protocol or acceptance criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceVolume, measuredVolume, temperatureFactor } = request;
  const compute = (): Output => {
    H.positive(referenceVolume);
    H.positive(temperatureFactor);
    return {
      correctedReference: referenceVolume * temperatureFactor,
      absoluteError: measuredVolume - referenceVolume * temperatureFactor,
      relativeError: measuredVolume / (referenceVolume * temperatureFactor) - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceVolume: 3, measuredVolume: 2.94, temperatureFactor: 1 },
  output: {
    correctedReference: 3,
    absoluteError: -0.06000000000000005,
    relativeError: -0.020000000000000018,
  },
} satisfies ToolExample<Input, Output>;
export const spirometerCalibrationSyringeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/spirometer-calibration-syringe-gap",
    title: "Spirometer Calibration Syringe Gap Tool",
    description:
      "Recorded bench reference-volume comparison with an explicit correction factor, without an instrument calibration protocol or acceptance criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceVolume: { type: "number", exclusiveMinimum: 0 },
        measuredVolume: { type: "number" },
        temperatureFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["referenceVolume", "measuredVolume", "temperatureFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedReference: { type: "number" },
        absoluteError: { type: "number" },
        relativeError: { type: "number" },
      },
      required: ["correctedReference", "absoluteError", "relativeError"],
    },
    ports: {
      inputs: [
        {
          id: "referenceVolume",
          label: "Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredVolume",
          label: "Measured Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureFactor",
          label: "Temperature Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedReference",
          label: "Corrected Reference",
          valueType: { type: "number" },
        },
        {
          id: "absoluteError",
          label: "Absolute Error",
          valueType: { type: "number" },
        },
        {
          id: "relativeError",
          label: "Relative Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spirometerCalibrationSyringeGapTool.execute;
export default spirometerCalibrationSyringeGapTool;
