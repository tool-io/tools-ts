import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDueDate: string;
  readonly recordedReturnDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDueDate: { type: "string", maxLength: 8192 },
    recordedReturnDate: { type: "string", maxLength: 8192 },
  },
  required: ["suppliedDueDate", "recordedReturnDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days from an explicit library due date to return date without applying fines or closure calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDueDate, recordedReturnDate } = request;
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
        (namedDate(recordedReturnDate, "recordedReturnDate").getTime() -
          namedDate(suppliedDueDate, "suppliedDueDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedDueDate: "2026-10-28", recordedReturnDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const libraryCirculationDueReturnGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "library-science",
        "library science",
        "information and language sciences",
      ],
      keywords: ["library science", "information and language sciences"],
    },
    id: "library-science/library-circulation-due-return-gap",
    title: "Library Circulation Due Return Gap",
    description:
      "Count signed calendar days from an explicit library due date to return date without applying fines or closure calendars.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedDueDate: { type: "string", maxLength: 8192 },
        recordedReturnDate: { type: "string", maxLength: 8192 },
      },
      required: ["suppliedDueDate", "recordedReturnDate"],
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
          id: "suppliedDueDate",
          label: "Supplied Due Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedReturnDate",
          label: "Recorded Return Date",
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
export const run = libraryCirculationDueReturnGapTool.execute;
export default libraryCirculationDueReturnGapTool;
