import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly sourceId: string;
  readonly verificationRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    verificationRecorded: { type: "boolean" },
  },
  required: ["claimId", "sourceId", "verificationRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit claim-source verification flag without verifying the claim or issuing certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, sourceId, verificationRecorded } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0 && sourceId.length > 0, "claimId");
    return { token: JSON.stringify([claimId, sourceId, verificationRecorded]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "CL17", sourceId: "SRC2", verificationRecorded: true },
  output: { token: '["CL17","SRC2",true]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalSourceVerifiedClaimTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/agricultural-source-verified-claim-tag",
    title: "Agricultural Source Verified Claim Tag",
    description:
      "Record an explicit claim-source verification flag without verifying the claim or issuing certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        verificationRecorded: { type: "boolean" },
      },
      required: ["claimId", "sourceId", "verificationRecorded"],
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
          id: "claimId",
          label: "Claim Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "verificationRecorded",
          label: "Verification Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agriculturalSourceVerifiedClaimTagTool.execute;
export default agriculturalSourceVerifiedClaimTagTool;
