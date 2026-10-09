import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly recordedValidityEndDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    recordedValidityEndDate: { type: "string", maxLength: 8192 },
  },
  required: ["asOfDate", "recordedValidityEndDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days to an explicit instrument validity-end record without deciding qualification status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, recordedValidityEndDate } = request;
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
        (namedDate(
          recordedValidityEndDate,
          "recordedValidityEndDate",
        ).getTime() -
          namedDate(asOfDate, "asOfDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asOfDate: "2026-10-28", recordedValidityEndDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const glpInstrumentValidityDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "glp",
        "good laboratory practice",
        "research and quality management",
      ],
      keywords: [
        "good laboratory practice",
        "research and quality management",
        "GLP",
      ],
    },
    id: "glp/glp-instrument-validity-date",
    title: "GLP Instrument Validity Date",
    description:
      "Count signed calendar days to an explicit instrument validity-end record without deciding qualification status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        recordedValidityEndDate: { type: "string", maxLength: 8192 },
      },
      required: ["asOfDate", "recordedValidityEndDate"],
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
          id: "recordedValidityEndDate",
          label: "Recorded Validity End Date",
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
export const run = glpInstrumentValidityDateTool.execute;
export default glpInstrumentValidityDateTool;
