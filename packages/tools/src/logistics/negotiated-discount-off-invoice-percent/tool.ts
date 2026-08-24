import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NegotiatedDiscountOffInvoicePercentInput = {
  readonly invoiceTotalUsd: number;
  readonly discountPercent: number;
};

export type NegotiatedDiscountOffInvoicePercentOutput = {
  readonly discountAmountUsd: number;
  readonly netPayableUsd: number;
};

export const calculateNegotiatedDiscountOffInvoicePercent = (
  input: NegotiatedDiscountOffInvoicePercentInput,
): NegotiatedDiscountOffInvoicePercentOutput => {
  if (!Number.isFinite(input.invoiceTotalUsd) || input.invoiceTotalUsd < 0)
    return simpleError(
      "invoiceTotalUsd",
      "The invoice total must be finite and non-negative.",
      "invalid_amount",
    );
  if (
    !Number.isFinite(input.discountPercent) ||
    input.discountPercent < 0 ||
    input.discountPercent > 100
  )
    return simpleError(
      "discountPercent",
      "The discount must be between zero and one hundred percent.",
      "invalid_percent",
    );
  const discountAmountUsd =
    input.invoiceTotalUsd * (input.discountPercent / 100);
  if (
    input.invoiceTotalUsd > 0 &&
    input.discountPercent > 0 &&
    discountAmountUsd <= 0
  )
    return simpleError(
      "discountPercent",
      "The discount amount is outside the representable range.",
      "discount_out_of_range",
    );
  const netPayableUsd = input.invoiceTotalUsd - discountAmountUsd;
  if (
    !Number.isFinite(discountAmountUsd) ||
    !Number.isFinite(netPayableUsd) ||
    netPayableUsd < 0
  )
    return simpleError(
      "invoiceTotalUsd",
      "The discounted total is outside the representable range.",
      "total_out_of_range",
    );
  return { discountAmountUsd, netPayableUsd };
};

export const negotiatedDiscountOffInvoicePercentExample = {
  input: { invoiceTotalUsd: 4820, discountPercent: 12.5 },
  output: { discountAmountUsd: 602.5, netPayableUsd: 4217.5 },
} satisfies ToolExample<
  NegotiatedDiscountOffInvoicePercentInput,
  NegotiatedDiscountOffInvoicePercentOutput
>;

export const negotiatedDiscountOffInvoicePercentTool = createSimpleTool({
  id: "logistics/negotiated-discount-off-invoice-percent",
  title: "Negotiated Discount Off Invoice Percent",
  description:
    "Apply a negotiated percentage discount to a freight invoice total and report the discounted amount and net payable.",
  inputs: [
    {
      description: "Gross freight invoice total.",
      id: "invoiceTotalUsd",
      kind: "number",
      label: "Invoice total",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Negotiated discount percentage (0-100).",
      id: "discountPercent",
      kind: "number",
      label: "Discount %",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Discount value deducted from the invoice.",
      id: "discountAmountUsd",
      kind: "number",
      label: "Discount",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Net payable after the discount.",
      id: "netPayableUsd",
      kind: "number",
      label: "Net payable",
      minimum: 0,
      unit: "USD",
    },
  ],
  calculate: (input) =>
    calculateNegotiatedDiscountOffInvoicePercent({
      discountPercent: input.discountPercent as number,
      invoiceTotalUsd: input.invoiceTotalUsd as number,
    }),
});

export const runNegotiatedDiscountOffInvoicePercent =
  negotiatedDiscountOffInvoicePercentTool.execute;
export default negotiatedDiscountOffInvoicePercentTool;
