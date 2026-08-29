import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EgyptSubsidizedComparisonInput = {
  readonly marketAnnualRatePercent: number;
  readonly principal: number;
  readonly subsidizedAnnualRatePercent: number;
  readonly termYears: number;
};

export type EgyptSubsidizedComparisonOutput = {
  readonly marketMonthlyPayment: number;
  readonly marketTotalInterest: number;
  readonly monthlyPaymentSavings: number;
  readonly subsidizedMonthlyPayment: number;
  readonly subsidizedTotalInterest: number;
  readonly totalInterestSavings: number;
};

const payment = (
  principal: number,
  annualRatePercent: number,
  months: number,
) => {
  const rate = annualRatePercent / 1_200;
  return rate === 0
    ? principal / months
    : (principal * rate) / (1 - (1 + rate) ** -months);
};

export const calculateEgyptSubsidizedComparison = (
  input: EgyptSubsidizedComparisonInput,
): EgyptSubsidizedComparisonOutput => {
  if (!(input.principal > 0))
    simpleError(
      "principal",
      "Principal must be greater than zero.",
      "principal_not_positive",
    );
  if (
    input.marketAnnualRatePercent < 0 ||
    input.subsidizedAnnualRatePercent < 0
  )
    simpleError(
      "subsidizedAnnualRatePercent",
      "Mortgage rates must not be negative.",
      "rate_negative",
    );
  if (!Number.isSafeInteger(input.termYears) || input.termYears <= 0)
    simpleError(
      "termYears",
      "Mortgage term must be a positive whole number of years.",
      "term_invalid",
    );
  const months = input.termYears * 12;
  const subsidizedMonthlyPayment = payment(
    input.principal,
    input.subsidizedAnnualRatePercent,
    months,
  );
  const marketMonthlyPayment = payment(
    input.principal,
    input.marketAnnualRatePercent,
    months,
  );
  const subsidizedTotalInterest =
    subsidizedMonthlyPayment * months - input.principal;
  const marketTotalInterest = marketMonthlyPayment * months - input.principal;
  return {
    marketMonthlyPayment,
    marketTotalInterest,
    monthlyPaymentSavings: marketMonthlyPayment - subsidizedMonthlyPayment,
    subsidizedMonthlyPayment,
    subsidizedTotalInterest,
    totalInterestSavings: marketTotalInterest - subsidizedTotalInterest,
  };
};

export const egyptSubsidizedComparisonExample = {
  input: {
    marketAnnualRatePercent: 12,
    principal: 1_000_000,
    subsidizedAnnualRatePercent: 8,
    termYears: 20,
  },
  output: {
    marketMonthlyPayment: 11010.861335696098,
    marketTotalInterest: 1642606.7205670634,
    monthlyPaymentSavings: 2646.4606457614354,
    subsidizedMonthlyPayment: 8364.400689934662,
    subsidizedTotalInterest: 1007456.165584319,
    totalInterestSavings: 635150.5549827444,
  },
} satisfies ToolExample<
  EgyptSubsidizedComparisonInput,
  EgyptSubsidizedComparisonOutput
>;

export const egyptSubsidizedComparisonTool = createSimpleTool({
  calculate: (input) =>
    calculateEgyptSubsidizedComparison({
      marketAnnualRatePercent: input.marketAnnualRatePercent as number,
      principal: input.principal as number,
      subsidizedAnnualRatePercent: input.subsidizedAnnualRatePercent as number,
      termYears: input.termYears as number,
    }),
  description:
    "Compare two caller-supplied fixed-rate Egyptian mortgage scenarios; this repayment estimate does not determine subsidy eligibility, fees, or program terms.",
  id: "mortgage/egypt-subsidized-comparison",
  inputs: [
    { id: "principal", kind: "number", label: "Principal", minimum: 0 },
    {
      id: "subsidizedAnnualRatePercent",
      kind: "number",
      label: "Subsidized annual rate",
      minimum: 0,
      unit: "%",
    },
    {
      id: "marketAnnualRatePercent",
      kind: "number",
      label: "Market annual rate",
      minimum: 0,
      unit: "%",
    },
    {
      id: "termYears",
      kind: "integer",
      label: "Mortgage term",
      minimum: 1,
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "subsidizedMonthlyPayment",
      kind: "number",
      label: "Subsidized monthly payment",
    },
    {
      id: "marketMonthlyPayment",
      kind: "number",
      label: "Market monthly payment",
    },
    {
      id: "monthlyPaymentSavings",
      kind: "number",
      label: "Monthly payment savings",
    },
    {
      id: "subsidizedTotalInterest",
      kind: "number",
      label: "Subsidized total interest",
    },
    {
      id: "marketTotalInterest",
      kind: "number",
      label: "Market total interest",
    },
    {
      id: "totalInterestSavings",
      kind: "number",
      label: "Total interest savings",
    },
  ],
  title: "Egypt Subsidized Mortgage Comparison",
});

export const runEgyptSubsidizedComparison =
  egyptSubsidizedComparisonTool.execute;
export default egyptSubsidizedComparisonTool;
