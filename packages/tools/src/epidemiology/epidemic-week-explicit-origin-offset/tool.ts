import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly day: number;
  readonly originDay: number;
  readonly daysPerWeek: number;
};
export type Output = {
  readonly weekIndex: number;
  readonly dayWithinWeek: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    day: { type: "integer" },
    originDay: { type: "integer" },
    daysPerWeek: { type: "integer", minimum: 1 },
  },
  required: ["day", "originDay", "daysPerWeek"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekIndex: { type: "integer" },
    dayWithinWeek: { type: "integer" },
  },
  required: ["weekIndex", "dayWithinWeek"],
} as const;
/** Zero-based weeks relative to an explicit origin, not an ISO, CDC or jurisdictional epidemiologic week calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { day, originDay, daysPerWeek } = request;
  const compute = (): Output => {
    H.integer(daysPerWeek, 1);
    const elapsed = BigInt(day) - BigInt(originDay),
      divisor = BigInt(daysPerWeek);
    let quotient = elapsed / divisor,
      remainder = elapsed % divisor;
    if (remainder < 0n) {
      quotient--;
      remainder += divisor;
    }
    return { weekIndex: Number(quotient), dayWithinWeek: Number(remainder) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { day: 110, originDay: 100, daysPerWeek: 7 },
  output: { weekIndex: 1, dayWithinWeek: 3 },
} satisfies ToolExample<Input, Output>;
export const epidemicWeekExplicitOriginOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/epidemic-week-explicit-origin-offset",
    title: "Epidemic Week Explicit Origin Offset Tool",
    description:
      "Zero-based weeks relative to an explicit origin, not an ISO, CDC or jurisdictional epidemiologic week calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        day: { type: "integer" },
        originDay: { type: "integer" },
        daysPerWeek: { type: "integer", minimum: 1 },
      },
      required: ["day", "originDay", "daysPerWeek"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekIndex: { type: "integer" },
        dayWithinWeek: { type: "integer" },
      },
      required: ["weekIndex", "dayWithinWeek"],
    },
    ports: {
      inputs: [
        {
          id: "day",
          label: "Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originDay",
          label: "Origin Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "daysPerWeek",
          label: "Days Per Week",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "weekIndex",
          label: "Week Index",
          valueType: { type: "integer" },
        },
        {
          id: "dayWithinWeek",
          label: "Day Within Week",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = epidemicWeekExplicitOriginOffsetTool.execute;
export default epidemicWeekExplicitOriginOffsetTool;
