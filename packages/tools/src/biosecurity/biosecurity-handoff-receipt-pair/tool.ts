import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly handoffId: string;
  readonly senderReceiptId: string;
  readonly recipientReceiptId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    handoffId: { type: "string", maxLength: 8192, minLength: 1 },
    senderReceiptId: { type: "string", maxLength: 8192, minLength: 1 },
    recipientReceiptId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["handoffId", "senderReceiptId", "recipientReceiptId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit handoff receipt identifiers without transferring materials or confirming receipt. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { handoffId, senderReceiptId, recipientReceiptId } = request;
  const compute = (): Output => {
    H.domain(handoffId.length > 0, "handoffId");
    H.domain(senderReceiptId.length > 0, "senderReceiptId");
    H.domain(recipientReceiptId.length > 0, "recipientReceiptId");
    return {
      token: JSON.stringify([handoffId, senderReceiptId, recipientReceiptId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    handoffId: "H17",
    senderReceiptId: "SREC2",
    recipientReceiptId: "RREC2",
  },
  output: { token: '["H17","SREC2","RREC2"]' },
} satisfies ToolExample<Input, Output>;
export const biosecurityHandoffReceiptPairTool = H.defineSchemaCalculation<
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
    id: "biosecurity/biosecurity-handoff-receipt-pair",
    title: "Biosecurity Handoff Receipt Pair",
    description:
      "Pair explicit handoff receipt identifiers without transferring materials or confirming receipt.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        handoffId: { type: "string", maxLength: 8192, minLength: 1 },
        senderReceiptId: { type: "string", maxLength: 8192, minLength: 1 },
        recipientReceiptId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["handoffId", "senderReceiptId", "recipientReceiptId"],
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
          id: "handoffId",
          label: "Handoff Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "senderReceiptId",
          label: "Sender Receipt Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recipientReceiptId",
          label: "Recipient Receipt Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosecurityHandoffReceiptPairTool.execute;
export default biosecurityHandoffReceiptPairTool;
