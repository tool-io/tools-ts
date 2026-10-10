import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedContactPreference: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedContactPreference: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedContactPreference", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit reconciliation contact preference and source without initiating contact. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedContactPreference, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedContactPreference.length > 0, "suppliedContactPreference");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([recordId, suppliedContactPreference, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedContactPreference: "text",
    source: "Participant form",
  },
  output: { token: '["R17","text","Participant form"]' },
} satisfies ToolExample<Input, Output>;
export const reconciliationContactPreferenceSourceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["peace-studies", "peace studies", "social sciences"],
        keywords: ["peace studies", "social sciences"],
      },
      id: "peace-studies/reconciliation-contact-preference-source",
      title: "Reconciliation Contact Preference Source",
      description:
        "Preserve an explicit reconciliation contact preference and source without initiating contact.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedContactPreference: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedContactPreference", "source"],
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
            id: "suppliedContactPreference",
            label: "Supplied Contact Preference",
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
export const run = reconciliationContactPreferenceSourceTool.execute;
export default reconciliationContactPreferenceSourceTool;
