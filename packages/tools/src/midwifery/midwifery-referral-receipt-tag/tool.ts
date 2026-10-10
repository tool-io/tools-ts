import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referralId: string;
  readonly recipientId: string;
  readonly receiptRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referralId: { type: "string", maxLength: 8192, minLength: 1 },
    recipientId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["referralId", "recipientId", "receiptRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit referral-recipient receipt identifiers without assessing referral acceptance or care transfer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referralId, recipientId, receiptRecordId } = request;
  const compute = (): Output => {
    H.domain(referralId.length > 0, "referralId");
    H.domain(recipientId.length > 0, "recipientId");
    H.domain(receiptRecordId.length > 0, "receiptRecordId");
    return {
      token: JSON.stringify([referralId, recipientId, receiptRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referralId: "REF17", recipientId: "TEAM3", receiptRecordId: "ACK2" },
  output: { token: '["REF17","TEAM3","ACK2"]' },
} satisfies ToolExample<Input, Output>;
export const midwiferyReferralReceiptTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/midwifery-referral-receipt-tag",
    title: "Midwifery Referral Receipt Tag",
    description:
      "Record explicit referral-recipient receipt identifiers without assessing referral acceptance or care transfer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referralId: { type: "string", maxLength: 8192, minLength: 1 },
        recipientId: { type: "string", maxLength: 8192, minLength: 1 },
        receiptRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["referralId", "recipientId", "receiptRecordId"],
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
          id: "recipientId",
          label: "Recipient Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "receiptRecordId",
          label: "Receipt Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = midwiferyReferralReceiptTagTool.execute;
export default midwiferyReferralReceiptTagTool;
