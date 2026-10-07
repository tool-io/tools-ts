import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly medicationText: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    medicationText: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "medicationText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit medication wording by reconciliation source without resolving discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, medicationText, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(medicationText.length > 0, "medicationText");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([recordId, medicationText, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    medicationText: "Medicine A",
    source: "Patient list",
  },
  output: { token: '["R17","Medicine A","Patient list"]' },
} satisfies ToolExample<Input, Output>;
export const medicationReconciliationSourceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
        keywords: ["clinical pharmacy", "pharmacy"],
      },
      id: "clinical-pharmacy/medication-reconciliation-source-label",
      title: "Medication Reconciliation Source Label",
      description:
        "Qualify explicit medication wording by reconciliation source without resolving discrepancies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          medicationText: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "medicationText", "source"],
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
            id: "medicationText",
            label: "Medication Text",
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
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = medicationReconciliationSourceLabelTool.execute;
export default medicationReconciliationSourceLabelTool;
