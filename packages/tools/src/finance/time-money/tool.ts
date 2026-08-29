import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    netAnnualIncome: 52000,
    paidHoursPerWeek: 40,
    workWeeksPerYear: 52,
    extraHours: 1,
    cashSavings: 30,
  },
  output: {
    netHourlyValue: 25,
    timeCost: 25,
    netBenefit: 5,
    breakEvenSavings: 25,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "finance/time-money",
  title: "Time Versus Money Calculator",
  description:
    "Compare cash savings with the opportunity cost of extra time at a caller-supplied net hourly income. Travel, tax, and location-specific costs are not inferred; add them to the cash-saving input yourself.",
  inputs: [
    {
      id: "netAnnualIncome",
      kind: "number",
      label: "Net annual income",
      minimum: 0,
    },
    {
      id: "paidHoursPerWeek",
      kind: "number",
      label: "Paid hours per week",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "workWeeksPerYear",
      kind: "number",
      label: "Work weeks per year",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "extraHours",
      kind: "number",
      label: "Extra time in hours",
      minimum: 0,
    },
    { id: "cashSavings", kind: "number", label: "Cash savings" },
  ],
  outputs: [
    { id: "netHourlyValue", kind: "number", label: "Net hourly value" },
    { id: "timeCost", kind: "number", label: "Time cost" },
    { id: "netBenefit", kind: "number", label: "Net benefit" },
    {
      id: "breakEvenSavings",
      kind: "number",
      label: "Break-even cash savings",
    },
  ],
  calculate: (input) => {
    const netHourlyValue =
      (input.netAnnualIncome as number) /
      ((input.paidHoursPerWeek as number) * (input.workWeeksPerYear as number));
    const timeCost = netHourlyValue * (input.extraHours as number);
    if (!Number.isFinite(timeCost))
      simpleError("netAnnualIncome", "Result overflows.");
    return {
      netHourlyValue,
      timeCost,
      netBenefit: (input.cashSavings as number) - timeCost,
      breakEvenSavings: timeCost,
    };
  },
});
export type TimeMoneyInput = Readonly<typeof example.input>;
export type TimeMoneyOutput = Readonly<typeof example.output>;
export const timeMoneyTool = tool;
export const runTimeMoney = tool.execute;
export default tool;
