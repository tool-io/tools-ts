import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly letterId: string;
  readonly recipientId: string;
  readonly receiptCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    letterId: { type: "string", maxLength: 8192, minLength: 1 },
    recipientId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["letterId", "recipientId", "receiptCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit safety-letter recipient and receipt codes without delivering a letter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { letterId, recipientId, receiptCode } = request;
  const compute = (): Output => {
    H.domain(letterId.length > 0, "letterId");
    H.domain(recipientId.length > 0, "recipientId");
    H.domain(receiptCode.length > 0, "receiptCode");
    return { token: JSON.stringify([letterId, recipientId, receiptCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { letterId: "L17", recipientId: "SITE2", receiptCode: "acknowledged" },
  output: { token: '["L17","SITE2","acknowledged"]' },
} satisfies ToolExample<Input, Output>;
export const gcpSafetyLetterReceiptCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-safety-letter-receipt-code",
    title: "GCP Safety Letter Receipt Code",
    description:
      "Preserve explicit safety-letter recipient and receipt codes without delivering a letter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        letterId: { type: "string", maxLength: 8192, minLength: 1 },
        recipientId: { type: "string", maxLength: 8192, minLength: 1 },
        receiptCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["letterId", "recipientId", "receiptCode"],
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
          id: "letterId",
          label: "Letter Id",
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
          id: "receiptCode",
          label: "Receipt Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gcpSafetyLetterReceiptCodeTool.execute;
export default gcpSafetyLetterReceiptCodeTool;
