import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewId: string;
  readonly approverRecordId: string;
  readonly suppliedSignoffReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewId: { type: "string", maxLength: 8192, minLength: 1 },
    approverRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSignoffReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reviewId", "approverRecordId", "suppliedSignoffReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit permission-review sign-off reference without granting or validating access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewId, approverRecordId, suppliedSignoffReference } = request;
  const compute = (): Output => {
    H.domain(reviewId.length > 0, "reviewId");
    H.domain(approverRecordId.length > 0, "approverRecordId");
    H.domain(suppliedSignoffReference.length > 0, "suppliedSignoffReference");
    return {
      token: JSON.stringify([
        reviewId,
        approverRecordId,
        suppliedSignoffReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reviewId: "REV17",
    approverRecordId: "P2",
    suppliedSignoffReference: "SIG2",
  },
  output: { token: '["REV17","P2","SIG2"]' },
} satisfies ToolExample<Input, Output>;
export const permissionReviewApproverSignoffTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["security-studies", "security studies", "social sciences"],
      keywords: ["security studies", "social sciences"],
    },
    id: "security-studies/permission-review-approver-sign-off-tag",
    title: "Permission Review Approver Sign Off Tag",
    description:
      "Preserve an explicit permission-review sign-off reference without granting or validating access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewId: { type: "string", maxLength: 8192, minLength: 1 },
        approverRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSignoffReference: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["reviewId", "approverRecordId", "suppliedSignoffReference"],
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
          id: "reviewId",
          label: "Review Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approverRecordId",
          label: "Approver Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSignoffReference",
          label: "Supplied Signoff Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = permissionReviewApproverSignoffTagTool.execute;
export default permissionReviewApproverSignoffTagTool;
