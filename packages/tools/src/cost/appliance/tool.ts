import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateElectricityCost } from "../electricity/tool.js";
export type ApplianceCost = {
  readonly currency: string;
  readonly energyKwh: number;
  readonly usageCost: number;
};
export const calculateApplianceCost = (
  watts: number,
  hoursPerDay: number,
  days: number,
  rate: number,
  currency: string,
): ApplianceCost | null => {
  const daily = calculateElectricityCost(
    watts,
    "w",
    hoursPerDay,
    rate,
    1,
    currency,
  );
  return !daily
    ? null
    : {
        currency,
        energyKwh: daily.dailyEnergyKwh * days,
        usageCost: Number((daily.dailyCost * days).toPrecision(12)),
      };
};
export const applianceCostExample = {
  input: {
    currency: "USD",
    days: 30,
    hoursPerDay: 1,
    rate: 0.16,
    watts: 1_500,
  },
  output: { result: { currency: "USD", energyKwh: 45, usageCost: 7.2 } },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly days: number;
    readonly hoursPerDay: number;
    readonly rate: number;
    readonly watts: number;
  },
  { readonly result: ApplianceCost }
>;
export const applianceCostTool = createSimpleTool({
  id: "cost/appliance",
  title: "Appliance Cost Calculator",
  description:
    "Estimate the electricity cost of using a household appliance for a selected number of days.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { id: "watts", kind: "number", label: "Power (W)", minimum: 0 },
    {
      id: "hoursPerDay",
      kind: "number",
      label: "Hours per day",
      maximum: 24,
      minimum: 0,
    },
    { id: "days", kind: "number", label: "Days", minimum: 0 },
    { id: "rate", kind: "number", label: "Price per kWh", minimum: 0 },
  ],
  outputs: [
    {
      format: "cost/appliance",
      id: "result",
      kind: "object",
      label: "Appliance cost",
    },
  ],
  calculate: (input) => {
    const result = calculateApplianceCost(
      input.watts as number,
      input.hoursPerDay as number,
      input.days as number,
      input.rate as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "hoursPerDay",
        "Enter a currency and no more than 24 hours per day.",
      );
    return { result };
  },
});
export const runApplianceCost = applianceCostTool.execute;
export default applianceCostTool;
