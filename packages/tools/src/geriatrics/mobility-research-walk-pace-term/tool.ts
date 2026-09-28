import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distanceMeters: number;
  readonly elapsedSeconds: number;
  readonly pausedSeconds: number;
};
export type Output = {
  readonly activeSeconds: number;
  readonly metersPerSecond: number;
  readonly secondsPerMeter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceMeters: { type: "number", exclusiveMinimum: 0 },
    elapsedSeconds: { type: "number" },
    pausedSeconds: { type: "number", minimum: 0 },
  },
  required: ["distanceMeters", "elapsedSeconds", "pausedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeSeconds: { type: "number" },
    metersPerSecond: { type: "number" },
    secondsPerMeter: { type: "number" },
  },
  required: ["activeSeconds", "metersPerSecond", "secondsPerMeter"],
} as const;
/** Observed walk-task pace after explicitly excluded pauses; no mobility or fall-risk threshold is applied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distanceMeters, elapsedSeconds, pausedSeconds } = request;
  const compute = (): Output => {
    H.positive(distanceMeters);
    H.domain(pausedSeconds >= 0 && elapsedSeconds > pausedSeconds);
    return {
      activeSeconds: elapsedSeconds - pausedSeconds,
      metersPerSecond: distanceMeters / (elapsedSeconds - pausedSeconds),
      secondsPerMeter: (elapsedSeconds - pausedSeconds) / distanceMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distanceMeters: 10, elapsedSeconds: 15, pausedSeconds: 5 },
  output: { activeSeconds: 10, metersPerSecond: 1, secondsPerMeter: 1 },
} satisfies ToolExample<Input, Output>;
export const mobilityResearchWalkPaceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/mobility-research-walk-pace-term",
    title: "Mobility Research Walk Pace Term Tool",
    description:
      "Observed walk-task pace after explicitly excluded pauses; no mobility or fall-risk threshold is applied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceMeters: { type: "number", exclusiveMinimum: 0 },
        elapsedSeconds: { type: "number" },
        pausedSeconds: { type: "number", minimum: 0 },
      },
      required: ["distanceMeters", "elapsedSeconds", "pausedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeSeconds: { type: "number" },
        metersPerSecond: { type: "number" },
        secondsPerMeter: { type: "number" },
      },
      required: ["activeSeconds", "metersPerSecond", "secondsPerMeter"],
    },
    ports: {
      inputs: [
        {
          id: "distanceMeters",
          label: "Distance Meters",
          required: true,
          valueType: { type: "number", unit: "m" },
        },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "pausedSeconds",
          label: "Paused Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "activeSeconds",
          label: "Active Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "metersPerSecond",
          label: "Meters Per Second",
          valueType: { type: "number" },
        },
        {
          id: "secondsPerMeter",
          label: "Seconds Per Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mobilityResearchWalkPaceTermTool.execute;
export default mobilityResearchWalkPaceTermTool;
