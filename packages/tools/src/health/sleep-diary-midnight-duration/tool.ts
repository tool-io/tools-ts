import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedMinuteOfDay: number;
  readonly wakeMinuteOfDay: number;
  readonly nextDay: boolean;
};
export type Output = { readonly durationMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedMinuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    wakeMinuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    nextDay: { type: "boolean" },
  },
  required: ["bedMinuteOfDay", "wakeMinuteOfDay", "nextDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationMinutes: { type: "integer" } },
  required: ["durationMinutes"],
} as const;
/** Calculate a sleep-diary clock interval with an explicit next-day flag, assuming a 24-hour civil day without daylight-saving transitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedMinuteOfDay, wakeMinuteOfDay, nextDay } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(bedMinuteOfDay) &&
        bedMinuteOfDay >= 0 &&
        bedMinuteOfDay <= 1439,
      "bedMinuteOfDay",
    ),
      bedMinuteOfDay);
    (H.domain(
      Number.isSafeInteger(wakeMinuteOfDay) &&
        wakeMinuteOfDay >= 0 &&
        wakeMinuteOfDay <= 1439,
      "wakeMinuteOfDay",
    ),
      wakeMinuteOfDay);
    const durationMinutes =
      wakeMinuteOfDay - bedMinuteOfDay + (nextDay ? 1440 : 0);
    H.domain(durationMinutes >= 0, "nextDay");
    return { durationMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedMinuteOfDay: 1380, wakeMinuteOfDay: 420, nextDay: true },
  output: { durationMinutes: 480 },
} satisfies ToolExample<Input, Output>;
export const sleepDiaryMidnightDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/sleep-diary-midnight-duration",
    title: "Sleep Diary Midnight Duration Tool",
    description:
      "Calculate a sleep-diary clock interval with an explicit next-day flag, assuming a 24-hour civil day without daylight-saving transitions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedMinuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        wakeMinuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        nextDay: { type: "boolean" },
      },
      required: ["bedMinuteOfDay", "wakeMinuteOfDay", "nextDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationMinutes: { type: "integer" } },
      required: ["durationMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "bedMinuteOfDay",
          label: "Bed Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "wakeMinuteOfDay",
          label: "Wake Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextDay",
          label: "Next Day",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sleepDiaryMidnightDurationTool.execute;
export default sleepDiaryMidnightDurationTool;
