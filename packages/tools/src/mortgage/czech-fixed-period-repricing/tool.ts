import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CzechFixedPeriodRepricingInput = {
  readonly fixedPeriodYears: number;
  readonly initialAnnualRatePercent: number;
  readonly principal: number;
  readonly repricedAnnualRatePercent: number;
  readonly termYears: number;
};

export type CzechFixedPeriodRepricingOutput = {
  readonly balanceAtRepricing: number;
  readonly initialMonthlyPayment: number;
  readonly projectedTotalInterest: number;
  readonly repricedMonthlyPayment: number;
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

export const calculateCzechFixedPeriodRepricing = (
  input: CzechFixedPeriodRepricingInput,
): CzechFixedPeriodRepricingOutput => {
  if (!(input.principal > 0))
    simpleError(
      "principal",
      "Principal must be greater than zero.",
      "principal_not_positive",
    );
  if (input.initialAnnualRatePercent < 0 || input.repricedAnnualRatePercent < 0)
    simpleError(
      "initialAnnualRatePercent",
      "Mortgage rates must not be negative.",
      "rate_negative",
    );
  if (
    !Number.isSafeInteger(input.fixedPeriodYears) ||
    !Number.isSafeInteger(input.termYears) ||
    input.fixedPeriodYears <= 0 ||
    input.fixedPeriodYears >= input.termYears
  )
    simpleError(
      "fixedPeriodYears",
      "The fixed period must be a whole number of years shorter than the term.",
      "fixed_period_invalid",
    );
  const totalMonths = input.termYears * 12;
  const fixedMonths = input.fixedPeriodYears * 12;
  const remainingMonths = totalMonths - fixedMonths;
  const initialMonthlyPayment = payment(
    input.principal,
    input.initialAnnualRatePercent,
    totalMonths,
  );
  const initialRate = input.initialAnnualRatePercent / 1_200;
  const balanceAtRepricing =
    initialRate === 0
      ? input.principal - initialMonthlyPayment * fixedMonths
      : input.principal * (1 + initialRate) ** fixedMonths -
        initialMonthlyPayment *
          (((1 + initialRate) ** fixedMonths - 1) / initialRate);
  const repricedMonthlyPayment = payment(
    balanceAtRepricing,
    input.repricedAnnualRatePercent,
    remainingMonths,
  );
  const projectedTotalInterest =
    initialMonthlyPayment * fixedMonths +
    repricedMonthlyPayment * remainingMonths -
    input.principal;
  if (
    ![
      initialMonthlyPayment,
      balanceAtRepricing,
      repricedMonthlyPayment,
      projectedTotalInterest,
    ].every(Number.isFinite)
  )
    simpleError(
      "principal",
      "The mortgage scenario is outside the supported numeric range.",
      "result_not_finite",
    );
  return {
    balanceAtRepricing,
    initialMonthlyPayment,
    projectedTotalInterest,
    repricedMonthlyPayment,
  };
};

export const czechFixedPeriodRepricingExample = {
  input: {
    fixedPeriodYears: 5,
    initialAnnualRatePercent: 4,
    principal: 3_000_000,
    repricedAnnualRatePercent: 6,
    termYears: 25,
  },
  output: {
    balanceAtRepricing: 2613138.487059556,
    initialMonthlyPayment: 15835.105208933104,
    projectedTotalInterest: 2443226.8858978953,
    repricedMonthlyPayment: 18721.335722341286,
  },
} satisfies ToolExample<
  CzechFixedPeriodRepricingInput,
  CzechFixedPeriodRepricingOutput
>;

export const czechFixedPeriodRepricingTool = createSimpleTool({
  calculate: (input) =>
    calculateCzechFixedPeriodRepricing({
      fixedPeriodYears: input.fixedPeriodYears as number,
      initialAnnualRatePercent: input.initialAnnualRatePercent as number,
      principal: input.principal as number,
      repricedAnnualRatePercent: input.repricedAnnualRatePercent as number,
      termYears: input.termYears as number,
    }),
  description:
    "Project a Czech-style amortizing mortgage through one fixed-rate period and one caller-supplied repricing scenario, excluding fees, insurance, and eligibility rules.",
  id: "mortgage/czech-fixed-period-repricing",
  inputs: [
    { id: "principal", kind: "number", label: "Principal", minimum: 0 },
    {
      id: "initialAnnualRatePercent",
      kind: "number",
      label: "Initial annual rate",
      minimum: 0,
      unit: "%",
    },
    {
      id: "repricedAnnualRatePercent",
      kind: "number",
      label: "Annual rate after repricing",
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
    {
      id: "fixedPeriodYears",
      kind: "integer",
      label: "Initial fixed period",
      minimum: 1,
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "initialMonthlyPayment",
      kind: "number",
      label: "Initial monthly payment",
    },
    {
      id: "balanceAtRepricing",
      kind: "number",
      label: "Balance at repricing",
    },
    {
      id: "repricedMonthlyPayment",
      kind: "number",
      label: "Repriced monthly payment",
    },
    {
      id: "projectedTotalInterest",
      kind: "number",
      label: "Projected total interest",
    },
  ],
  title: "Czech Mortgage Repricing Calculator",
});

export const runCzechFixedPeriodRepricing =
  czechFixedPeriodRepricingTool.execute;
export default czechFixedPeriodRepricingTool;
