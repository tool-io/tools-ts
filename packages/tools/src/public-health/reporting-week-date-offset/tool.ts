import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly date: string; readonly weekOrigin: string };
export type Output = {
  readonly days: number;
  readonly weekIndex: number;
  readonly offsetDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    weekOrigin: { type: "string", maxLength: 8192 },
  },
  required: ["date", "weekOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    days: { type: "integer" },
    weekIndex: { type: "integer" },
    offsetDays: { type: "integer" },
  },
  required: ["days", "weekIndex", "offsetDays"],
} as const;
/** Locate a supplied civil date on a seven-day grid anchored by an explicit reporting origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date, weekOrigin } = request;
  const compute = (): Output => {
    return (() => {
      const days =
        (H.dateOnly(date).getTime() - H.dateOnly(weekOrigin).getTime()) /
        86400000;
      return {
        days,
        weekIndex: Math.floor(days / 7),
        offsetDays: H.mod(days, 7),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { date: "2024-01-10", weekOrigin: "2024-01-01" },
  output: { days: 9, weekIndex: 1, offsetDays: 2 },
} satisfies ToolExample<Input, Output>;
export const reportingWeekDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/reporting-week-date-offset",
    title: "Reporting Week Date Offset Tool",
    description:
      "Locate a supplied civil date on a seven-day grid anchored by an explicit reporting origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: "string", maxLength: 8192 },
        weekOrigin: { type: "string", maxLength: 8192 },
      },
      required: ["date", "weekOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        days: { type: "integer" },
        weekIndex: { type: "integer" },
        offsetDays: { type: "integer" },
      },
      required: ["days", "weekIndex", "offsetDays"],
    },
    ports: {
      inputs: [
        {
          id: "date",
          label: "Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "weekOrigin",
          label: "Week Origin",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "days", label: "Days", valueType: { type: "integer" } },
        {
          id: "weekIndex",
          label: "Week Index",
          valueType: { type: "integer" },
        },
        {
          id: "offsetDays",
          label: "Offset Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = reportingWeekDateOffsetTool.execute;
export default reportingWeekDateOffsetTool;
