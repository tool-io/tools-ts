import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toteId: string;
  readonly dispatched: boolean;
  readonly receiptRecorded: boolean;
};
export type Output = { readonly outstandingReceipt: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toteId: { type: "string", maxLength: 8192, minLength: 1 },
    dispatched: { type: "boolean" },
    receiptRecorded: { type: "boolean" },
  },
  required: ["toteId", "dispatched", "receiptRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outstandingReceipt: { type: "boolean" } },
  required: ["outstandingReceipt"],
} as const;
/** Combine explicit dispatch and receipt flags for a medication tote without confirming its contents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toteId, dispatched, receiptRecorded } = request;
  const compute = (): Output => {
    H.domain(toteId.length > 0, "toteId");
    H.domain(dispatched || !receiptRecorded, "receiptRecorded");
    return { outstandingReceipt: dispatched && !receiptRecorded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { toteId: "T17", dispatched: true, receiptRecorded: false },
  output: { outstandingReceipt: true },
} satisfies ToolExample<Input, Output>;
export const medicationToteReceiptFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/medication-tote-receipt-flag",
    title: "Medication Tote Receipt Flag",
    description:
      "Combine explicit dispatch and receipt flags for a medication tote without confirming its contents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toteId: { type: "string", maxLength: 8192, minLength: 1 },
        dispatched: { type: "boolean" },
        receiptRecorded: { type: "boolean" },
      },
      required: ["toteId", "dispatched", "receiptRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outstandingReceipt: { type: "boolean" } },
      required: ["outstandingReceipt"],
    },
    ports: {
      inputs: [
        {
          id: "toteId",
          label: "Tote Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dispatched",
          label: "Dispatched",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "receiptRecorded",
          label: "Receipt Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "outstandingReceipt",
          label: "Outstanding Receipt",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicationToteReceiptFlagTool.execute;
export default medicationToteReceiptFlagTool;
