import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly month: number;
  readonly dayKnown: boolean;
  readonly suppliedDay: number;
};
export type Output = { readonly dateText: string; readonly precision: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 0, maximum: 9999 },
    month: { type: "integer", minimum: 1, maximum: 12 },
    dayKnown: { type: "boolean" },
    suppliedDay: { type: "integer", minimum: 0, maximum: 31 },
  },
  required: ["year", "month", "dayKnown", "suppliedDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dateText: { type: "string", maxLength: 8192 },
    precision: { type: "string", maxLength: 8192 },
  },
  required: ["dateText", "precision"],
} as const;
/** Format an explicit year and month with an unknown-day mask or validated supplied day, without imputing month end. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, month, dayKnown, suppliedDay } = request;
  const compute = (): Output => {
    (H.domain(Number.isSafeInteger(year) && year >= 0 && year <= 9999, "year"),
      year);
    (H.domain(
      Number.isSafeInteger(month) && month >= 1 && month <= 12,
      "month",
    ),
      month);
    (H.domain(
      Number.isSafeInteger(suppliedDay) &&
        suppliedDay >= 0 &&
        suppliedDay <= Number.MAX_SAFE_INTEGER,
      "suppliedDay",
    ),
      suppliedDay);
    if (dayKnown) {
      H.domain(suppliedDay >= 1 && suppliedDay <= 31, "suppliedDay");
      const text =
        String(year).padStart(4, "0") +
        "-" +
        String(month).padStart(2, "0") +
        "-" +
        String(suppliedDay).padStart(2, "0");
      const d = new Date(text + "T00:00:00Z");
      H.domain(
        Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === text,
        "suppliedDay",
      );
    } else H.domain(suppliedDay === 0, "suppliedDay");
    return {
      dateText:
        String(year).padStart(4, "0") +
        "-" +
        String(month).padStart(2, "0") +
        "-" +
        (dayKnown ? String(suppliedDay).padStart(2, "0") : "??"),
      precision: dayKnown ? "day" : "month",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 2024, month: 2, dayKnown: false, suppliedDay: 0 },
  output: { dateText: "2024-02-??", precision: "month" },
} satisfies ToolExample<Input, Output>;
export const endOfMonthUnknownDayMaskTool = H.defineSchemaCalculation<
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
    id: "date/end-of-month-unknown-day-mask",
    title: "End Of Month Unknown Day Mask",
    description:
      "Format an explicit year and month with an unknown-day mask or validated supplied day, without imputing month end.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer", minimum: 0, maximum: 9999 },
        month: { type: "integer", minimum: 1, maximum: 12 },
        dayKnown: { type: "boolean" },
        suppliedDay: { type: "integer", minimum: 0, maximum: 31 },
      },
      required: ["year", "month", "dayKnown", "suppliedDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dateText: { type: "string", maxLength: 8192 },
        precision: { type: "string", maxLength: 8192 },
      },
      required: ["dateText", "precision"],
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
        {
          id: "dayKnown",
          label: "Day Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedDay",
          label: "Supplied Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "dateText", label: "Date Text", valueType: { type: "string" } },
        { id: "precision", label: "Precision", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = endOfMonthUnknownDayMaskTool.execute;
export default endOfMonthUnknownDayMaskTool;
