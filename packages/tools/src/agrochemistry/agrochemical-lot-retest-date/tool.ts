import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly recordedRetestDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    recordedRetestDate: { type: "string", maxLength: 8192 },
  },
  required: ["asOfDate", "recordedRetestDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days until an explicit agrochemical lot retest date without deciding usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, recordedRetestDate } = request;
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
        (namedDate(recordedRetestDate, "recordedRetestDate").getTime() -
          namedDate(asOfDate, "asOfDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asOfDate: "2026-10-28", recordedRetestDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const agrochemicalLotRetestdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/agrochemical-lot-retest-date",
    title: "Agrochemical Lot Retest Date",
    description:
      "Count signed calendar days until an explicit agrochemical lot retest date without deciding usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        recordedRetestDate: { type: "string", maxLength: 8192 },
      },
      required: ["asOfDate", "recordedRetestDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedRetestDate",
          label: "Recorded Retest Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agrochemicalLotRetestdateTool.execute;
export default agrochemicalLotRetestdateTool;
