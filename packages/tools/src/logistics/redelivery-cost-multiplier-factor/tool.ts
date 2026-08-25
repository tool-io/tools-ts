import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RedeliveryCostMultiplierFactorInput = {
  readonly originalDeliveryCostUsd: number;
  readonly redeliveryCostUsd: number;
};

export type RedeliveryCostMultiplierFactorOutput = {
  readonly redeliveryCostMultiplier: number;
};

export const calculateRedeliveryCostMultiplierFactor = (
  input: RedeliveryCostMultiplierFactorInput,
): RedeliveryCostMultiplierFactorOutput => {
  if (
    !Number.isFinite(input.originalDeliveryCostUsd) ||
    input.originalDeliveryCostUsd <= 0
  )
    return simpleError(
      "originalDeliveryCostUsd",
      "The original delivery cost must be greater than zero.",
      "invalid_cost",
    );
  if (!Number.isFinite(input.redeliveryCostUsd) || input.redeliveryCostUsd < 0)
    return simpleError(
      "redeliveryCostUsd",
      "The redelivery cost must be finite and non-negative.",
      "invalid_cost",
    );
  const redeliveryCostMultiplier =
    input.redeliveryCostUsd / input.originalDeliveryCostUsd;
  if (!Number.isFinite(redeliveryCostMultiplier))
    return simpleError(
      "redeliveryCostUsd",
      "The cost multiplier is outside the representable range.",
      "result_out_of_range",
    );
  return { redeliveryCostMultiplier };
};

export const redeliveryCostMultiplierFactorExample = {
  input: { originalDeliveryCostUsd: 18, redeliveryCostUsd: 45 },
  output: { redeliveryCostMultiplier: 2.5 },
} satisfies ToolExample<
  RedeliveryCostMultiplierFactorInput,
  RedeliveryCostMultiplierFactorOutput
>;

export const redeliveryCostMultiplierFactorTool = createSimpleTool({
  id: "logistics/redelivery-cost-multiplier-factor",
  title: "Redelivery Cost Multiplier Factor Calculator",
  description:
    "Express a failed-delivery retry cost as a multiplier of the original delivery attempt cost.",
  inputs: [
    {
      description: "Cost of the original delivery attempt in USD.",
      id: "originalDeliveryCostUsd",
      kind: "number",
      label: "Original cost",
      minimum: Number.MIN_VALUE,
      unit: "USD",
    },
    {
      description: "Cost of the redelivery attempt in USD.",
      id: "redeliveryCostUsd",
      kind: "number",
      label: "Redelivery cost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Redelivery cost divided by the original attempt cost.",
      id: "redeliveryCostMultiplier",
      kind: "number",
      label: "Multiplier",
    },
  ],
  calculate: (input) =>
    calculateRedeliveryCostMultiplierFactor({
      originalDeliveryCostUsd: input.originalDeliveryCostUsd as number,
      redeliveryCostUsd: input.redeliveryCostUsd as number,
    }),
});

export const runRedeliveryCostMultiplierFactor =
  redeliveryCostMultiplierFactorTool.execute;
export default redeliveryCostMultiplierFactorTool;
