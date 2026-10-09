import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signatureRecordId: string;
  readonly roleCode: string;
  readonly authoritySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signatureRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    roleCode: { type: "string", maxLength: 8192, minLength: 1 },
    authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["signatureRecordId", "roleCode", "authoritySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit signature role by its authority source without authenticating a signature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signatureRecordId, roleCode, authoritySource } = request;
  const compute = (): Output => {
    H.domain(signatureRecordId.length > 0, "signatureRecordId");
    H.domain(roleCode.length > 0, "roleCode");
    H.domain(authoritySource.length > 0, "authoritySource");
    return {
      token: JSON.stringify([signatureRecordId, roleCode, authoritySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signatureRecordId: "SIG17",
    roleCode: "reviewer",
    authoritySource: "Delegation record A",
  },
  output: { token: '["SIG17","reviewer","Delegation record A"]' },
} satisfies ToolExample<Input, Output>;
export const gcpSignatureAuthorityRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-signature-authority-role",
    title: "GCP Signature Authority Role",
    description:
      "Qualify an explicit signature role by its authority source without authenticating a signature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signatureRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        roleCode: { type: "string", maxLength: 8192, minLength: 1 },
        authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["signatureRecordId", "roleCode", "authoritySource"],
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
          id: "signatureRecordId",
          label: "Signature Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roleCode",
          label: "Role Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authoritySource",
          label: "Authority Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gcpSignatureAuthorityRoleTool.execute;
export default gcpSignatureAuthorityRoleTool;
