import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referralId: string;
  readonly documentId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referralId: { type: "string", maxLength: 8192, minLength: 1 },
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["referralId", "documentId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit justice-referral document and version identifiers without retrieving case data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referralId, documentId, version } = request;
  const compute = (): Output => {
    H.domain(referralId.length > 0, "referralId");
    H.domain(documentId.length > 0, "documentId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([referralId, documentId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referralId: "R17", documentId: "D4", version: "v2" },
  output: { token: '["R17","D4","v2"]' },
} satisfies ToolExample<Input, Output>;
export const justiceReferralDocumentVersionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/justice-referral-document-version-pair",
    title: "Justice Referral Document Version Pair",
    description:
      "Record explicit justice-referral document and version identifiers without retrieving case data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referralId: { type: "string", maxLength: 8192, minLength: 1 },
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["referralId", "documentId", "version"],
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
          id: "referralId",
          label: "Referral Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = justiceReferralDocumentVersionPairTool.execute;
export default justiceReferralDocumentVersionPairTool;
