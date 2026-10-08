import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly permissionRecordId: string;
  readonly suppliedScope: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedScope: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "permissionRecordId", "suppliedScope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit ethnographic source consent-scope metadata without establishing consent validity or permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, permissionRecordId, suppliedScope } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(permissionRecordId.length > 0, "permissionRecordId");
    H.domain(suppliedScope.length > 0, "suppliedScope");
    return {
      token: JSON.stringify([sourceId, permissionRecordId, suppliedScope]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "S17",
    permissionRecordId: "P4",
    suppliedScope: "quotation only",
  },
  output: { token: '["S17","P4","quotation only"]' },
} satisfies ToolExample<Input, Output>;
export const ethnographicSourceConsentScopeTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "cultural-anthropology",
          "cultural anthropology",
          "social sciences",
        ],
        keywords: ["cultural anthropology", "social sciences"],
      },
      id: "cultural-anthropology/ethnographic-source-consent-scope-token",
      title: "Ethnographic Source Consent Scope Token",
      description:
        "Preserve explicit ethnographic source consent-scope metadata without establishing consent validity or permission.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
          permissionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedScope: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sourceId", "permissionRecordId", "suppliedScope"],
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
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionRecordId",
            label: "Permission Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedScope",
            label: "Supplied Scope",
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
export const run = ethnographicSourceConsentScopeTokenTool.execute;
export default ethnographicSourceConsentScopeTokenTool;
