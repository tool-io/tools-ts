import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly approvalLimit: number;
  readonly purchaseAmount: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approvalLimit: { type: "number" },
    purchaseAmount: { type: "number" },
  },
  required: ["approvalLimit", "purchaseAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied purchase amount minus approval limit without selecting authority or approving a purchase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { approvalLimit, purchaseAmount } = request;
  const compute = (): Output => {
    return { signedGap: purchaseAmount - approvalLimit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { approvalLimit: 12, purchaseAmount: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const purchaseApprovalEscalationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/purchase-approval-escalation-gap",
    title: "Purchase Approval Escalation Gap",
    description:
      "Calculate supplied purchase amount minus approval limit without selecting authority or approving a purchase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        approvalLimit: { type: "number" },
        purchaseAmount: { type: "number" },
      },
      required: ["approvalLimit", "purchaseAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "approvalLimit",
          label: "Approval Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purchaseAmount",
          label: "Purchase Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = purchaseApprovalEscalationGapTool.execute;
export default purchaseApprovalEscalationGapTool;
