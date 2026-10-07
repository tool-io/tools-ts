import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveryId: string;
  readonly receiptCode: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptCode: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deliveryId", "receiptCode", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit pharmacy-delivery receipt wording and source without confirming receipt. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveryId, receiptCode, source } = request;
  const compute = (): Output => {
    H.domain(deliveryId.length > 0, "deliveryId");
    H.domain(receiptCode.length > 0, "receiptCode");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([deliveryId, receiptCode, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deliveryId: "DEL17",
    receiptCode: "received",
    source: "Courier record",
  },
  output: { token: '["DEL17","received","Courier record"]' },
} satisfies ToolExample<Input, Output>;
export const communitypharmacyDeliveryReceiptCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
        keywords: ["community pharmacy", "pharmacy"],
      },
      id: "community-pharmacy/community-pharmacy-delivery-receipt-code",
      title: "Community Pharmacy Delivery Receipt Code",
      description:
        "Preserve explicit pharmacy-delivery receipt wording and source without confirming receipt.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deliveryId: { type: "string", maxLength: 8192, minLength: 1 },
          receiptCode: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["deliveryId", "receiptCode", "source"],
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
            id: "deliveryId",
            label: "Delivery Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "receiptCode",
            label: "Receipt Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
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
export const run = communitypharmacyDeliveryReceiptCodeTool.execute;
export default communitypharmacyDeliveryReceiptCodeTool;
