import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceReportDate: string;
  readonly recordedReportDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceReportDate: { type: "string", maxLength: 8192 },
    recordedReportDate: { type: "string", maxLength: 8192 },
  },
  required: ["referenceReportDate", "recordedReportDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days between explicit agreement-monitor reporting dates without deciding compliance deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceReportDate, recordedReportDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      signedCalendarDays:
        (namedDate(recordedReportDate, "recordedReportDate").getTime() -
          namedDate(referenceReportDate, "referenceReportDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceReportDate: "2026-10-28",
    recordedReportDate: "2026-11-01",
  },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const agreementMonitorReportingdateDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["peace-studies", "peace studies", "social sciences"],
      keywords: ["peace studies", "social sciences"],
    },
    id: "peace-studies/agreement-monitor-reporting-date-delta",
    title: "Agreement Monitor Reporting Date Delta",
    description:
      "Count signed calendar days between explicit agreement-monitor reporting dates without deciding compliance deadlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceReportDate: { type: "string", maxLength: 8192 },
        recordedReportDate: { type: "string", maxLength: 8192 },
      },
      required: ["referenceReportDate", "recordedReportDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "integer" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "referenceReportDate",
          label: "Reference Report Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedReportDate",
          label: "Recorded Report Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = agreementMonitorReportingdateDeltaTool.execute;
export default agreementMonitorReportingdateDeltaTool;
