import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type ElectricityCost = {
  readonly currency: string;
  readonly dailyCost: number;
  readonly dailyEnergyKwh: number;
  readonly monthlyCost: number;
  readonly yearlyCost: number;
};
export const calculateElectricityCost = (
  power: number,
  powerUnit: "kw" | "w",
  hoursPerDay: number,
  rate: number,
  quantity: number,
  currency: string,
): ElectricityCost | null => {
  if (hoursPerDay > 24 || !currency.trim()) return null;
  const dailyEnergyKwh =
      (powerUnit === "w" ? power / 1_000 : power) * hoursPerDay * quantity,
    dailyCost = dailyEnergyKwh * rate;
  return {
    currency,
    dailyCost,
    dailyEnergyKwh,
    monthlyCost: dailyCost * 30.4375,
    yearlyCost: dailyCost * 365,
  };
};
export const electricityCostExample = {
  input: {
    currency: "USD",
    hoursPerDay: 8,
    power: 100,
    powerUnit: "w",
    quantity: 1,
    rate: 0.16,
  },
  output: {
    result: {
      currency: "USD",
      dailyCost: 0.128,
      dailyEnergyKwh: 0.8,
      monthlyCost: 3.896,
      yearlyCost: 46.72,
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly hoursPerDay: number;
    readonly power: number;
    readonly powerUnit: string;
    readonly quantity: number;
    readonly rate: number;
  },
  { readonly result: ElectricityCost }
>;
export const electricityCostTool = createSimpleTool({
  id: "cost/electricity",
  title: "Electricity Cost Calculator",
  description:
    "Estimate daily, monthly, and yearly electricity costs for one or more devices.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { enum: ["w", "kw"], id: "powerUnit", kind: "string", label: "Power unit" },
    { id: "power", kind: "number", label: "Power", minimum: 0 },
    {
      id: "hoursPerDay",
      kind: "number",
      label: "Hours per day",
      maximum: 24,
      minimum: 0,
    },
    { id: "rate", kind: "number", label: "Price per kWh", minimum: 0 },
    {
      id: "quantity",
      kind: "number",
      label: "Quantity",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "cost/electricity",
      id: "result",
      kind: "object",
      label: "Electricity cost",
    },
  ],
  calculate: (input) => {
    const result = calculateElectricityCost(
      input.power as number,
      input.powerUnit as "kw" | "w",
      input.hoursPerDay as number,
      input.rate as number,
      input.quantity as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "currency",
        "Enter a currency and no more than 24 usage hours per day.",
      );
    return { result };
  },
});
export const runElectricityCost = electricityCostTool.execute;
export default electricityCostTool;
