import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative, positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly customerAcquisitionCost: number;
  readonly monthlyRevenuePerCustomer: number;
  readonly grossMarginFraction: number;
}>;
export type Output = Readonly<{
  readonly monthlyGrossProfit: number;
  readonly paybackMonths: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.customerAcquisitionCost, "customerAcquisitionCost");
  positive(input.monthlyRevenuePerCustomer, "monthlyRevenuePerCustomer");
  fraction(input.grossMarginFraction, "grossMarginFraction");
  positive(input.grossMarginFraction, "grossMarginFraction");
  const monthlyGrossProfit =
    input.monthlyRevenuePerCustomer * input.grossMarginFraction;
  return {
    monthlyGrossProfit,
    paybackMonths: input.customerAcquisitionCost / monthlyGrossProfit,
  };
};
export const exampleInput = {
  customerAcquisitionCost: 120,
  monthlyRevenuePerCustomer: 20,
  grossMarginFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  monthlyGrossProfit: 10,
  paybackMonths: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/gross-margin-cac-payback",
  title: "Gross Margin CAC Payback",
  description:
    "Estimate customer acquisition payback months from monthly gross profit.",
  inputs: [
    {
      id: "customerAcquisitionCost",
      label: "Customer acquisition cost",
      kind: "number",
    },
    {
      id: "monthlyRevenuePerCustomer",
      label: "Monthly revenue per customer",
      kind: "number",
    },
    {
      id: "grossMarginFraction",
      label: "Gross margin fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "monthlyGrossProfit", label: "Monthly gross profit", kind: "number" },
    { id: "paybackMonths", label: "Payback months", kind: "integer" },
  ],
  calculate: (value) =>
    calculate({
      customerAcquisitionCost: value.customerAcquisitionCost as number,
      monthlyRevenuePerCustomer: value.monthlyRevenuePerCustomer as number,
      grossMarginFraction: value.grossMarginFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
