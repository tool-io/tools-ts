import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly reportedUseWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedUseWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "reportedUseWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly reported medicine-use wording and source without estimating adherence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, reportedUseWording, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(reportedUseWording.length > 0, "reportedUseWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([recordId, reportedUseWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    reportedUseWording: "used yesterday",
    source: "Patient report",
  },
  output: { token: '["R17","used yesterday","Patient report"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacyPatientReportedUseTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/pharmacy-patient-reported-use-tag",
    title: "Pharmacy Patient Reported Use Tag",
    description:
      "Preserve explicitly reported medicine-use wording and source without estimating adherence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedUseWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "reportedUseWording", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "reportedUseWording",
          label: "Reported Use Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pharmacyPatientReportedUseTagTool.execute;
export default pharmacyPatientReportedUseTagTool;
