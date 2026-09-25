import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  dateOnly,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly year: number;
  readonly month: number;
  readonly day: number;
};
export type Output = {
  readonly occurrence: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1, maximum: 9999 },
    month: { type: "integer", minimum: 1, maximum: 12 },
    day: { type: "integer", minimum: 1, maximum: 31 },
  },
  required: ["year", "month", "day"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrence: { type: "integer" },
    remaining: { type: "integer" },
  },
  required: ["occurrence", "remaining"],
} as const;
/** Compute weekday occurrence remaining in month from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { year, month, day } = input;
  const compute = (): Output => {
    integer(year, 1, 9999);
    integer(month, 1, 12);
    integer(day, 1, 31);
    const d = dateOnly(
        String(year).padStart(4, "0") +
          "-" +
          String(month).padStart(2, "0") +
          "-" +
          String(day).padStart(2, "0"),
      ),
      last = new Date(d.getTime());
    last.setUTCMonth(month, 0);
    return {
      occurrence: Math.floor((day - 1) / 7) + 1,
      remaining: Math.floor((last.getUTCDate() - day) / 7),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2024, month: 2, day: 15 },
  output: { occurrence: 3, remaining: 2 },
} satisfies ToolExample<Input, Output>;
export const weekdayOccurrenceRemainingInMonthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/weekday-occurrence-remaining-in-month",
  title: "Weekday Occurrence Remaining In Month Tool",
  description:
    "Compute weekday occurrence remaining in month from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      {
        id: "day",
        label: "Day",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "occurrence", label: "Occurrence", valueType: { type: "integer" } },
      { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
    ],
  },
});
export const run = weekdayOccurrenceRemainingInMonthTool.execute;
export default weekdayOccurrenceRemainingInMonthTool;
