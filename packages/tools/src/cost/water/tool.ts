import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type WaterCost = {
  readonly billableUnits: number;
  readonly currency: string;
  readonly fixedCharge: number;
  readonly totalCost: number;
  readonly usage: number;
  readonly usageCost: number;
  readonly usageUnit: "gal" | "L";
};
export const calculateWaterCost = (
  system: "metric" | "us",
  dailyUsage: number,
  days: number,
  rate: number,
  fixedCharge: number,
  currency: string,
): WaterCost | null => {
  if (!currency.trim() || days <= 0) return null;
  const usage = dailyUsage * days,
    billableUnits = usage / 1_000,
    usageCost = billableUnits * rate;
  return {
    billableUnits,
    currency,
    fixedCharge,
    totalCost: usageCost + fixedCharge,
    usage,
    usageCost,
    usageUnit: system === "us" ? "gal" : "L",
  };
};
export const waterCostExample = {
  input: {
    currency: "USD",
    dailyUsage: 100,
    days: 30,
    fixedCharge: 15,
    rate: 6,
    system: "us",
  },
  output: {
    result: {
      billableUnits: 3,
      currency: "USD",
      fixedCharge: 15,
      totalCost: 33,
      usage: 3_000,
      usageCost: 18,
      usageUnit: "gal",
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly dailyUsage: number;
    readonly days: number;
    readonly fixedCharge: number;
    readonly rate: number;
    readonly system: string;
  },
  { readonly result: WaterCost }
>;
export const waterCostTool = createSimpleTool({
  id: "cost/water",
  title: "Water Cost Calculator",
  description:
    "Estimate a water bill from daily use, billing days, usage rates, and fixed charges.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { enum: ["us", "metric"], id: "system", kind: "string", label: "Units" },
    { id: "dailyUsage", kind: "number", label: "Daily usage", minimum: 0 },
    {
      id: "days",
      kind: "number",
      label: "Billing days",
      minimum: Number.MIN_VALUE,
    },
    { id: "rate", kind: "number", label: "Usage rate", minimum: 0 },
    { id: "fixedCharge", kind: "number", label: "Fixed charge", minimum: 0 },
  ],
  outputs: [
    { format: "cost/water", id: "result", kind: "object", label: "Water cost" },
  ],
  calculate: (input) => {
    const result = calculateWaterCost(
      input.system as "metric" | "us",
      input.dailyUsage as number,
      input.days as number,
      input.rate as number,
      input.fixedCharge as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "days",
        "Billing days must be positive and currency must be nonempty.",
      );
    return { result };
  },
});
export const runWaterCost = waterCostTool.execute;
export default waterCostTool;
