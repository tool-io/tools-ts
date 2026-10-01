import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly sampleHz: number;
  readonly fftLength: number;
};
export type Output = {
  readonly continuousBin: number;
  readonly nearestBin: number;
  readonly fractionalOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", minimum: 0 },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
    fftLength: { type: "integer", minimum: 1 },
  },
  required: ["frequencyHz", "sampleHz", "fftLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    continuousBin: { type: "number" },
    nearestBin: { type: "integer" },
    fractionalOffset: { type: "number" },
  },
  required: ["continuousBin", "nearestBin", "fractionalOffset"],
} as const;
/** Off-grid spectral-bin position for a supplied sinusoidal frequency, without estimating leakage amplitude or an EEG feature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, sampleHz, fftLength } = request;
  const compute = (): Output => {
    H.positive(sampleHz);
    H.integer(fftLength, 1);
    H.domain(frequencyHz >= 0 && frequencyHz <= sampleHz / 2);
    return {
      continuousBin: (frequencyHz * fftLength) / sampleHz,
      nearestBin: Math.round((frequencyHz * fftLength) / sampleHz),
      fractionalOffset:
        (frequencyHz * fftLength) / sampleHz -
        Math.round((frequencyHz * fftLength) / sampleHz),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyHz: 10.5, sampleHz: 100, fftLength: 100 },
  output: { continuousBin: 10.5, nearestBin: 11, fractionalOffset: -0.5 },
} satisfies ToolExample<Input, Output>;
export const eegSpectralLeakageBinOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-spectral-leakage-bin-offset",
    title: "EEG Spectral Leakage Bin Offset Tool",
    description:
      "Off-grid spectral-bin position for a supplied sinusoidal frequency, without estimating leakage amplitude or an EEG feature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", minimum: 0 },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
        fftLength: { type: "integer", minimum: 1 },
      },
      required: ["frequencyHz", "sampleHz", "fftLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        continuousBin: { type: "number" },
        nearestBin: { type: "integer" },
        fractionalOffset: { type: "number" },
      },
      required: ["continuousBin", "nearestBin", "fractionalOffset"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "fftLength",
          label: "Fft Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "continuousBin",
          label: "Continuous Bin",
          valueType: { type: "number" },
        },
        {
          id: "nearestBin",
          label: "Nearest Bin",
          valueType: { type: "integer" },
        },
        {
          id: "fractionalOffset",
          label: "Fractional Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegSpectralLeakageBinOffsetTool.execute;
export default eegSpectralLeakageBinOffsetTool;
