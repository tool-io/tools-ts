import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodMs: number;
  readonly periodUncertaintyMs: number;
};
export type Output = {
  readonly frequencyHz: number;
  readonly beatsPerMinute: number;
  readonly lowerBpm: number;
  readonly upperBpm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodMs: { type: "number", exclusiveMinimum: 0 },
    periodUncertaintyMs: { type: "number", minimum: 0 },
  },
  required: ["periodMs", "periodUncertaintyMs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number" },
    beatsPerMinute: { type: "number" },
    lowerBpm: { type: "number" },
    upperBpm: { type: "number" },
  },
  required: ["frequencyHz", "beatsPerMinute", "lowerBpm", "upperBpm"],
} as const;
/** Interval-to-frequency uncertainty envelope, without determining a normal range or a rhythm diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodMs, periodUncertaintyMs } = request;
  const compute = (): Output => {
    H.positive(periodMs);
    H.domain(periodUncertaintyMs >= 0 && periodUncertaintyMs < periodMs);
    return {
      frequencyHz: 1000 / periodMs,
      beatsPerMinute: 60000 / periodMs,
      lowerBpm: 60000 / (periodMs + periodUncertaintyMs),
      upperBpm: 60000 / (periodMs - periodUncertaintyMs),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { periodMs: 1000, periodUncertaintyMs: 100 },
  output: {
    frequencyHz: 1,
    beatsPerMinute: 60,
    lowerBpm: 54.54545454545455,
    upperBpm: 66.66666666666667,
  },
} satisfies ToolExample<Input, Output>;
export const ecgHeartPeriodFrequencyCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/ecg-heart-period-frequency-crosswalk",
    title: "ECG Heart Period Frequency Crosswalk Tool",
    description:
      "Interval-to-frequency uncertainty envelope, without determining a normal range or a rhythm diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodMs: { type: "number", exclusiveMinimum: 0 },
        periodUncertaintyMs: { type: "number", minimum: 0 },
      },
      required: ["periodMs", "periodUncertaintyMs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number" },
        beatsPerMinute: { type: "number" },
        lowerBpm: { type: "number" },
        upperBpm: { type: "number" },
      },
      required: ["frequencyHz", "beatsPerMinute", "lowerBpm", "upperBpm"],
    },
    ports: {
      inputs: [
        {
          id: "periodMs",
          label: "Period Ms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodUncertaintyMs",
          label: "Period Uncertainty Ms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "beatsPerMinute",
          label: "Beats Per Minute",
          valueType: { type: "number" },
        },
        { id: "lowerBpm", label: "Lower Bpm", valueType: { type: "number" } },
        { id: "upperBpm", label: "Upper Bpm", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ecgHeartPeriodFrequencyCrosswalkTool.execute;
export default ecgHeartPeriodFrequencyCrosswalkTool;
