import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CostPerDropLastMileInput = {
  readonly completedDrops: number;
  readonly totalDeliveryCost: number;
};

export type CostPerDropLastMileOutput = {
  readonly costPerDrop: number;
};

export const calculateCostPerDropLastMile = (
  input: CostPerDropLastMileInput,
): CostPerDropLastMileOutput => {
  if (!Number.isSafeInteger(input.completedDrops) || input.completedDrops <= 0)
    return simpleError(
      "completedDrops",
      "Completed drops must be a positive safe integer.",
      "invalid_drops",
    );
  if (!Number.isFinite(input.totalDeliveryCost) || input.totalDeliveryCost < 0)
    return simpleError(
      "totalDeliveryCost",
      "Total delivery cost must be a non-negative finite number.",
      "invalid_cost",
    );
  if (input.totalDeliveryCost === 0) return { costPerDrop: 0 };

  const costPerDrop = input.totalDeliveryCost / input.completedDrops;
  if (!Number.isFinite(costPerDrop) || costPerDrop <= 0)
    return simpleError(
      "totalDeliveryCost",
      "Total delivery cost is too small relative to completed drops to represent a positive cost per drop.",
      "unrepresentable_cost",
    );
  return { costPerDrop };
};

export const costPerDropLastMileExample = {
  input: { totalDeliveryCost: 1250, completedDrops: 50 },
  output: { costPerDrop: 25 },
} satisfies ToolExample<CostPerDropLastMileInput, CostPerDropLastMileOutput>;

export const costPerDropLastMileTool = createSimpleTool({
  id: "logistics/cost-per-drop-last-mile",
  title: "Last-Mile Cost per Completed Drop Calculator",
  description:
    "Calculate average last-mile delivery cost per completed drop for one route or period using the cost scope supplied.",
  inputs: [
    {
      description: "Number of completed delivery drops.",
      id: "completedDrops",
      kind: "integer",
      label: "Completed drops",
      minimum: 1,
    },
    {
      description:
        "Total delivery cost in currency units for the period or route.",
      id: "totalDeliveryCost",
      kind: "number",
      label: "Total cost",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Cost per completed drop in currency units per drop.",
      id: "costPerDrop",
      kind: "number",
      label: "Cost per drop",
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateCostPerDropLastMile({
      completedDrops: input.completedDrops as number,
      totalDeliveryCost: input.totalDeliveryCost as number,
    }),
});

export const runCostPerDropLastMile = costPerDropLastMileTool.execute;
export default costPerDropLastMileTool;
