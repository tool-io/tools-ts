import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InventoryTurnoverInput = {
  readonly costOfGoodsSold: number;
  readonly averageInventory: number;
};

export type InventoryTurnoverOutput = {
  readonly inventoryTurnover: number;
};

export const inventoryTurnoverExample = {
  input: { averageInventory: 37500, costOfGoodsSold: 60000 },
  output: { inventoryTurnover: 1.6 },
} satisfies ToolExample<InventoryTurnoverInput, InventoryTurnoverOutput>;

export const calculateInventoryTurnover = (
  input: InventoryTurnoverInput,
): InventoryTurnoverOutput => {
  if (!Number.isFinite(input.costOfGoodsSold) || input.costOfGoodsSold < 0)
    simpleError(
      "costOfGoodsSold",
      "Cost of goods sold must be finite and non-negative.",
      "invalid_cost_of_goods_sold",
    );
  if (!(input.averageInventory > 0))
    simpleError(
      "averageInventory",
      "Average inventory must be greater than zero because the ratio is undefined otherwise.",
      "positive_average_inventory_required",
    );
  const inventoryTurnover = input.costOfGoodsSold / input.averageInventory;
  if (!Number.isFinite(inventoryTurnover))
    simpleError(
      "averageInventory",
      "Inventory turnover exceeds the finite numeric range.",
      "result_not_finite",
    );
  return { inventoryTurnover };
};

export const inventoryTurnoverTool = createSimpleTool({
  calculate: (input) =>
    calculateInventoryTurnover({
      averageInventory: input.averageInventory as number,
      costOfGoodsSold: input.costOfGoodsSold as number,
    }),
  description:
    "Calculate inventory turnover as cost of goods sold divided by average inventory, measuring how often inventory is sold and replaced per period.",
  id: "accounting/inventory-turnover-cogs-average-inventory",
  inputs: [
    {
      description: "Cost of goods sold for the period.",
      id: "costOfGoodsSold",
      kind: "number",
      label: "Cost of goods sold",
      minimum: 0,
    },
    {
      description:
        "Average inventory for the period, for example beginning plus ending divided by two.",
      id: "averageInventory",
      kind: "number",
      label: "Average inventory",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Times per period that inventory is sold and replaced; higher values mean faster inventory movement.",
      id: "inventoryTurnover",
      kind: "number",
      label: "Inventory turnover",
    },
  ],
  title: "Inventory Turnover Calculator",
});
export const runInventoryTurnover = inventoryTurnoverTool.execute;
export default inventoryTurnoverTool;
