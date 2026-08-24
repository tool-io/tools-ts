import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnsReverseLogisticsCostPercentInput = {
  readonly netRevenueInPeriod: number;
  readonly returnedUnits: number;
  readonly reverseLogisticsCost: number;
};

export type ReturnsReverseLogisticsCostPercentOutput = {
  readonly costPerReturnedUnit: number;
  readonly reverseCostPercentOfRevenue: number;
};

export const calculateReturnsReverseLogisticsCostPercent = (
  input: ReturnsReverseLogisticsCostPercentInput,
): ReturnsReverseLogisticsCostPercentOutput => {
  if (
    !Number.isFinite(input.netRevenueInPeriod) ||
    input.netRevenueInPeriod <= 0
  )
    return simpleError(
      "netRevenueInPeriod",
      "Net revenue must be finite and greater than zero.",
      "invalid_revenue",
    );
  if (!(Number.isSafeInteger(input.returnedUnits) && input.returnedUnits >= 0))
    return simpleError(
      "returnedUnits",
      "Returned units must be a non-negative whole number.",
      "invalid_units",
    );
  if (
    !Number.isFinite(input.reverseLogisticsCost) ||
    input.reverseLogisticsCost < 0
  )
    return simpleError(
      "reverseLogisticsCost",
      "Reverse-logistics cost must be finite and non-negative.",
      "invalid_cost",
    );
  const costPerReturnedUnit =
    input.returnedUnits > 0
      ? input.reverseLogisticsCost / input.returnedUnits
      : 0;
  let reverseCostPercentOfRevenue =
    (input.reverseLogisticsCost / input.netRevenueInPeriod) * 100;
  if (reverseCostPercentOfRevenue === 0 && input.reverseLogisticsCost > 0)
    reverseCostPercentOfRevenue =
      (input.reverseLogisticsCost * 100) / input.netRevenueInPeriod;
  if (
    !Number.isFinite(costPerReturnedUnit) ||
    !Number.isFinite(reverseCostPercentOfRevenue) ||
    (input.returnedUnits > 0 &&
      input.reverseLogisticsCost > 0 &&
      costPerReturnedUnit <= 0) ||
    (input.reverseLogisticsCost > 0 && reverseCostPercentOfRevenue <= 0)
  )
    return simpleError(
      "reverseLogisticsCost",
      "The calculated return cost is outside the representable range.",
      "cost_out_of_range",
    );
  return { costPerReturnedUnit, reverseCostPercentOfRevenue };
};

export const returnsReverseLogisticsCostPercentExample = {
  input: {
    netRevenueInPeriod: 120000,
    returnedUnits: 160,
    reverseLogisticsCost: 4800,
  },
  output: { costPerReturnedUnit: 30, reverseCostPercentOfRevenue: 4 },
} satisfies ToolExample<
  ReturnsReverseLogisticsCostPercentInput,
  ReturnsReverseLogisticsCostPercentOutput
>;

export const returnsReverseLogisticsCostPercentTool = createSimpleTool({
  id: "logistics/returns-reverse-logistics-cost-percent",
  title: "Returns Reverse Logistics Cost Percent",
  description:
    "Express reverse-logistics spend for returned goods as a percentage of net revenue and as cost per returned unit.",
  inputs: [
    {
      description: "Net revenue for the same period in currency units.",
      id: "netRevenueInPeriod",
      kind: "number",
      label: "Net revenue",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 0,
      description: "Returned units in the period; omit to skip unit costing.",
      id: "returnedUnits",
      kind: "integer",
      label: "Returned units",
      minimum: 0,
    },
    {
      description: "Reverse-logistics cost for returns in currency units.",
      id: "reverseLogisticsCost",
      kind: "number",
      label: "Reverse cost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Reverse-logistics cost divided by returned units; 0 when no units supplied.",
      id: "costPerReturnedUnit",
      kind: "number",
      label: "Cost per return",
      minimum: 0,
    },
    {
      description: "Reverse-logistics cost as percent of net revenue.",
      id: "reverseCostPercentOfRevenue",
      kind: "number",
      label: "Cost percent",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateReturnsReverseLogisticsCostPercent({
      netRevenueInPeriod: input.netRevenueInPeriod as number,
      returnedUnits: input.returnedUnits as number,
      reverseLogisticsCost: input.reverseLogisticsCost as number,
    }),
});

export const runReturnsReverseLogisticsCostPercent =
  returnsReverseLogisticsCostPercentTool.execute;
export default returnsReverseLogisticsCostPercentTool;
