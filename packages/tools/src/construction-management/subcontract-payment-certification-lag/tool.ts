import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submissionDate: string;
  readonly certificationDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submissionDate: { type: "string", maxLength: 8192 },
    certificationDate: { type: "string", maxLength: 8192 },
  },
  required: ["submissionDate", "certificationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Measure signed calendar days between supplied subcontract payment submission and certification dates without legal deadline rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { submissionDate, certificationDate } = request;
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
        (namedDate(certificationDate, "certificationDate").getTime() -
          namedDate(submissionDate, "submissionDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { submissionDate: "2026-10-28", certificationDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const subcontractPaymentCertificationLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/subcontract-payment-certification-lag",
    title: "Subcontract Payment Certification Lag",
    description:
      "Measure signed calendar days between supplied subcontract payment submission and certification dates without legal deadline rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        submissionDate: { type: "string", maxLength: 8192 },
        certificationDate: { type: "string", maxLength: 8192 },
      },
      required: ["submissionDate", "certificationDate"],
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
          id: "submissionDate",
          label: "Submission Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "certificationDate",
          label: "Certification Date",
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
export const run = subcontractPaymentCertificationLagTool.execute;
export default subcontractPaymentCertificationLagTool;
