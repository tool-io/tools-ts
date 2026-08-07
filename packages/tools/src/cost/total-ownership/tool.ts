import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type TotalOwnershipCost = {
  readonly averageAnnualCost: number;
  readonly currency: string;
  readonly purchasePrice: number;
  readonly recurringCosts: number;
  readonly resaleValue: number;
  readonly totalCost: number;
};
export const calculateTotalOwnershipCost = (
  purchasePrice: number,
  years: number,
  annualOperating: number,
  annualMaintenance: number,
  annualInsurance: number,
  resaleValue: number,
  currency: string,
): TotalOwnershipCost | null => {
  if (!currency.trim() || years <= 0) return null;
  const recurringCosts =
      (annualOperating + annualMaintenance + annualInsurance) * years,
    totalCost = purchasePrice + recurringCosts - resaleValue;
  return {
    averageAnnualCost: totalCost / years,
    currency,
    purchasePrice,
    recurringCosts,
    resaleValue,
    totalCost,
  };
};
export const totalOwnershipCostExample = {
  input: {
    annualInsurance: 1_200,
    annualMaintenance: 1_000,
    annualOperating: 2_000,
    currency: "USD",
    purchasePrice: 30_000,
    resaleValue: 15_000,
    years: 5,
  },
  output: {
    result: {
      averageAnnualCost: 7_200,
      currency: "USD",
      purchasePrice: 30_000,
      recurringCosts: 21_000,
      resaleValue: 15_000,
      totalCost: 36_000,
    },
  },
} satisfies ToolExample<
  {
    readonly annualInsurance: number;
    readonly annualMaintenance: number;
    readonly annualOperating: number;
    readonly currency: string;
    readonly purchasePrice: number;
    readonly resaleValue: number;
    readonly years: number;
  },
  { readonly result: TotalOwnershipCost }
>;
export const totalOwnershipCostTool = createSimpleTool({
  id: "cost/total-ownership",
  title: "Total Cost of Ownership Calculator",
  description:
    "Estimate lifetime ownership cost after recurring expenses and expected resale value.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    {
      id: "purchasePrice",
      kind: "number",
      label: "Purchase price",
      minimum: 0,
    },
    {
      id: "years",
      kind: "number",
      label: "Years owned",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "annualOperating",
      kind: "number",
      label: "Annual operating cost",
      minimum: 0,
    },
    {
      id: "annualMaintenance",
      kind: "number",
      label: "Annual maintenance",
      minimum: 0,
    },
    {
      id: "annualInsurance",
      kind: "number",
      label: "Annual insurance",
      minimum: 0,
    },
    {
      id: "resaleValue",
      kind: "number",
      label: "Expected resale value",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "cost/total-ownership",
      id: "result",
      kind: "object",
      label: "Ownership cost",
    },
  ],
  calculate: (input) => {
    const result = calculateTotalOwnershipCost(
      input.purchasePrice as number,
      input.years as number,
      input.annualOperating as number,
      input.annualMaintenance as number,
      input.annualInsurance as number,
      input.resaleValue as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "years",
        "Years owned must be positive and currency nonempty.",
      );
    return { result };
  },
});
export const runTotalOwnershipCost = totalOwnershipCostTool.execute;
export default totalOwnershipCostTool;
