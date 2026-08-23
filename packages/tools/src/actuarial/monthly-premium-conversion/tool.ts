import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MonthlyPremiumConversionInput = {
  readonly annualPremium: number;
  readonly interestRate: number;
};

export type MonthlyPremiumConversionOutput = {
  readonly monthlyPremium: number;
};

export const monthlyPremiumConversionExample = {
  input: {
    annualPremium: 1200,
    interestRate: 0.21,
  },
  output: {
    monthlyPremium: 108.965881321,
  },
} satisfies ToolExample<
  MonthlyPremiumConversionInput,
  MonthlyPremiumConversionOutput
>;

const convertToPeriods = (
  annualPremium: number,
  interestRate: number,
  periodsPerYear: number,
): number => {
  if (interestRate === 0) return annualPremium / periodsPerYear;
  const discount = 1 / (1 + interestRate);
  return (
    annualPremium * ((1 - discount ** (1 / periodsPerYear)) / (1 - discount))
  );
};

export const calculateMonthlyPremiumConversion = (
  input: MonthlyPremiumConversionInput,
): MonthlyPremiumConversionOutput => {
  return {
    monthlyPremium: roundStatistic(
      convertToPeriods(input.annualPremium, input.interestRate, 12),
    ),
  };
};

export const monthlyPremiumConversionTool = createSimpleTool({
  calculate: (input) =>
    calculateMonthlyPremiumConversion(
      input as unknown as MonthlyPremiumConversionInput,
    ),
  description:
    "Convert an annually payable premium into twelve equal monthly installments with the same present value at the given effective interest rate.",
  id: "actuarial/monthly-premium-conversion",
  inputs: [
    {
      description: "Premium payable once per year.",
      id: "annualPremium",
      kind: "number",
      label: "Annual premium",
      minimum: 0,
    },
    {
      description: "Annual effective interest rate used for equivalence.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Premium payable at the start of each month.",
      id: "monthlyPremium",
      kind: "number",
      label: "Monthly premium",
    },
  ],
  title: "Monthly Premium Conversion Calculator",
});
export const runMonthlyPremiumConversion = monthlyPremiumConversionTool.execute;
export default monthlyPremiumConversionTool;
