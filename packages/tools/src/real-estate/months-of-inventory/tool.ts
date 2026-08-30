import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MonthsOfInventoryInput = Readonly<{
  readonly activeListings: number;
  readonly salesPerMonth: number;
}>;
export type MonthsOfInventoryOutput = Readonly<{
  readonly monthsOfInventory: number;
}>;

export const calculateMonthsOfInventory = (
  x: MonthsOfInventoryInput,
): MonthsOfInventoryOutput => {
  if (!Number.isFinite(x.activeListings) || x.activeListings < 0)
    simpleError("activeListings", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.salesPerMonth) || x.salesPerMonth <= 0)
    simpleError("salesPerMonth", "Provide a finite positive number.");
  if (!Number.isInteger(x.activeListings))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const monthsOfInventory = x.activeListings / x.salesPerMonth;
  if (!Number.isFinite(monthsOfInventory))
    simpleError(
      "monthsOfInventory",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    monthsOfInventory: Object.is(monthsOfInventory, -0) ? 0 : monthsOfInventory,
  };
};

export const example = {
  input: {
    activeListings: 60,
    salesPerMonth: 20,
  },
  output: { monthsOfInventory: 3 },
} satisfies ToolExample<MonthsOfInventoryInput, MonthsOfInventoryOutput>;

export const tool = createSimpleTool({
  id: "real-estate/months-of-inventory",
  title: "Months Of Inventory",
  description: "Months of supply at the observed monthly sales pace.",
  inputs: [
    {
      id: "activeListings",
      kind: "number",
      label: "Active Listings",
      minimum: 0,
    },
    {
      id: "salesPerMonth",
      kind: "number",
      label: "Sales Per Month",
      unit: "1/month",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "monthsOfInventory",
      kind: "number",
      label: "Months Of Inventory",
      unit: "month",
    },
  ],
  calculate: (input) =>
    calculateMonthsOfInventory({
      activeListings: input.activeListings as number,
      salesPerMonth: input.salesPerMonth as number,
    }),
});
export const monthsOfInventoryTool = tool;
export const runMonthsOfInventory = tool.execute;
export default tool;
