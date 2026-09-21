import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly day: number;
  readonly startDay: number;
  readonly endDay: number;
  readonly calendarDays: number;
};
export type Output = {
  readonly withinWindow: boolean;
  readonly daysToStart: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    day: { type: "integer", minimum: 1 },
    startDay: { type: "integer", minimum: 1 },
    endDay: { type: "integer", minimum: 1 },
    calendarDays: { type: "integer", minimum: 1, maximum: 366 },
  },
  required: ["day", "startDay", "endDay", "calendarDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinWindow: { type: "boolean" },
    daysToStart: { type: "integer" },
  },
  required: ["withinWindow", "daysToStart"],
} as const;
/** Inclusive supplied recurring season bounds on an explicit calendar length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { day, startDay, endDay, calendarDays } = request;
  const compute = (): Output => {
    H.integer(calendarDays, 1, 366);
    H.integer(day, 1, calendarDays);
    H.integer(startDay, 1, calendarDays);
    H.integer(endDay, 1, calendarDays);
    return {
      withinWindow:
        startDay <= endDay
          ? day >= startDay && day <= endDay
          : day >= startDay || day <= endDay,
      daysToStart:
        (((startDay - day) % calendarDays) + calendarDays) % calendarDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { day: 10, startDay: 350, endDay: 20, calendarDays: 365 },
  output: { withinWindow: true, daysToStart: 340 },
} satisfies ToolExample<Input, Output>;
export const agriculturalTariffSeasonWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/agricultural-tariff-season-window-gap",
    title: "Agricultural Tariff Season Window Gap Tool",
    description:
      "Inclusive supplied recurring season bounds on an explicit calendar length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        day: { type: "integer", minimum: 1 },
        startDay: { type: "integer", minimum: 1 },
        endDay: { type: "integer", minimum: 1 },
        calendarDays: { type: "integer", minimum: 1, maximum: 366 },
      },
      required: ["day", "startDay", "endDay", "calendarDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinWindow: { type: "boolean" },
        daysToStart: { type: "integer" },
      },
      required: ["withinWindow", "daysToStart"],
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
          id: "calendarDays",
          label: "Calendar Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
        {
          id: "daysToStart",
          label: "Days To Start",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = agriculturalTariffSeasonWindowGapTool.execute;
export default agriculturalTariffSeasonWindowGapTool;
