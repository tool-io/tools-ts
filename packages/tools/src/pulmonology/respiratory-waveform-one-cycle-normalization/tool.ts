import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly cycleStart: number;
  readonly cycleEnd: number;
  readonly amplitude: number;
  readonly baseline: number;
  readonly referenceAmplitude: number;
};
export type Output = {
  readonly phase: number;
  readonly normalizedAmplitude: number;
  readonly insideCycle: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    cycleStart: { type: "number" },
    cycleEnd: { type: "number" },
    amplitude: { type: "number" },
    baseline: { type: "number" },
    referenceAmplitude: { type: "number" },
  },
  required: [
    "time",
    "cycleStart",
    "cycleEnd",
    "amplitude",
    "baseline",
    "referenceAmplitude",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phase: { type: "number" },
    normalizedAmplitude: { type: "number" },
    insideCycle: { type: "boolean" },
  },
  required: ["phase", "normalizedAmplitude", "insideCycle"],
} as const;
/** Unclipped supplied-cycle phase and amplitude normalization with half-open cycle membership, without breath detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    time,
    cycleStart,
    cycleEnd,
    amplitude,
    baseline,
    referenceAmplitude,
  } = request;
  const compute = (): Output => {
    H.domain(cycleEnd > cycleStart && referenceAmplitude !== 0);
    return {
      phase: (time - cycleStart) / (cycleEnd - cycleStart),
      normalizedAmplitude: (amplitude - baseline) / referenceAmplitude,
      insideCycle: time >= cycleStart && time < cycleEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 2,
    cycleStart: 1,
    cycleEnd: 5,
    amplitude: 8,
    baseline: 2,
    referenceAmplitude: 3,
  },
  output: { phase: 0.25, normalizedAmplitude: 2, insideCycle: true },
} satisfies ToolExample<Input, Output>;
export const respiratoryWaveformOneCycleNormalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pulmonology/respiratory-waveform-one-cycle-normalization",
      title: "Respiratory Waveform One Cycle Normalization Tool",
      description:
        "Unclipped supplied-cycle phase and amplitude normalization with half-open cycle membership, without breath detection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          time: { type: "number" },
          cycleStart: { type: "number" },
          cycleEnd: { type: "number" },
          amplitude: { type: "number" },
          baseline: { type: "number" },
          referenceAmplitude: { type: "number" },
        },
        required: [
          "time",
          "cycleStart",
          "cycleEnd",
          "amplitude",
          "baseline",
          "referenceAmplitude",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          phase: { type: "number" },
          normalizedAmplitude: { type: "number" },
          insideCycle: { type: "boolean" },
        },
        required: ["phase", "normalizedAmplitude", "insideCycle"],
      },
      ports: {
        inputs: [
          {
            id: "time",
            label: "Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cycleStart",
            label: "Cycle Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cycleEnd",
            label: "Cycle End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "amplitude",
            label: "Amplitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseline",
            label: "Baseline",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceAmplitude",
            label: "Reference Amplitude",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "phase", label: "Phase", valueType: { type: "number" } },
          {
            id: "normalizedAmplitude",
            label: "Normalized Amplitude",
            valueType: { type: "number" },
          },
          {
            id: "insideCycle",
            label: "Inside Cycle",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = respiratoryWaveformOneCycleNormalizationTool.execute;
export default respiratoryWaveformOneCycleNormalizationTool;
