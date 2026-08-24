import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CostPerUnitShippedAllocationInput = {
  readonly totalShipmentCostUsd: number;
  readonly unitsShipped: number;
};

export type CostPerUnitShippedAllocationOutput = {
  readonly costPerUnitUsd: number;
};

export const calculateCostPerUnitShippedAllocation = (
  input: CostPerUnitShippedAllocationInput,
): CostPerUnitShippedAllocationOutput => {
  if (
    !Number.isFinite(input.totalShipmentCostUsd) ||
    input.totalShipmentCostUsd < 0
  )
    return simpleError(
      "totalShipmentCostUsd",
      "The shipment cost must be finite and non-negative.",
      "invalid_amount",
    );
  if (!(Number.isSafeInteger(input.unitsShipped) && input.unitsShipped > 0))
    return simpleError(
      "unitsShipped",
      "The shipped unit count must be a positive safe integer.",
      "invalid_quantity",
    );
  if (input.totalShipmentCostUsd === 0) return { costPerUnitUsd: 0 };
  const costPerUnitUsd = input.totalShipmentCostUsd / input.unitsShipped;
  if (!Number.isFinite(costPerUnitUsd) || costPerUnitUsd <= 0)
    return simpleError(
      "totalShipmentCostUsd",
      "The per-unit cost is too small to represent.",
      "cost_out_of_range",
    );
  return { costPerUnitUsd };
};

export const costPerUnitShippedAllocationExample = {
  input: { totalShipmentCostUsd: 1848.6, unitsShipped: 420 },
  output: { costPerUnitUsd: 4.401428571428571 },
} satisfies ToolExample<
  CostPerUnitShippedAllocationInput,
  CostPerUnitShippedAllocationOutput
>;

export const costPerUnitShippedAllocationTool = createSimpleTool({
  id: "logistics/cost-per-unit-shipped-allocation",
  title: "Cost per Unit Shipped Allocation",
  description:
    "Allocate a shipment's supplied freight and fee total evenly across its sellable units; this does not weight allocation by mass, volume, or value.",
  inputs: [
    {
      description:
        "Total shipment cost included in the allocation, in US dollars.",
      id: "totalShipmentCostUsd",
      kind: "number",
      label: "Total cost",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Number of sellable units in the shipment.",
      id: "unitsShipped",
      kind: "integer",
      label: "Units",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Shipment cost allocated equally to each shipped unit.",
      id: "costPerUnitUsd",
      kind: "number",
      label: "Cost per unit",
      minimum: 0,
      unit: "USD",
    },
  ],
  calculate: (input) =>
    calculateCostPerUnitShippedAllocation({
      totalShipmentCostUsd: input.totalShipmentCostUsd as number,
      unitsShipped: input.unitsShipped as number,
    }),
});

export const runCostPerUnitShippedAllocation =
  costPerUnitShippedAllocationTool.execute;
export default costPerUnitShippedAllocationTool;
