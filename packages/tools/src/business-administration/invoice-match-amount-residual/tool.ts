import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceAmount: number;
  readonly purchaseOrderAmount: number;
  readonly receivedCredit: number;
  readonly creditInvoice: boolean;
};
export type Output = {
  readonly adjustedInvoice: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceAmount: { type: "number" },
    purchaseOrderAmount: { type: "number" },
    receivedCredit: { type: "number", minimum: 0 },
    creditInvoice: { type: "boolean" },
  },
  required: [
    "invoiceAmount",
    "purchaseOrderAmount",
    "receivedCredit",
    "creditInvoice",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedInvoice: { type: "number" },
    residual: { type: "number" },
  },
  required: ["adjustedInvoice", "residual"],
} as const;
/** Calculate invoice match amount residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceAmount, purchaseOrderAmount, receivedCredit, creditInvoice } =
    request;
  const compute = (): Output => {
    H.domain(receivedCredit >= 0);
    return {
      adjustedInvoice: invoiceAmount - (creditInvoice ? receivedCredit : 0),
      residual:
        invoiceAmount -
        (creditInvoice ? receivedCredit : 0) -
        purchaseOrderAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoiceAmount: 110,
    purchaseOrderAmount: 100,
    receivedCredit: 5,
    creditInvoice: true,
  },
  output: { adjustedInvoice: 105, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const invoiceMatchAmountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/invoice-match-amount-residual",
    title: "Invoice Match Amount Residual Tool",
    description:
      "Calculate invoice match amount residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceAmount: { type: "number" },
        purchaseOrderAmount: { type: "number" },
        receivedCredit: { type: "number", minimum: 0 },
        creditInvoice: { type: "boolean" },
      },
      required: [
        "invoiceAmount",
        "purchaseOrderAmount",
        "receivedCredit",
        "creditInvoice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedInvoice: { type: "number" },
        residual: { type: "number" },
      },
      required: ["adjustedInvoice", "residual"],
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
          id: "purchaseOrderAmount",
          label: "Purchase Order Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedCredit",
          label: "Received Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditInvoice",
          label: "Credit Invoice",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "adjustedInvoice",
          label: "Adjusted Invoice",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = invoiceMatchAmountResidualTool.execute;
export default invoiceMatchAmountResidualTool;
