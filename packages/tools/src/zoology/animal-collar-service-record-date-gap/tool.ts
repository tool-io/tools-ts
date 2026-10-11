import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly serviceDate: string; readonly asOfDate: string };
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["serviceDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed calendar days since a supplied animal-collar service record without selecting service intervals or animal-use procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceDate, asOfDate } = request;
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
        (namedDate(asOfDate, "asOfDate").getTime() -
          namedDate(serviceDate, "serviceDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { serviceDate: "2026-10-28", asOfDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const animalCollarServiceRecordDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-collar-service-record-date-gap",
    title: "Animal Collar Service Record Date Gap Tool",
    description:
      "Measure signed calendar days since a supplied animal-collar service record without selecting service intervals or animal-use procedures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["serviceDate", "asOfDate"],
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
          id: "serviceDate",
          label: "Service Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
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
export const run = animalCollarServiceRecordDateGapTool.execute;
export default animalCollarServiceRecordDateGapTool;
