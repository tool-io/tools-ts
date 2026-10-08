import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly captionId: string;
  readonly suppliedApprovedName: string;
  readonly approvalReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedApprovedName: { type: "string", maxLength: 8192, minLength: 1 },
    approvalReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["captionId", "suppliedApprovedName", "approvalReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit community-approved caption name by approval reference without verifying or granting approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { captionId, suppliedApprovedName, approvalReference } = request;
  const compute = (): Output => {
    H.domain(captionId.length > 0, "captionId");
    H.domain(suppliedApprovedName.length > 0, "suppliedApprovedName");
    H.domain(approvalReference.length > 0, "approvalReference");
    return {
      token: JSON.stringify([
        captionId,
        suppliedApprovedName,
        approvalReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    captionId: "CAP17",
    suppliedApprovedName: "Preferred name A",
    approvalReference: "APP2",
  },
  output: { token: '["CAP17","Preferred name A","APP2"]' },
} satisfies ToolExample<Input, Output>;
export const communityCaptionApprovedNameTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cultural-studies", "cultural studies", "humanities"],
      keywords: ["cultural studies", "humanities"],
    },
    id: "cultural-studies/community-caption-approved-name-token",
    title: "Community Caption Approved Name Token",
    description:
      "Qualify an explicit community-approved caption name by approval reference without verifying or granting approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        captionId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedApprovedName: { type: "string", maxLength: 8192, minLength: 1 },
        approvalReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["captionId", "suppliedApprovedName", "approvalReference"],
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
          id: "captionId",
          label: "Caption Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedApprovedName",
          label: "Supplied Approved Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvalReference",
          label: "Approval Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = communityCaptionApprovedNameTokenTool.execute;
export default communityCaptionApprovedNameTokenTool;
