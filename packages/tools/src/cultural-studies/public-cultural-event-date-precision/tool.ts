import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly precision: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1, maximum: 9999 },
    month: { type: "integer", minimum: 0, maximum: 12 },
    day: { type: "integer", minimum: 0, maximum: 31 },
    precision: {
      type: "string",
      maxLength: 8192,
      enum: ["year", "month", "day"],
    },
  },
  required: ["year", "month", "day", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a public cultural-event date at supplied year, month or day precision. Unknown lower fields must be zero rather than fabricated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, month, day, precision } = request;
  const compute = (): Output => {
    (H.domain(Number.isSafeInteger(year) && year >= 1 && year <= 9999, "year"),
      year);
    H.domain(["year", "month", "day"].includes(precision), "precision");
    const y = String(year).padStart(4, "0");
    if (precision === "year") {
      H.domain(month === 0 && day === 0, "month");
      return { label: y };
    }
    (H.domain(
      Number.isSafeInteger(month) && month >= 1 && month <= 12,
      "month",
    ),
      month);
    const ym = y + "-" + String(month).padStart(2, "0");
    if (precision === "month") {
      H.domain(day === 0, "day");
      return { label: ym };
    }
    const label =
      ym +
      "-" +
      String(
        (H.domain(Number.isSafeInteger(day) && day >= 1 && day <= 31, "day"),
        day),
      ).padStart(2, "0");
    const parsed = new Date(label + "T00:00:00Z");
    H.domain(
      Number.isFinite(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === label,
      "day",
    );
    return { label };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 2026, month: 10, day: 0, precision: "month" },
  output: { label: "2026-10" },
} satisfies ToolExample<Input, Output>;
export const publicCulturalEventDatePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/public-cultural-event-date-precision",
    title: "Public Cultural Event Date Precision Tool",
    description:
      "Format a public cultural-event date at supplied year, month or day precision. Unknown lower fields must be zero rather than fabricated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer", minimum: 1, maximum: 9999 },
        month: { type: "integer", minimum: 0, maximum: 12 },
        day: { type: "integer", minimum: 0, maximum: 31 },
        precision: {
          type: "string",
          maxLength: 8192,
          enum: ["year", "month", "day"],
        },
      },
      required: ["year", "month", "day", "precision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
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
          id: "day",
          label: "Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "precision",
          label: "Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicCulturalEventDatePrecisionTool.execute;
export default publicCulturalEventDatePrecisionTool;
