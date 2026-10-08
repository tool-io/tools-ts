import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispatchTimestamp: number;
  readonly receiptTimestamp: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispatchTimestamp: { type: "number" },
    receiptTimestamp: { type: "number" },
  },
  required: ["dispatchTimestamp", "receiptTimestamp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed supplied exhibit receipt-minus-dispatch elapsed time without establishing chain-of-custody validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispatchTimestamp, receiptTimestamp } = request;
  const compute = (): Output => {
    return { signedGap: receiptTimestamp - dispatchTimestamp };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispatchTimestamp: 12, receiptTimestamp: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const exhibitTransferReceiptTimeDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/exhibit-transfer-receipt-time-delta",
    title: "Exhibit Transfer Receipt Time Delta",
    description:
      "Calculate signed supplied exhibit receipt-minus-dispatch elapsed time without establishing chain-of-custody validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispatchTimestamp: { type: "number" },
        receiptTimestamp: { type: "number" },
      },
      required: ["dispatchTimestamp", "receiptTimestamp"],
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
          id: "dispatchTimestamp",
          label: "Dispatch Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receiptTimestamp",
          label: "Receipt Timestamp",
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
export const run = exhibitTransferReceiptTimeDeltaTool.execute;
export default exhibitTransferReceiptTimeDeltaTool;
