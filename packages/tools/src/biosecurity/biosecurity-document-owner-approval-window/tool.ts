import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly owner: string;
  readonly approvedOwner: string;
  readonly approved: boolean;
  readonly approvalDay: number;
  readonly expiryDay: number;
  readonly eventDay: number;
};
export type Output = {
  readonly ownerMatches: boolean;
  readonly timeMatches: boolean;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    owner: { type: "string", maxLength: 8192 },
    approvedOwner: { type: "string", maxLength: 8192 },
    approved: { type: "boolean" },
    approvalDay: { type: "integer" },
    expiryDay: { type: "integer" },
    eventDay: { type: "integer" },
  },
  required: [
    "owner",
    "approvedOwner",
    "approved",
    "approvalDay",
    "expiryDay",
    "eventDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownerMatches: { type: "boolean" },
    timeMatches: { type: "boolean" },
    matches: { type: "boolean" },
  },
  required: ["ownerMatches", "timeMatches", "matches"],
} as const;
/** Audit supplied document owner/approval timing fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { owner, approvedOwner, approved, approvalDay, expiryDay, eventDay } =
    request;
  const compute = (): Output => {
    H.domain(expiryDay >= approvalDay);
    const ownerMatches = owner === approvedOwner,
      timeMatches = eventDay >= approvalDay && eventDay <= expiryDay;
    return {
      ownerMatches,
      timeMatches,
      matches: ownerMatches && timeMatches && approved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    owner: "A",
    approvedOwner: "A",
    approved: true,
    approvalDay: 100,
    expiryDay: 120,
    eventDay: 110,
  },
  output: { ownerMatches: true, timeMatches: true, matches: true },
} satisfies ToolExample<Input, Output>;
export const biosecurityDocumentOwnerApprovalWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-document-owner-approval-window",
      title: "Biosecurity Document Owner Approval Window Tool",
      description: "Audit supplied document owner/approval timing fields.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          owner: { type: "string", maxLength: 8192 },
          approvedOwner: { type: "string", maxLength: 8192 },
          approved: { type: "boolean" },
          approvalDay: { type: "integer" },
          expiryDay: { type: "integer" },
          eventDay: { type: "integer" },
        },
        required: [
          "owner",
          "approvedOwner",
          "approved",
          "approvalDay",
          "expiryDay",
          "eventDay",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ownerMatches: { type: "boolean" },
          timeMatches: { type: "boolean" },
          matches: { type: "boolean" },
        },
        required: ["ownerMatches", "timeMatches", "matches"],
      },
      ports: {
        inputs: [
          {
            id: "owner",
            label: "Owner",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "approvedOwner",
            label: "Approved Owner",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "approved",
            label: "Approved",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "approvalDay",
            label: "Approval Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "eventDay",
            label: "Event Day",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "ownerMatches",
            label: "Owner Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "timeMatches",
            label: "Time Matches",
            valueType: { type: "boolean" },
          },
          { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityDocumentOwnerApprovalWindowTool.execute;
export default biosecurityDocumentOwnerApprovalWindowTool;
