import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SemiannualPremiumConversionInput = {
  readonly annualPremium: number;
  readonly interestRate: number;
};

export type SemiannualPremiumConversionOutput = {
  readonly semiannualPremium: number;
};

export const semiannualPremiumConversionExample = {
  input: {
    annualPremium: 1050,
    interestRate: 0.21,
  },
  output: {
    semiannualPremium: 550,
  },
} satisfies ToolExample<
  SemiannualPremiumConversionInput,
  SemiannualPremiumConversionOutput
>;

export const calculateSemiannualPremiumConversion = (
  input: SemiannualPremiumConversionInput,
): SemiannualPremiumConversionOutput => {
  return {
    semiannualPremium: roundStatistic(
      convertToPeriods(input.annualPremium, input.interestRate, 2),
    ),
  };
};

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

export const semiannualPremiumConversionTool = createSimpleTool({
  calculate: (input) =>
    calculateSemiannualPremiumConversion(
      input as unknown as SemiannualPremiumConversionInput,
    ),
  description:
    "Convert an annually payable premium into two equal semiannual installments with the same present value at the given effective interest rate.",
  id: "actuarial/semiannual-premium-conversion",
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
      description: "Premium payable at the start of each half-year.",
      id: "semiannualPremium",
      kind: "number",
      label: "Semiannual premium",
    },
  ],
  title: "Semiannual Premium Conversion Calculator",
});
export const runSemiannualPremiumConversion =
  semiannualPremiumConversionTool.execute;
export default semiannualPremiumConversionTool;
