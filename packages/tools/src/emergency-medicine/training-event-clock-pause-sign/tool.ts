import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly paused: number;
  readonly clockCorrection: number;
};
export type Output = {
  readonly rawDuration: number;
  readonly activeDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    paused: { type: "number", minimum: 0 },
    clockCorrection: { type: "number" },
  },
  required: ["start", "end", "paused", "clockCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawDuration: { type: "number" },
    activeDuration: { type: "number" },
  },
  required: ["rawDuration", "activeDuration"],
} as const;
/** Simulation exercise time bookkeeping only, without emergency care or response-time guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, paused, clockCorrection } = request;
  const compute = (): Output => {
    H.domain(
      end >= start && paused >= 0 && end - start + clockCorrection >= paused,
    );
    return {
      rawDuration: end - start,
      activeDuration: end - start + clockCorrection - paused,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 30, paused: 5, clockCorrection: 1 },
  output: { rawDuration: 20, activeDuration: 16 },
} satisfies ToolExample<Input, Output>;
export const trainingEventClockPauseSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/training-event-clock-pause-sign",
    title: "Training Event Clock Pause Sign Tool",
    description:
      "Simulation exercise time bookkeeping only, without emergency care or response-time guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        paused: { type: "number", minimum: 0 },
        clockCorrection: { type: "number" },
      },
      required: ["start", "end", "paused", "clockCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawDuration: { type: "number" },
        activeDuration: { type: "number" },
      },
      required: ["rawDuration", "activeDuration"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paused",
          label: "Paused",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockCorrection",
          label: "Clock Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawDuration",
          label: "Raw Duration",
          valueType: { type: "number" },
        },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trainingEventClockPauseSignTool.execute;
export default trainingEventClockPauseSignTool;
