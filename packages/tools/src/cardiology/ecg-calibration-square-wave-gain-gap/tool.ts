import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMillimeters: number;
  readonly nominalMillivolts: number;
  readonly expectedMmPerMv: number;
};
export type Output = {
  readonly observedGain: number;
  readonly relativeGainError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMillimeters: { type: "number", minimum: 0 },
    nominalMillivolts: { type: "number", exclusiveMinimum: 0 },
    expectedMmPerMv: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedMillimeters", "nominalMillivolts", "expectedMmPerMv"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGain: { type: "number" },
    relativeGainError: { type: "number" },
  },
  required: ["observedGain", "relativeGainError"],
} as const;
/** Recorded calibration-mark scale audit against an explicit expected gain, without inferring instrument compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMillimeters, nominalMillivolts, expectedMmPerMv } = request;
  const compute = (): Output => {
    H.domain(observedMillimeters >= 0);
    H.positive(nominalMillivolts);
    H.positive(expectedMmPerMv);
    return {
      observedGain: observedMillimeters / nominalMillivolts,
      relativeGainError:
        observedMillimeters / (nominalMillivolts * expectedMmPerMv) - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMillimeters: 9, nominalMillivolts: 1, expectedMmPerMv: 10 },
  output: { observedGain: 9, relativeGainError: -0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const ecgCalibrationSquareWaveGainGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/ecg-calibration-square-wave-gain-gap",
    title: "ECG Calibration Square Wave Gain Gap Tool",
    description:
      "Recorded calibration-mark scale audit against an explicit expected gain, without inferring instrument compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMillimeters: { type: "number", minimum: 0 },
        nominalMillivolts: { type: "number", exclusiveMinimum: 0 },
        expectedMmPerMv: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedMillimeters", "nominalMillivolts", "expectedMmPerMv"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGain: { type: "number" },
        relativeGainError: { type: "number" },
      },
      required: ["observedGain", "relativeGainError"],
    },
    ports: {
      inputs: [
        {
          id: "observedMillimeters",
          label: "Observed Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nominalMillivolts",
          label: "Nominal Millivolts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedMmPerMv",
          label: "Expected Mm Per Mv",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedGain",
          label: "Observed Gain",
          valueType: { type: "number" },
        },
        {
          id: "relativeGainError",
          label: "Relative Gain Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecgCalibrationSquareWaveGainGapTool.execute;
export default ecgCalibrationSquareWaveGainGapTool;
