import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly proxySignerId: string;
  readonly authorityDocumentId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    proxySignerId: { type: "string", maxLength: 8192, minLength: 1 },
    authorityDocumentId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "proxySignerId", "authorityDocumentId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicit proxy signature record with a supplied authority-document reference without validating legal authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, proxySignerId, authorityDocumentId } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(proxySignerId.length > 0, "proxySignerId");
    H.domain(authorityDocumentId.length > 0, "authorityDocumentId");
    return {
      token: JSON.stringify([recordId, proxySignerId, authorityDocumentId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", proxySignerId: "S4", authorityDocumentId: "D2" },
  output: { token: '["R17","S4","D2"]' },
} satisfies ToolExample<Input, Output>;
export const proxySignatureAuthorityDocumentReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/proxy-signature-authority-document-reference",
      title: "Proxy Signature Authority Document Reference Tool",
      description:
        "Associate an explicit proxy signature record with a supplied authority-document reference without validating legal authority.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          proxySignerId: { type: "string", maxLength: 8192, minLength: 1 },
          authorityDocumentId: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["recordId", "proxySignerId", "authorityDocumentId"],
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
            id: "proxySignerId",
            label: "Proxy Signer Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "authorityDocumentId",
            label: "Authority Document Id",
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
export const run = proxySignatureAuthorityDocumentReferenceTool.execute;
export default proxySignatureAuthorityDocumentReferenceTool;
