import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordDate: string;
  readonly suppliedRetentionEndDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordDate: { type: "string", maxLength: 8192 },
    suppliedRetentionEndDate: { type: "string", maxLength: 8192 },
  },
  required: ["recordDate", "suppliedRetentionEndDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days between explicit visitor record and retention-end dates without selecting a retention policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordDate, suppliedRetentionEndDate } = request;
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
          suppliedRetentionEndDate,
          "suppliedRetentionEndDate",
        ).getTime() -
          namedDate(recordDate, "recordDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordDate: "2026-10-28", suppliedRetentionEndDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const biosecurityVisitorRecordRetentionOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["biosecurity", "research and quality management"],
        keywords: ["biosecurity", "research and quality management"],
      },
      id: "biosecurity/biosecurity-visitor-record-retention-offset",
      title: "Biosecurity Visitor Record Retention Offset",
      description:
        "Count signed calendar days between explicit visitor record and retention-end dates without selecting a retention policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordDate: { type: "string", maxLength: 8192 },
          suppliedRetentionEndDate: { type: "string", maxLength: 8192 },
        },
        required: ["recordDate", "suppliedRetentionEndDate"],
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
            id: "recordDate",
            label: "Record Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRetentionEndDate",
            label: "Supplied Retention End Date",
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
export const run = biosecurityVisitorRecordRetentionOffsetTool.execute;
export default biosecurityVisitorRecordRetentionOffsetTool;
