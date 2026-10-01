import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly delaySamples: number;
  readonly sampleHz: number;
  readonly compensate: boolean;
};
export type Output = {
  readonly shiftedIndex: number;
  readonly timeShiftSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer", minimum: 0 },
    delaySamples: { type: "number" },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
    compensate: { type: "boolean" },
  },
  required: ["sampleIndex", "delaySamples", "sampleHz", "compensate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedIndex: { type: "number" },
    timeShiftSeconds: { type: "number" },
  },
  required: ["shiftedIndex", "timeShiftSeconds"],
} as const;
/** Explicit supplied filter group-delay shift, preserving fractional sample positions rather than silently rounding event timing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIndex, delaySamples, sampleHz, compensate } = request;
  const compute = (): Output => {
    H.integer(sampleIndex, 0);
    H.positive(sampleHz);
    return {
      shiftedIndex: sampleIndex + (compensate ? -delaySamples : delaySamples),
      timeShiftSeconds: (compensate ? -delaySamples : delaySamples) / sampleHz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIndex: 1000,
    delaySamples: 25,
    sampleHz: 500,
    compensate: true,
  },
  output: { shiftedIndex: 975, timeShiftSeconds: -0.05 },
} satisfies ToolExample<Input, Output>;
export const eegFilterDelaySampleShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-filter-delay-sample-shift",
    title: "EEG Filter Delay Sample Shift Tool",
    description:
      "Explicit supplied filter group-delay shift, preserving fractional sample positions rather than silently rounding event timing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndex: { type: "integer", minimum: 0 },
        delaySamples: { type: "number" },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
        compensate: { type: "boolean" },
      },
      required: ["sampleIndex", "delaySamples", "sampleHz", "compensate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedIndex: { type: "number" },
        timeShiftSeconds: { type: "number" },
      },
      required: ["shiftedIndex", "timeShiftSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delaySamples",
          label: "Delay Samples",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "compensate",
          label: "Compensate",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "shiftedIndex",
          label: "Shifted Index",
          valueType: { type: "number" },
        },
        {
          id: "timeShiftSeconds",
          label: "Time Shift Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegFilterDelaySampleShiftTool.execute;
export default eegFilterDelaySampleShiftTool;
