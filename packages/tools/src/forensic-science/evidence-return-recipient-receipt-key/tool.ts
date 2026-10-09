import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceId: string;
  readonly recipientId: string;
  readonly receiptId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
    recipientId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["evidenceId", "recipientId", "receiptId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link supplied evidence-return recipient and receipt identifiers without verifying transfer or authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceId, recipientId, receiptId } = request;
  const compute = (): Output => {
    H.domain(evidenceId.length > 0, "evidenceId");
    H.domain(recipientId.length > 0, "recipientId");
    H.domain(receiptId.length > 0, "receiptId");
    return { token: JSON.stringify([evidenceId, recipientId, receiptId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceId: "E17", recipientId: "R4", receiptId: "REC2" },
  output: { token: '["E17","R4","REC2"]' },
} satisfies ToolExample<Input, Output>;
export const evidenceReturnRecipientReceiptKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-return-recipient-receipt-key",
    title: "Evidence Return Recipient Receipt Key Tool",
    description:
      "Link supplied evidence-return recipient and receipt identifiers without verifying transfer or authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
        recipientId: { type: "string", maxLength: 8192, minLength: 1 },
        receiptId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["evidenceId", "recipientId", "receiptId"],
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
          id: "evidenceId",
          label: "Evidence Id",
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
          id: "receiptId",
          label: "Receipt Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = evidenceReturnRecipientReceiptKeyTool.execute;
export default evidenceReturnRecipientReceiptKeyTool;
