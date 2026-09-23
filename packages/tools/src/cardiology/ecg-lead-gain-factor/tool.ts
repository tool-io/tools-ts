import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedAmplitude: number;
  readonly gain: number;
  readonly zeroOffset: number;
};
export type Output = { readonly calibratedAmplitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedAmplitude: { type: "number" },
    gain: { type: "number", exclusiveMinimum: 0 },
    zeroOffset: { type: "number" },
  },
  required: ["recordedAmplitude", "gain", "zeroOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { calibratedAmplitude: { type: "number" } },
  required: ["calibratedAmplitude"],
} as const;
/** Apply supplied bench ECG channel gain and zero calibration without diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedAmplitude, gain, zeroOffset } = request;
  const compute = (): Output => {
    H.positive(gain);
    return { calibratedAmplitude: (recordedAmplitude - zeroOffset) / gain };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedAmplitude: 12, gain: 2, zeroOffset: 2 },
  output: { calibratedAmplitude: 5 },
} satisfies ToolExample<Input, Output>;
export const ecgLeadGainFactorTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "cardiology/ecg-lead-gain-factor",
    title: "ECG Lead Gain Factor Tool",
    description:
      "Apply supplied bench ECG channel gain and zero calibration without diagnostic interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedAmplitude: { type: "number" },
        gain: { type: "number", exclusiveMinimum: 0 },
        zeroOffset: { type: "number" },
      },
      required: ["recordedAmplitude", "gain", "zeroOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { calibratedAmplitude: { type: "number" } },
      required: ["calibratedAmplitude"],
    },
    ports: {
      inputs: [
        {
          id: "recordedAmplitude",
          label: "Recorded Amplitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gain",
          label: "Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroOffset",
          label: "Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calibratedAmplitude",
          label: "Calibrated Amplitude",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecgLeadGainFactorTool.execute;
export default ecgLeadGainFactorTool;
