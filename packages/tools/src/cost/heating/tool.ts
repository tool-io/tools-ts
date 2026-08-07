import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type HeatingCost = {
  readonly currency: string;
  readonly energyKwh: number;
  readonly fixedCharges: number;
  readonly totalCost: number;
  readonly usageCost: number;
};
export const calculateHeatingCost = (
  monthlyEnergyKwh: number,
  rate: number,
  fixedMonthlyCharge: number,
  months: number,
  currency: string,
): HeatingCost | null => {
  if (!currency.trim() || !Number.isSafeInteger(months) || months <= 0)
    return null;
  const energyKwh = monthlyEnergyKwh * months,
    usageCost = energyKwh * rate,
    fixedCharges = fixedMonthlyCharge * months;
  return {
    currency,
    energyKwh,
    fixedCharges,
    totalCost: usageCost + fixedCharges,
    usageCost,
  };
};
export const heatingCostExample = {
  input: {
    currency: "USD",
    fixedMonthlyCharge: 15,
    monthlyEnergyKwh: 800,
    months: 6,
    rate: 0.12,
  },
  output: {
    result: {
      currency: "USD",
      energyKwh: 4_800,
      fixedCharges: 90,
      totalCost: 666,
      usageCost: 576,
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly fixedMonthlyCharge: number;
    readonly monthlyEnergyKwh: number;
    readonly months: number;
    readonly rate: number;
  },
  { readonly result: HeatingCost }
>;
export const heatingCostTool = createSimpleTool({
  id: "cost/heating",
  title: "Heating Cost Calculator",
  description:
    "Estimate heating energy charges and fixed service fees over one or more months.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    {
      id: "monthlyEnergyKwh",
      kind: "number",
      label: "Energy per month (kWh)",
      minimum: 0,
    },
    { id: "rate", kind: "number", label: "Price per kWh", minimum: 0 },
    {
      id: "fixedMonthlyCharge",
      kind: "number",
      label: "Fixed monthly charge",
      minimum: 0,
    },
    { id: "months", kind: "integer", label: "Months", minimum: 1 },
  ],
  outputs: [
    {
      format: "cost/heating",
      id: "result",
      kind: "object",
      label: "Heating cost",
    },
  ],
  calculate: (input) => {
    const result = calculateHeatingCost(
      input.monthlyEnergyKwh as number,
      input.rate as number,
      input.fixedMonthlyCharge as number,
      input.months as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "months",
        "Months must be a positive integer and currency nonempty.",
      );
    return { result };
  },
});
export const runHeatingCost = heatingCostTool.execute;
export default heatingCostTool;
