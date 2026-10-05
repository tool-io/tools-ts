import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly disclosureDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192 },
    disclosureDate: { type: "string", maxLength: 8192 },
  },
  required: ["recordId", "disclosureDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly supplied health-record disclosure date, validating the Gregorian calendar date and making no authorization decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, disclosureDate } = request;
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
    H.domain(recordId.trim().length > 0, "recordId");
    namedDate(disclosureDate, "disclosureDate");
    return { label: recordId + " disclosed " + disclosureDate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R-42", disclosureDate: "2026-10-01" },
  output: { label: "R-42 disclosed 2026-10-01" },
} satisfies ToolExample<Input, Output>;
export const healthRecordDisclosureDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/health-record-disclosure-date-label",
    title: "Health Record Disclosure Date Label Tool",
    description:
      "Format an explicitly supplied health-record disclosure date, validating the Gregorian calendar date and making no authorization decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192 },
        disclosureDate: { type: "string", maxLength: 8192 },
      },
      required: ["recordId", "disclosureDate"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "disclosureDate",
          label: "Disclosure Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = healthRecordDisclosureDateLabelTool.execute;
export default healthRecordDisclosureDateLabelTool;
