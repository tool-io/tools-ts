import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordDate: string;
  readonly retentionDays: number;
};
export type Output = { readonly retentionThroughDate: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordDate: { type: "string", maxLength: 8192 },
    retentionDays: { type: "integer", minimum: 0, maximum: 100000 },
  },
  required: ["recordDate", "retentionDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retentionThroughDate: { type: "string", maxLength: 8192 } },
  required: ["retentionThroughDate"],
} as const;
/** Apply an explicit calendar-day retention duration to a security record date without selecting a compliance rule or deleting records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordDate, retentionDays } = request;
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
    (H.domain(
      Number.isSafeInteger(retentionDays) &&
        retentionDays >= 0 &&
        retentionDays <= 100000,
      "retentionDays",
    ),
      retentionDays);
    const d = namedDate(recordDate, "recordDate");
    d.setUTCDate(d.getUTCDate() + retentionDays);
    H.domain(d.getUTCFullYear() <= 9999, "");
    return { retentionThroughDate: d.toISOString().slice(0, 10) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordDate: "2026-11-01", retentionDays: 30 },
  output: { retentionThroughDate: "2026-12-01" },
} satisfies ToolExample<Input, Output>;
export const securityRecordRetentionDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/security-record-retention-date",
    title: "Security Record Retention Date Tool",
    description:
      "Apply an explicit calendar-day retention duration to a security record date without selecting a compliance rule or deleting records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordDate: { type: "string", maxLength: 8192 },
        retentionDays: { type: "integer", minimum: 0, maximum: 100000 },
      },
      required: ["recordDate", "retentionDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { retentionThroughDate: { type: "string", maxLength: 8192 } },
      required: ["retentionThroughDate"],
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
          id: "retentionDays",
          label: "Retention Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "retentionThroughDate",
          label: "Retention Through Date",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = securityRecordRetentionDateTool.execute;
export default securityRecordRetentionDateTool;
