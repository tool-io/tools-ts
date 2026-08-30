import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cashOnHand: number;
  readonly currentMonthlyRevenue: number;
  readonly monthlyOperatingCost: number;
  readonly revenueGrowthFraction: number;
  readonly forecastMonths: number;
}>;
export type Output = Readonly<{
  readonly defaultAlive: boolean;
  readonly monthsToBreakeven: number;
  readonly cashAtExit: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.cashOnHand < 0 ||
    input.currentMonthlyRevenue < 0 ||
    input.monthlyOperatingCost <= 0 ||
    input.revenueGrowthFraction < 0 ||
    !Number.isSafeInteger(input.forecastMonths) ||
    input.forecastMonths < 0 ||
    input.forecastMonths > 120
  )
    simpleError(
      "cashOnHand",
      "Nonnegative cash/revenue/growth, positive costs and finite forecast horizon required.",
    );
  let cash = input.cashOnHand,
    revenue = input.currentMonthlyRevenue;
  for (let month = 0; month <= input.forecastMonths; month++) {
    if (revenue >= input.monthlyOperatingCost)
      return {
        defaultAlive: true,
        monthsToBreakeven: month,
        cashAtExit: cash,
      };
    cash -= input.monthlyOperatingCost - revenue;
    if (cash < 0) break;
    revenue *= 1 + input.revenueGrowthFraction;
  }
  return { defaultAlive: false, monthsToBreakeven: -1, cashAtExit: cash };
};
export const exampleInput = {
  cashOnHand: 100,
  currentMonthlyRevenue: 80,
  monthlyOperatingCost: 100,
  revenueGrowthFraction: 0.25,
  forecastMonths: 6,
} satisfies Input;
export const exampleOutput = {
  defaultAlive: true,
  monthsToBreakeven: 1,
  cashAtExit: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/default-alive-runway",
  title: "Default Alive Runway",
  description:
    "Simulate whether recurring revenue reaches operating cost before cash runs out.",
  inputs: [
    { id: "cashOnHand", label: "Cash on hand", kind: "number" },
    {
      id: "currentMonthlyRevenue",
      label: "Current monthly revenue",
      kind: "number",
    },
    {
      id: "monthlyOperatingCost",
      label: "Monthly operating cost",
      kind: "number",
    },
    {
      id: "revenueGrowthFraction",
      label: "Revenue growth fraction",
      kind: "number",
    },
    { id: "forecastMonths", label: "Forecast months", kind: "number" },
  ],
  outputs: [
    { id: "defaultAlive", label: "Default alive", kind: "boolean" },
    {
      id: "monthsToBreakeven",
      label: "Months to breakeven",
      kind: "number",
      description:
        "Minus one if breakeven was not reached before cash ran out or the forecast ended.",
    },
    {
      id: "cashAtExit",
      label: "Cash at forecast exit",
      kind: "number",
      description:
        "Cash when breakeven occurs, cash is exhausted, or the forecast ends.",
    },
  ],
  calculate: (value) =>
    calculate({
      cashOnHand: value.cashOnHand as number,
      currentMonthlyRevenue: value.currentMonthlyRevenue as number,
      monthlyOperatingCost: value.monthlyOperatingCost as number,
      revenueGrowthFraction: value.revenueGrowthFraction as number,
      forecastMonths: value.forecastMonths as number,
    }),
});
export const run = tool.execute;
export default tool;
