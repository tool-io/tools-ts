import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  dateOnly,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly date: string };
export type Output = { readonly quarter: number; readonly day: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { date: { type: "string", maxLength: 8192 } },
  required: ["date"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quarter: { type: "integer" }, day: { type: "integer" } },
  required: ["quarter", "day"],
} as const;
/** Compute calendar quarter day position from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { date } = input;
  const compute = (): Output => {
    const d = dateOnly(date),
      month = d.getUTCMonth(),
      start = new Date(d.getTime());
    start.setUTCMonth(Math.floor(month / 3) * 3, 1);
    return {
      quarter: Math.floor(month / 3) + 1,
      day: (d.getTime() - start.getTime()) / 86400000 + 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { date: "2024-04-01" },
  output: { quarter: 2, day: 1 },
} satisfies ToolExample<Input, Output>;
export const calendarQuarterDayPositionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/calendar-quarter-day-position",
  title: "Calendar Quarter Day Position Tool",
  description:
    "Compute calendar quarter day position from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "date",
        label: "Date",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "quarter", label: "Quarter", valueType: { type: "integer" } },
      { id: "day", label: "Day", valueType: { type: "integer" } },
    ],
  },
});
export const run = calendarQuarterDayPositionTool.execute;
export default calendarQuarterDayPositionTool;
