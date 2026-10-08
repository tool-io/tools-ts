import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly allowEndOfDay: boolean;
};
export type Output = {
  readonly dayFraction: number;
  readonly nextDayMidnight: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer", minimum: 0, maximum: 24 },
    minute: { type: "integer", minimum: 0, maximum: 59 },
    second: { type: "number", minimum: 0, exclusiveMaximum: 60 },
    allowEndOfDay: { type: "boolean" },
  },
  required: ["hour", "minute", "second", "allowEndOfDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayFraction: { type: "number" },
    nextDayMidnight: { type: "boolean" },
  },
  required: ["dayFraction", "nextDayMidnight"],
} as const;
/** Convert explicit non-leap-second civil clock fields to a day fraction with an explicit 24:00 end-of-day policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hour, minute, second, allowEndOfDay } = request;
  const compute = (): Output => {
    (H.domain(Number.isSafeInteger(hour) && hour >= 0 && hour <= 24, "hour"),
      hour);
    (H.domain(
      Number.isSafeInteger(minute) && minute >= 0 && minute <= 59,
      "minute",
    ),
      minute);
    H.domain(second >= 0 && second < 60, "second");
    H.domain(
      hour < 24 || (allowEndOfDay && minute === 0 && second === 0),
      "hour",
    );
    return {
      dayFraction: (hour * 3600 + minute * 60 + second) / 86400,
      nextDayMidnight: hour === 24,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hour: 12, minute: 0, second: 0, allowEndOfDay: false },
  output: { dayFraction: 0.5, nextDayMidnight: false },
} satisfies ToolExample<Input, Output>;
export const civilDayFractionMidnightPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["date", "computer science"],
      keywords: ["date", "computer science"],
    },
    id: "date/civil-day-fraction-midnight-policy",
    title: "Civil Day Fraction Midnight Policy",
    description:
      "Convert explicit non-leap-second civil clock fields to a day fraction with an explicit 24:00 end-of-day policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hour: { type: "integer", minimum: 0, maximum: 24 },
        minute: { type: "integer", minimum: 0, maximum: 59 },
        second: { type: "number", minimum: 0, exclusiveMaximum: 60 },
        allowEndOfDay: { type: "boolean" },
      },
      required: ["hour", "minute", "second", "allowEndOfDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayFraction: { type: "number" },
        nextDayMidnight: { type: "boolean" },
      },
      required: ["dayFraction", "nextDayMidnight"],
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
        {
          id: "allowEndOfDay",
          label: "Allow End Of Day",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "dayFraction",
          label: "Day Fraction",
          valueType: { type: "number" },
        },
        {
          id: "nextDayMidnight",
          label: "Next Day Midnight",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = civilDayFractionMidnightPolicyTool.execute;
export default civilDayFractionMidnightPolicyTool;
