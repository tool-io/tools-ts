import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly claimWording: string;
  readonly consentSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    claimWording: { type: "string", maxLength: 8192, minLength: 1 },
    consentSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "claimWording", "consentSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit claim-discussion wording with a supplied consent source without deciding consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, claimWording, consentSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(claimWording.length > 0, "claimWording");
    H.domain(consentSource.length > 0, "consentSource");
    return { token: JSON.stringify([recordId, claimWording, consentSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    claimWording: "claim discussed",
    consentSource: "Signed form A",
  },
  output: { token: '["R17","claim discussed","Signed form A"]' },
} satisfies ToolExample<Input, Output>;
export const naturopathyConsentClaimLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["naturopathy", "health and medicine"],
      keywords: ["naturopathy", "health and medicine"],
    },
    id: "naturopathy/naturopathy-consent-claim-label",
    title: "Naturopathy Consent Claim Label",
    description:
      "Preserve explicit claim-discussion wording with a supplied consent source without deciding consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        claimWording: { type: "string", maxLength: 8192, minLength: 1 },
        consentSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "claimWording", "consentSource"],
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
          id: "claimWording",
          label: "Claim Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consentSource",
          label: "Consent Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = naturopathyConsentClaimLabelTool.execute;
export default naturopathyConsentClaimLabelTool;
