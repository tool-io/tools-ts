import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
};
export type Output = {
  readonly hour: number;
  readonly minute: number;
  readonly dayCarry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer", minimum: 0, maximum: 23 },
    minute: { type: "integer", minimum: 0, maximum: 59 },
    second: { type: "number", minimum: 0, exclusiveMaximum: 60 },
  },
  required: ["hour", "minute", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer" },
    minute: { type: "integer" },
    dayCarry: { type: "integer" },
  },
  required: ["hour", "minute", "dayCarry"],
} as const;
/** Calculate datetime minute rounding day carry from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { hour, minute, second } = input;
  const compute = (): Output => {
    H.integer(hour, 0, 23);
    H.integer(minute, 0, 59);
    H.domain(second >= 0 && second < 60);
    const total = hour * 60 + minute + (second >= 30 ? 1 : 0);
    return {
      hour: Math.floor(total / 60) % 24,
      minute: total % 60,
      dayCarry: Math.floor(total / 1440),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { hour: 23, minute: 59, second: 45 },
  output: { hour: 0, minute: 0, dayCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const datetimeMinuteRoundingDayCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/datetime-minute-rounding-day-carry",
    title: "Datetime Minute Rounding Day Carry Tool",
    description:
      "Calculate datetime minute rounding day carry from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hour: { type: "integer", minimum: 0, maximum: 23 },
        minute: { type: "integer", minimum: 0, maximum: 59 },
        second: { type: "number", minimum: 0, exclusiveMaximum: 60 },
      },
      required: ["hour", "minute", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hour: { type: "integer" },
        minute: { type: "integer" },
        dayCarry: { type: "integer" },
      },
      required: ["hour", "minute", "dayCarry"],
    },
    ports: {
      inputs: [
        {
          id: "hour",
          label: "Hour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minute",
          label: "Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "hour", label: "Hour", valueType: { type: "integer" } },
        { id: "minute", label: "Minute", valueType: { type: "integer" } },
        { id: "dayCarry", label: "Day Carry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = datetimeMinuteRoundingDayCarryTool.execute;
export default datetimeMinuteRoundingDayCarryTool;
