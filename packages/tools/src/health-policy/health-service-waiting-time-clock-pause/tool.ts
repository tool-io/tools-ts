import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDay: number;
  readonly endDay: number;
  readonly pausedDays: number;
  readonly excludedDays: number;
  readonly overlappingExclusions: number;
};
export type Output = {
  readonly elapsed: number;
  readonly counted: number;
  readonly pausedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDay: { type: "integer" },
    endDay: { type: "integer" },
    pausedDays: { type: "integer", minimum: 0 },
    excludedDays: { type: "integer", minimum: 0 },
    overlappingExclusions: { type: "integer", minimum: 0 },
  },
  required: [
    "startDay",
    "endDay",
    "pausedDays",
    "excludedDays",
    "overlappingExclusions",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "integer" },
    counted: { type: "integer" },
    pausedFraction: { type: "number" },
  },
  required: ["elapsed", "counted", "pausedFraction"],
} as const;
/** Calculate health service waiting time clock pause from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDay, endDay, pausedDays, excludedDays, overlappingExclusions } =
    request;
  const compute = (): Output => {
    H.domain(endDay > startDay);
    H.integer(pausedDays, 0);
    H.integer(excludedDays, 0);
    H.integer(overlappingExclusions, 0, Math.min(pausedDays, excludedDays));
    H.domain(
      pausedDays + excludedDays - overlappingExclusions <= endDay - startDay,
    );
    return {
      elapsed: endDay - startDay,
      counted:
        endDay - startDay - pausedDays - excludedDays + overlappingExclusions,
      pausedFraction: pausedDays / (endDay - startDay),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startDay: 100,
    endDay: 150,
    pausedDays: 10,
    excludedDays: 5,
    overlappingExclusions: 2,
  },
  output: { elapsed: 50, counted: 37, pausedFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const healthServiceWaitingTimeClockPauseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/health-service-waiting-time-clock-pause",
    title: "Health Service Waiting Time Clock Pause Tool",
    description:
      "Calculate health service waiting time clock pause from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDay: { type: "integer" },
        endDay: { type: "integer" },
        pausedDays: { type: "integer", minimum: 0 },
        excludedDays: { type: "integer", minimum: 0 },
        overlappingExclusions: { type: "integer", minimum: 0 },
      },
      required: [
        "startDay",
        "endDay",
        "pausedDays",
        "excludedDays",
        "overlappingExclusions",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "integer" },
        counted: { type: "integer" },
        pausedFraction: { type: "number" },
      },
      required: ["elapsed", "counted", "pausedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "startDay",
          label: "Start Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endDay",
          label: "End Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pausedDays",
          label: "Paused Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedDays",
          label: "Excluded Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlappingExclusions",
          label: "Overlapping Exclusions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "integer" } },
        { id: "counted", label: "Counted", valueType: { type: "integer" } },
        {
          id: "pausedFraction",
          label: "Paused Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthServiceWaitingTimeClockPauseTool.execute;
export default healthServiceWaitingTimeClockPauseTool;
