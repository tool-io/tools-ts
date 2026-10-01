import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minuteOfDay: number;
  readonly shiftMinutes: number;
};
export type Output = {
  readonly minuteOfDay: number;
  readonly dayCarry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    shiftMinutes: { type: "integer" },
  },
  required: ["minuteOfDay", "shiftMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer" },
    dayCarry: { type: "integer" },
  },
  required: ["minuteOfDay", "dayCarry"],
} as const;
/** Calculate navigation watch time midnight carry from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minuteOfDay, shiftMinutes } = request;
  const compute = (): Output => {
    H.integer(minuteOfDay, 0, 1439);
    const total = minuteOfDay + shiftMinutes;
    return {
      minuteOfDay: H.mod(total, 1440),
      dayCarry: Math.floor(total / 1440),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minuteOfDay: 1380, shiftMinutes: 120 },
  output: { minuteOfDay: 60, dayCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const navigationWatchTimeMidnightCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/navigation-watch-time-midnight-carry",
    title: "Navigation Watch Time Midnight Carry Tool",
    description:
      "Calculate navigation watch time midnight carry from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        shiftMinutes: { type: "integer" },
      },
      required: ["minuteOfDay", "shiftMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer" },
        dayCarry: { type: "integer" },
      },
      required: ["minuteOfDay", "dayCarry"],
    },
    ports: {
      inputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shiftMinutes",
          label: "Shift Minutes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          valueType: { type: "integer" },
        },
        { id: "dayCarry", label: "Day Carry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = navigationWatchTimeMidnightCarryTool.execute;
export default navigationWatchTimeMidnightCarryTool;
