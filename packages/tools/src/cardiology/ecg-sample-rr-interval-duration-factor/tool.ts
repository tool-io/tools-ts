import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPeak: number;
  readonly secondPeak: number;
  readonly sampleHz: number;
};
export type Output = {
  readonly samples: number;
  readonly seconds: number;
  readonly beatsPerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPeak: { type: "integer", minimum: 0 },
    secondPeak: { type: "integer" },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstPeak", "secondPeak", "sampleHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: { type: "integer" },
    seconds: { type: "number" },
    beatsPerMinute: { type: "number" },
  },
  required: ["samples", "seconds", "beatsPerMinute"],
} as const;
/** One interval from supplied ECG peak sample indices; no peak detection, rhythm classification or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPeak, secondPeak, sampleHz } = request;
  const compute = (): Output => {
    H.integer(firstPeak, 0);
    H.integer(secondPeak, firstPeak + 1);
    H.positive(sampleHz);
    return {
      samples: secondPeak - firstPeak,
      seconds: (secondPeak - firstPeak) / sampleHz,
      beatsPerMinute: (60 * sampleHz) / (secondPeak - firstPeak),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPeak: 100, secondPeak: 600, sampleHz: 500 },
  output: { samples: 500, seconds: 1, beatsPerMinute: 60 },
} satisfies ToolExample<Input, Output>;
export const ecgSampleRrIntervalDurationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/ecg-sample-rr-interval-duration-factor",
    title: "ECG Sample RR Interval Duration Factor Tool",
    description:
      "One interval from supplied ECG peak sample indices; no peak detection, rhythm classification or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPeak: { type: "integer", minimum: 0 },
        secondPeak: { type: "integer" },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstPeak", "secondPeak", "sampleHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samples: { type: "integer" },
        seconds: { type: "number" },
        beatsPerMinute: { type: "number" },
      },
      required: ["samples", "seconds", "beatsPerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "firstPeak",
          label: "First Peak",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondPeak",
          label: "Second Peak",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
      ],
      outputs: [
        { id: "samples", label: "Samples", valueType: { type: "integer" } },
        { id: "seconds", label: "Seconds", valueType: { type: "number" } },
        {
          id: "beatsPerMinute",
          label: "Beats Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecgSampleRrIntervalDurationFactorTool.execute;
export default ecgSampleRrIntervalDurationFactorTool;
