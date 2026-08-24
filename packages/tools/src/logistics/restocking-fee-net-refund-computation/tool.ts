import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RestockingFeeNetRefundComputationInput = {
  readonly flatReturnDeduction?: number;
  readonly itemPrice: number;
  readonly restockingFeePercent?: number;
};

export type RestockingFeeNetRefundComputationOutput = {
  readonly deductionShortfall: number;
  readonly netRefund: number;
  readonly restockingFeeAmount: number;
};

export const calculateRestockingFeeNetRefundComputation = (
  input: RestockingFeeNetRefundComputationInput,
): RestockingFeeNetRefundComputationOutput => {
  const feePercent = input.restockingFeePercent ?? 15;
  const flatDeduction = input.flatReturnDeduction ?? 0;
  if (!Number.isFinite(input.itemPrice) || input.itemPrice < 0)
    return simpleError(
      "itemPrice",
      "The item price must be finite and non-negative.",
      "invalid_price",
    );
  if (!Number.isFinite(feePercent) || feePercent < 0 || feePercent > 100)
    return simpleError(
      "restockingFeePercent",
      "The restocking fee must be between zero and one hundred percent.",
      "invalid_percent",
    );
  if (!Number.isFinite(flatDeduction) || flatDeduction < 0)
    return simpleError(
      "flatReturnDeduction",
      "The flat deduction must be finite and non-negative.",
      "invalid_deduction",
    );
  const restockingFeeAmount = input.itemPrice * (feePercent / 100);
  if (input.itemPrice > 0 && feePercent > 0 && restockingFeeAmount <= 0)
    return simpleError(
      "restockingFeePercent",
      "The restocking fee is outside the representable range.",
      "fee_out_of_range",
    );
  const rawRefund = input.itemPrice - restockingFeeAmount - flatDeduction;
  if (!Number.isFinite(restockingFeeAmount) || !Number.isFinite(rawRefund))
    return simpleError(
      "itemPrice",
      "The refund is outside the representable range.",
      "refund_out_of_range",
    );
  return {
    deductionShortfall: rawRefund < 0 ? -rawRefund : 0,
    netRefund: Math.max(0, rawRefund),
    restockingFeeAmount,
  };
};

export const restockingFeeNetRefundComputationExample = {
  input: {
    flatReturnDeduction: 4.99,
    itemPrice: 89.99,
    restockingFeePercent: 15,
  },
  output: {
    deductionShortfall: 0,
    netRefund: 71.50150000000001,
    restockingFeeAmount: 13.498499999999998,
  },
} satisfies ToolExample<
  RestockingFeeNetRefundComputationInput,
  RestockingFeeNetRefundComputationOutput
>;

export const restockingFeeNetRefundComputationTool = createSimpleTool({
  id: "logistics/restocking-fee-net-refund-computation",
  title: "Restocking Fee Net Refund Computation",
  description:
    "Compute the net refund after a percentage restocking fee and any flat return deduction, clamped at zero with the shortfall reported.",
  inputs: [
    {
      default: 0,
      description: "Flat deduction per return in currency units.",
      id: "flatReturnDeduction",
      kind: "number",
      label: "Flat deduction",
      minimum: 0,
    },
    {
      description: "Item price in currency units.",
      id: "itemPrice",
      kind: "number",
      label: "Item price",
      minimum: 0,
    },
    {
      default: 15,
      description: "Restocking fee as percent of the item price.",
      id: "restockingFeePercent",
      kind: "number",
      label: "Restocking fee percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Amount by which deductions exceed the price; 0 when none.",
      id: "deductionShortfall",
      kind: "number",
      label: "Shortfall",
      minimum: 0,
    },
    {
      description: "Net refund owed to the customer, never below zero.",
      id: "netRefund",
      kind: "number",
      label: "Net refund",
      minimum: 0,
    },
    {
      description: "Restocking fee amount in currency units.",
      id: "restockingFeeAmount",
      kind: "number",
      label: "Restocking fee",
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateRestockingFeeNetRefundComputation({
      flatReturnDeduction: input.flatReturnDeduction as number | undefined,
      itemPrice: input.itemPrice as number,
      restockingFeePercent: input.restockingFeePercent as number | undefined,
    }),
});

export const runRestockingFeeNetRefundComputation =
  restockingFeeNetRefundComputationTool.execute;
export default restockingFeeNetRefundComputationTool;
