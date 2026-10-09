import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceAmount: number;
  readonly creditAmount: number;
  readonly paidAmount: number;
};
export type Output = { readonly amountRemaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceAmount: { type: "number", minimum: 0 },
    creditAmount: { type: "number", minimum: 0 },
    paidAmount: { type: "number", minimum: 0 },
  },
  required: ["invoiceAmount", "creditAmount", "paidAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amountRemaining: { type: "number" } },
  required: ["amountRemaining"],
} as const;
/** Reconcile explicit invoice, credit, and paid amounts in the same currency, preserving an overpayment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceAmount, creditAmount, paidAmount } = request;
  const compute = (): Output => {
    H.domain(
      invoiceAmount >= 0 && creditAmount >= 0 && paidAmount >= 0,
      "invoiceAmount",
    );
    return { amountRemaining: invoiceAmount - creditAmount - paidAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { invoiceAmount: 100, creditAmount: 15, paidAmount: 30 },
  output: { amountRemaining: 55 },
} satisfies ToolExample<Input, Output>;
export const invoiceNetCreditRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["finance", "business and finance"],
      keywords: ["finance", "business and finance"],
    },
    id: "finance/invoice-net-credit-remainder",
    title: "Invoice Net Credit Remainder",
    description:
      "Reconcile explicit invoice, credit, and paid amounts in the same currency, preserving an overpayment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceAmount: { type: "number", minimum: 0 },
        creditAmount: { type: "number", minimum: 0 },
        paidAmount: { type: "number", minimum: 0 },
      },
      required: ["invoiceAmount", "creditAmount", "paidAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { amountRemaining: { type: "number" } },
      required: ["amountRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceAmount",
          label: "Invoice Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditAmount",
          label: "Credit Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paidAmount",
          label: "Paid Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "amountRemaining",
          label: "Amount Remaining",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = invoiceNetCreditRemainderTool.execute;
export default invoiceNetCreditRemainderTool;
