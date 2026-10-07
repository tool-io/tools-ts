import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly notificationId: string;
  readonly recipientId: string;
  readonly receiptStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notificationId: { type: "string", maxLength: 8192, minLength: 1 },
    recipientId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["notificationId", "recipientId", "receiptStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit administrative notification receipt metadata without sending a notification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { notificationId, recipientId, receiptStatus } = request;
  const compute = (): Output => {
    H.domain(notificationId.length > 0, "notificationId");
    H.domain(recipientId.length > 0, "recipientId");
    H.domain(receiptStatus.length > 0, "receiptStatus");
    return {
      token: JSON.stringify([notificationId, recipientId, receiptStatus]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    notificationId: "N17",
    recipientId: "R2",
    receiptStatus: "acknowledged",
  },
  output: { token: '["N17","R2","acknowledged"]' },
} satisfies ToolExample<Input, Output>;
export const biosecurityNotificationReceiptTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosecurity", "research and quality management"],
      keywords: ["biosecurity", "research and quality management"],
    },
    id: "biosecurity/biosecurity-notification-receipt-tag",
    title: "Biosecurity Notification Receipt Tag",
    description:
      "Preserve explicit administrative notification receipt metadata without sending a notification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notificationId: { type: "string", maxLength: 8192, minLength: 1 },
        recipientId: { type: "string", maxLength: 8192, minLength: 1 },
        receiptStatus: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["notificationId", "recipientId", "receiptStatus"],
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
          id: "notificationId",
          label: "Notification Id",
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
          id: "receiptStatus",
          label: "Receipt Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosecurityNotificationReceiptTagTool.execute;
export default biosecurityNotificationReceiptTagTool;
