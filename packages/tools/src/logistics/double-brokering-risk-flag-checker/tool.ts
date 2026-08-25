import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoubleBrokeringRiskFlagCheckerInput = {
  readonly carrierPayUsd: number;
  readonly payDiscountAlertPercent?: number;
  readonly shipperPayUsd: number;
};

export type DoubleBrokeringRiskFlagCheckerOutput = {
  readonly doubleBrokeringRiskFlag: boolean;
  readonly payDiscountPercent: number;
};

export const calculateDoubleBrokeringRiskFlagChecker = (
  input: DoubleBrokeringRiskFlagCheckerInput,
): DoubleBrokeringRiskFlagCheckerOutput => {
  if (!Number.isFinite(input.shipperPayUsd) || input.shipperPayUsd <= 0)
    return simpleError(
      "shipperPayUsd",
      "The shipper pay must be greater than zero.",
      "invalid_pay",
    );
  const payDiscountAlertPercent = input.payDiscountAlertPercent ?? 35;
  if (!Number.isFinite(input.carrierPayUsd) || input.carrierPayUsd < 0)
    return simpleError(
      "carrierPayUsd",
      "Carrier pay must be finite and non-negative.",
      "invalid_pay",
    );
  if (
    !Number.isFinite(payDiscountAlertPercent) ||
    payDiscountAlertPercent < 0 ||
    payDiscountAlertPercent > 100
  )
    return simpleError(
      "payDiscountAlertPercent",
      "The alert threshold must be between zero and one hundred.",
      "invalid_threshold",
    );
  const payDiscountPercent =
    ((input.shipperPayUsd - input.carrierPayUsd) / input.shipperPayUsd) * 100;
  if (!Number.isFinite(payDiscountPercent))
    return simpleError(
      "carrierPayUsd",
      "The pay difference is outside the representable range.",
      "discount_out_of_range",
    );
  return {
    payDiscountPercent,
    doubleBrokeringRiskFlag: payDiscountPercent > payDiscountAlertPercent,
  };
};

export const doubleBrokeringRiskFlagCheckerExample = {
  input: {
    carrierPayUsd: 1650,
    payDiscountAlertPercent: 35,
    shipperPayUsd: 3000,
  },
  output: { doubleBrokeringRiskFlag: true, payDiscountPercent: 45 },
} satisfies ToolExample<
  DoubleBrokeringRiskFlagCheckerInput,
  DoubleBrokeringRiskFlagCheckerOutput
>;

export const doubleBrokeringRiskFlagCheckerTool = createSimpleTool({
  id: "logistics/double-brokering-risk-flag-checker",
  title: "Double Brokering Risk Flag Checker",
  description:
    "Flag a large difference between shipper and carrier pay for manual review. A rate difference alone cannot establish double brokering and may reflect legitimate brokerage costs or services.",
  inputs: [
    {
      description: "Rate billed to the shipper in USD.",
      id: "shipperPayUsd",
      kind: "number",
      label: "Shipper pay",
      minimum: Number.MIN_VALUE,
      unit: "USD",
    },
    {
      description: "Rate paid to the performing carrier in USD.",
      id: "carrierPayUsd",
      kind: "number",
      label: "Carrier pay",
      minimum: 0,
    },
    {
      default: 35,
      description:
        "Discount percent beyond which the risk flag fires (heuristic).",
      id: "payDiscountAlertPercent",
      kind: "number",
      label: "Alert threshold %",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the pay discount exceeds the alert threshold.",
      id: "doubleBrokeringRiskFlag",
      kind: "boolean",
      label: "Risk flag",
    },
    {
      description:
        "Carrier discount below the shipper rate as a percent of the shipper rate.",
      id: "payDiscountPercent",
      kind: "number",
      label: "Discount %",
    },
  ],
  calculate: (input) =>
    calculateDoubleBrokeringRiskFlagChecker({
      carrierPayUsd: input.carrierPayUsd as number,
      payDiscountAlertPercent: input.payDiscountAlertPercent as
        number | undefined,
      shipperPayUsd: input.shipperPayUsd as number,
    }),
});

export const runDoubleBrokeringRiskFlagChecker =
  doubleBrokeringRiskFlagCheckerTool.execute;
export default doubleBrokeringRiskFlagCheckerTool;
