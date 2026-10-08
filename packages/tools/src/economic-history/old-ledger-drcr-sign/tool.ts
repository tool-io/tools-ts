import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly entrySide: string;
  readonly debitPositive: boolean;
};
export type Output = { readonly signedAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    entrySide: { type: "string", maxLength: 8192, enum: ["debit", "credit"] },
    debitPositive: { type: "boolean" },
  },
  required: ["amount", "entrySide", "debitPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedAmount: { type: "number" } },
  required: ["signedAmount"],
} as const;
/** Apply an explicit debit-positive or credit-positive convention to a nonnegative transcribed ledger amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, entrySide, debitPositive } = request;
  const compute = (): Output => {
    H.domain(amount >= 0, "amount");
    H.domain(["debit", "credit"].includes(entrySide), "entrySide");
    return {
      signedAmount:
        (entrySide === "debit") === debitPositive ? amount : -amount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 20, entrySide: "credit", debitPositive: true },
  output: { signedAmount: -20 },
} satisfies ToolExample<Input, Output>;
export const oldLedgerDrcrSignTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economic-history", "economic history", "economics"],
      keywords: ["economic history", "economics"],
    },
    id: "economic-history/old-ledger-drcr-sign",
    title: "Old Ledger Drcr Sign",
    description:
      "Apply an explicit debit-positive or credit-positive convention to a nonnegative transcribed ledger amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        entrySide: {
          type: "string",
          maxLength: 8192,
          enum: ["debit", "credit"],
        },
        debitPositive: { type: "boolean" },
      },
      required: ["amount", "entrySide", "debitPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedAmount: { type: "number" } },
      required: ["signedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "entrySide",
          label: "Entry Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "debitPositive",
          label: "Debit Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedAmount",
          label: "Signed Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oldLedgerDrcrSignTool.execute;
export default oldLedgerDrcrSignTool;
