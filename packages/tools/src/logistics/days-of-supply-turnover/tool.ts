import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DaysOfSupplyTurnoverInput = {
  readonly averageInventoryValueUsd: number;
  readonly costOfGoodsSoldUsd: number;
};

export type DaysOfSupplyTurnoverOutput = {
  readonly daysOfSupply: number;
  readonly inventoryTurnover: number;
};

export const calculateDaysOfSupplyTurnover = (
  input: DaysOfSupplyTurnoverInput,
): DaysOfSupplyTurnoverOutput => {
  if (
    !Number.isFinite(input.averageInventoryValueUsd) ||
    input.averageInventoryValueUsd <= 0
  )
    return simpleError(
      "averageInventoryValueUsd",
      "Average inventory value must be finite and greater than zero.",
      "invalid_inventory",
    );
  if (
    !Number.isFinite(input.costOfGoodsSoldUsd) ||
    input.costOfGoodsSoldUsd <= 0
  )
    return simpleError(
      "costOfGoodsSoldUsd",
      "Annual cost of goods sold must be finite and greater than zero.",
      "invalid_cogs",
    );
  const inventoryTurnover =
    input.costOfGoodsSoldUsd / input.averageInventoryValueUsd;
  const daysOfSupply =
    (input.averageInventoryValueUsd / input.costOfGoodsSoldUsd) * 365;
  if (
    !Number.isFinite(inventoryTurnover) ||
    inventoryTurnover <= 0 ||
    !Number.isFinite(daysOfSupply) ||
    daysOfSupply <= 0
  )
    return simpleError(
      "costOfGoodsSoldUsd",
      "Turnover or days of supply is outside the representable range.",
      "result_out_of_range",
    );
  return { inventoryTurnover, daysOfSupply };
};

export const daysOfSupplyTurnoverExample = {
  input: { averageInventoryValueUsd: 600000, costOfGoodsSoldUsd: 2400000 },
  output: { daysOfSupply: 91.25, inventoryTurnover: 4 },
} satisfies ToolExample<DaysOfSupplyTurnoverInput, DaysOfSupplyTurnoverOutput>;

export const daysOfSupplyTurnoverTool = createSimpleTool({
  id: "logistics/days-of-supply-turnover",
  title: "Days of Supply and Inventory Turnover Calculator",
  description:
    "Compute annual inventory turnover and days of supply from annual COGS and average inventory value using a 365-day year.",
  inputs: [
    {
      description: "Annual cost of goods sold in USD.",
      id: "costOfGoodsSoldUsd",
      kind: "number",
      label: "Annual COGS",
      minimum: Number.MIN_VALUE,
      unit: "USD",
    },
    {
      description: "Average inventory value at cost in USD over the same year.",
      id: "averageInventoryValueUsd",
      kind: "number",
      label: "Average inventory",
      minimum: Number.MIN_VALUE,
      unit: "USD",
    },
  ],
  outputs: [
    {
      description:
        "Annual inventory turns (annual COGS divided by average inventory).",
      id: "inventoryTurnover",
      kind: "number",
      label: "Inventory turnover",
      minimum: Number.MIN_VALUE,
      unit: "turns/year",
    },
    {
      description:
        "Days represented by average inventory at the annual COGS rate.",
      id: "daysOfSupply",
      kind: "number",
      label: "Days of supply",
      minimum: Number.MIN_VALUE,
      unit: "days",
    },
  ],
  calculate: (input) =>
    calculateDaysOfSupplyTurnover({
      averageInventoryValueUsd: input.averageInventoryValueUsd as number,
      costOfGoodsSoldUsd: input.costOfGoodsSoldUsd as number,
    }),
});

export const runDaysOfSupplyTurnover = daysOfSupplyTurnoverTool.execute;
export default daysOfSupplyTurnoverTool;
