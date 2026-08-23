import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type QuarterlyPremiumConversionInput = {
  readonly annualPremium: number;
  readonly interestRate: number;
};

export type QuarterlyPremiumConversionOutput = {
  readonly quarterlyPremium: number;
};

export const quarterlyPremiumConversionExample = {
  input: {
    annualPremium: 150,
    interestRate: 15,
  },
  output: {
    quarterlyPremium: 80,
  },
} satisfies ToolExample<
  QuarterlyPremiumConversionInput,
  QuarterlyPremiumConversionOutput
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

export const calculateQuarterlyPremiumConversion = (
  input: QuarterlyPremiumConversionInput,
): QuarterlyPremiumConversionOutput => {
  return {
    quarterlyPremium: roundStatistic(
      convertToPeriods(input.annualPremium, input.interestRate, 4),
    ),
  };
};

export const quarterlyPremiumConversionTool = createSimpleTool({
  calculate: (input) =>
    calculateQuarterlyPremiumConversion(
      input as unknown as QuarterlyPremiumConversionInput,
    ),
  description:
    "Convert an annually payable premium into four equal quarterly installments with the same present value at the given effective interest rate.",
  id: "actuarial/quarterly-premium-conversion",
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
      description: "Premium payable at the start of each quarter.",
      id: "quarterlyPremium",
      kind: "number",
      label: "Quarterly premium",
    },
  ],
  title: "Quarterly Premium Conversion Calculator",
});
export const runQuarterlyPremiumConversion =
  quarterlyPremiumConversionTool.execute;
export default quarterlyPremiumConversionTool;
