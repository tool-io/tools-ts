import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly date: string };
export type Output = {
  readonly earliest: string;
  readonly latest: string;
  readonly precision: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { date: { type: "string", maxLength: 8192 } },
  required: ["date"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliest: { type: "string", maxLength: 8192 },
    latest: { type: "string", maxLength: 8192 },
    precision: { type: "string", maxLength: 8192 },
  },
  required: ["earliest", "latest", "precision"],
} as const;
/** Inclusive Gregorian calendar-day envelope for a valid year, year-month or full FHIR date, with no timezone or estimated day inserted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date } = request;
  const compute = (): Output => {
    const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?(?![\s\S])/.exec(date);
    H.domain(match, "date");
    const year = Number(match[1]);
    H.domain(year >= 1);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0),
      days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (!match[2])
      return {
        earliest: match[1] + "-01-01",
        latest: match[1] + "-12-31",
        precision: "year",
      };
    const month = Number(match[2]);
    H.integer(month, 1, 12);
    if (!match[3])
      return {
        earliest: date + "-01",
        latest: date + "-" + days[month - 1],
        precision: "month",
      };
    H.integer(Number(match[3]), 1, days[month - 1]);
    return { earliest: date, latest: date, precision: "day" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { date: "2024-02" },
  output: { earliest: "2024-02-01", latest: "2024-02-29", precision: "month" },
} satisfies ToolExample<Input, Output>;
export const fhirDatePartialPrecisionEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-date-partial-precision-envelope",
    title: "FHIR Date Partial Precision Envelope Tool",
    description:
      "Inclusive Gregorian calendar-day envelope for a valid year, year-month or full FHIR date, with no timezone or estimated day inserted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { date: { type: "string", maxLength: 8192 } },
      required: ["date"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliest: { type: "string", maxLength: 8192 },
        latest: { type: "string", maxLength: 8192 },
        precision: { type: "string", maxLength: 8192 },
      },
      required: ["earliest", "latest", "precision"],
    },
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
        { id: "earliest", label: "Earliest", valueType: { type: "string" } },
        { id: "latest", label: "Latest", valueType: { type: "string" } },
        { id: "precision", label: "Precision", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fhirDatePartialPrecisionEnvelopeTool.execute;
export default fhirDatePartialPrecisionEnvelopeTool;
