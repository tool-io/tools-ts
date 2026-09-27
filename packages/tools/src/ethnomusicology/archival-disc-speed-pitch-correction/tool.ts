import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedPlaybackRpm: number;
  readonly targetPlaybackRpm: number;
  readonly measuredFrequency: number;
  readonly measuredDuration: number;
};
export type Output = {
  readonly speedFactor: number;
  readonly correctedFrequency: number;
  readonly correctedDuration: number;
  readonly centsShift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedPlaybackRpm: { type: "number", exclusiveMinimum: 0 },
    targetPlaybackRpm: { type: "number", exclusiveMinimum: 0 },
    measuredFrequency: { type: "number", exclusiveMinimum: 0 },
    measuredDuration: { type: "number", minimum: 0 },
  },
  required: [
    "recordedPlaybackRpm",
    "targetPlaybackRpm",
    "measuredFrequency",
    "measuredDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speedFactor: { type: "number" },
    correctedFrequency: { type: "number" },
    correctedDuration: { type: "number" },
    centsShift: { type: "number" },
  },
  required: [
    "speedFactor",
    "correctedFrequency",
    "correctedDuration",
    "centsShift",
  ],
} as const;
/** Coupled pitch/time correction for mechanical playback-speed change, not pitch-preserving time stretching. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedPlaybackRpm,
    targetPlaybackRpm,
    measuredFrequency,
    measuredDuration,
  } = request;
  const compute = (): Output => {
    H.positive(recordedPlaybackRpm);
    H.positive(targetPlaybackRpm);
    H.positive(measuredFrequency);
    H.domain(measuredDuration >= 0);
    return {
      speedFactor: targetPlaybackRpm / recordedPlaybackRpm,
      correctedFrequency:
        (measuredFrequency * targetPlaybackRpm) / recordedPlaybackRpm,
      correctedDuration:
        (measuredDuration * recordedPlaybackRpm) / targetPlaybackRpm,
      centsShift: 1200 * Math.log2(targetPlaybackRpm / recordedPlaybackRpm),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedPlaybackRpm: 75,
    targetPlaybackRpm: 78,
    measuredFrequency: 400,
    measuredDuration: 120,
  },
  output: {
    speedFactor: 1.04,
    correctedFrequency: 416,
    correctedDuration: 115.38461538461539,
    centsShift: 67.90023403964102,
  },
} satisfies ToolExample<Input, Output>;
export const archivalDiscSpeedPitchCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/archival-disc-speed-pitch-correction",
    title: "Archival Disc Speed Pitch Correction Tool",
    description:
      "Coupled pitch/time correction for mechanical playback-speed change, not pitch-preserving time stretching.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedPlaybackRpm: { type: "number", exclusiveMinimum: 0 },
        targetPlaybackRpm: { type: "number", exclusiveMinimum: 0 },
        measuredFrequency: { type: "number", exclusiveMinimum: 0 },
        measuredDuration: { type: "number", minimum: 0 },
      },
      required: [
        "recordedPlaybackRpm",
        "targetPlaybackRpm",
        "measuredFrequency",
        "measuredDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speedFactor: { type: "number" },
        correctedFrequency: { type: "number" },
        correctedDuration: { type: "number" },
        centsShift: { type: "number" },
      },
      required: [
        "speedFactor",
        "correctedFrequency",
        "correctedDuration",
        "centsShift",
      ],
    },
    ports: {
      inputs: [
        {
          id: "recordedPlaybackRpm",
          label: "Recorded Playback Rpm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPlaybackRpm",
          label: "Target Playback Rpm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFrequency",
          label: "Measured Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredDuration",
          label: "Measured Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "speedFactor",
          label: "Speed Factor",
          valueType: { type: "number" },
        },
        {
          id: "correctedFrequency",
          label: "Corrected Frequency",
          valueType: { type: "number" },
        },
        {
          id: "correctedDuration",
          label: "Corrected Duration",
          valueType: { type: "number" },
        },
        {
          id: "centsShift",
          label: "Cents Shift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalDiscSpeedPitchCorrectionTool.execute;
export default archivalDiscSpeedPitchCorrectionTool;
