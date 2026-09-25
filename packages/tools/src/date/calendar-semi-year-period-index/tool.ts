import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly year: number; readonly month: number };
export type Output = { readonly half: number; readonly periodKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1, maximum: 9999 },
    month: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: ["year", "month"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    half: { type: "integer" },
    periodKey: { type: "string", maxLength: 8192 },
  },
  required: ["half", "periodKey"],
} as const;
/** Calculate calendar semi year period index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, month } = request;
  const compute = (): Output => {
    H.integer(year, 1, 9999);
    H.integer(month, 1, 12);
    return {
      half: month <= 6 ? 1 : 2,
      periodKey: year + "-H" + (month <= 6 ? 1 : 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 2026, month: 6 },
  output: { half: 1, periodKey: "2026-H1" },
} satisfies ToolExample<Input, Output>;
export const calendarSemiYearPeriodIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/calendar-semi-year-period-index",
    title: "Calendar Semi Year Period Index Tool",
    description:
      "Calculate calendar semi year period index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer", minimum: 1, maximum: 9999 },
        month: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: ["year", "month"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        half: { type: "integer" },
        periodKey: { type: "string", maxLength: 8192 },
      },
      required: ["half", "periodKey"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "month",
          label: "Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "half", label: "Half", valueType: { type: "integer" } },
        { id: "periodKey", label: "Period Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = calendarSemiYearPeriodIndexTool.execute;
export default calendarSemiYearPeriodIndexTool;
