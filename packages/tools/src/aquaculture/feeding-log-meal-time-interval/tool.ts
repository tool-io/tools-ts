import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousMealMinute: number;
  readonly nextMealMinute: number;
};
export type Output = { readonly elapsedMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousMealMinute: { type: "number" },
    nextMealMinute: { type: "number" },
  },
  required: ["previousMealMinute", "nextMealMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedMinutes: { type: "number" } },
  required: ["elapsedMinutes"],
} as const;
/** Subtract monotonic elapsed-minute meal timestamps; midnight crossings require explicitly unwrapped minute values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousMealMinute, nextMealMinute } = request;
  const compute = (): Output => {
    H.domain(nextMealMinute >= previousMealMinute, "nextMealMinute");
    return { elapsedMinutes: nextMealMinute - previousMealMinute };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousMealMinute: 480, nextMealMinute: 720 },
  output: { elapsedMinutes: 240 },
} satisfies ToolExample<Input, Output>;
export const feedingLogMealTimeIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/feeding-log-meal-time-interval",
    title: "Feeding Log Meal Time Interval",
    description:
      "Subtract monotonic elapsed-minute meal timestamps; midnight crossings require explicitly unwrapped minute values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousMealMinute: { type: "number" },
        nextMealMinute: { type: "number" },
      },
      required: ["previousMealMinute", "nextMealMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedMinutes: { type: "number" } },
      required: ["elapsedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "previousMealMinute",
          label: "Previous Meal Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextMealMinute",
          label: "Next Meal Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedingLogMealTimeIntervalTool.execute;
export default feedingLogMealTimeIntervalTool;
