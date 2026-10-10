import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly approvalReference: string;
  readonly suppliedVersion: string;
  readonly recordedDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approvalReference: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedVersion: { type: "string", maxLength: 8192, minLength: 1 },
    recordedDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["approvalReference", "suppliedVersion", "recordedDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit community-approval version-date record without verifying or granting approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { approvalReference, suppliedVersion, recordedDateText } = request;
  const compute = (): Output => {
    H.domain(approvalReference.length > 0, "approvalReference");
    H.domain(suppliedVersion.length > 0, "suppliedVersion");
    H.domain(recordedDateText.length > 0, "recordedDateText");
    return {
      token: JSON.stringify([
        approvalReference,
        suppliedVersion,
        recordedDateText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    approvalReference: "APP17",
    suppliedVersion: "v2",
    recordedDateText: "2026-11-01",
  },
  output: { token: '["APP17","v2","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const communityApprovalVersionDatePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["indigenous-studies", "indigenous studies", "humanities"],
      keywords: ["indigenous studies", "humanities"],
    },
    id: "indigenous-studies/community-approval-version-date-pair",
    title: "Community Approval Version Date Pair",
    description:
      "Preserve an explicit community-approval version-date record without verifying or granting approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        approvalReference: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedVersion: { type: "string", maxLength: 8192, minLength: 1 },
        recordedDateText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["approvalReference", "suppliedVersion", "recordedDateText"],
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
          id: "approvalReference",
          label: "Approval Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedVersion",
          label: "Supplied Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedDateText",
          label: "Recorded Date Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = communityApprovalVersionDatePairTool.execute;
export default communityApprovalVersionDatePairTool;
