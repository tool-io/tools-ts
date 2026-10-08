import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weekYear: number;
  readonly week: number;
  readonly weekday: number;
};
export type Output = { readonly weekDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekYear: { type: "integer", minimum: 0, maximum: 9999 },
    week: { type: "integer", minimum: 1, maximum: 53 },
    weekday: { type: "integer", minimum: 1, maximum: 7 },
  },
  required: ["weekYear", "week", "weekday"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weekDate: { type: "string", maxLength: 8192 } },
  required: ["weekDate"],
} as const;
/** Format explicit ISO week-date fields, validating the year-specific existence of week 53 without deriving the fields from a date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weekYear, week, weekday } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(weekYear) && weekYear >= 0 && weekYear <= 9999,
      "weekYear",
    ),
      weekYear);
    (H.domain(Number.isSafeInteger(week) && week >= 1 && week <= 53, "week"),
      week);
    (H.domain(
      Number.isSafeInteger(weekday) && weekday >= 1 && weekday <= 7,
      "weekday",
    ),
      weekday);
    const jan1 = new Date(
      String(weekYear).padStart(4, "0") + "-01-01T00:00:00Z",
    );
    const day = jan1.getUTCDay();
    const leap =
      weekYear % 4 === 0 && (weekYear % 100 !== 0 || weekYear % 400 === 0);
    H.domain(week <= 52 || day === 4 || (day === 3 && leap), "week");
    return {
      weekDate:
        String(weekYear).padStart(4, "0") +
        "-W" +
        String(week).padStart(2, "0") +
        "-" +
        weekday,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weekYear: 2026, week: 44, weekday: 7 },
  output: { weekDate: "2026-W44-7" },
} satisfies ToolExample<Input, Output>;
export const isoWeekDateFieldFormatterTool = H.defineSchemaCalculation<
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
    id: "date/iso-week-date-field-formatter",
    title: "ISO Week Date Field Formatter",
    description:
      "Format explicit ISO week-date fields, validating the year-specific existence of week 53 without deriving the fields from a date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekYear: { type: "integer", minimum: 0, maximum: 9999 },
        week: { type: "integer", minimum: 1, maximum: 53 },
        weekday: { type: "integer", minimum: 1, maximum: 7 },
      },
      required: ["weekYear", "week", "weekday"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weekDate: { type: "string", maxLength: 8192 } },
      required: ["weekDate"],
    },
    ports: {
      inputs: [
        {
          id: "weekYear",
          label: "Week Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "week",
          label: "Week",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "weekday",
          label: "Weekday",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weekDate", label: "Week Date", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = isoWeekDateFieldFormatterTool.execute;
export default isoWeekDateFieldFormatterTool;
