import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";
const compoundFrequencies = {
    daily: 365,
    monthly: 12,
    quarterly: 4,
    semiannually: 2,
    yearly: 1,
  } as const,
  contributionFrequencies = {
    weekly: 52,
    biweekly: 26,
    monthly: 12,
    quarterly: 4,
    yearly: 1,
  } as const;
export type CompoundFrequency = keyof typeof compoundFrequencies;
export type ContributionFrequency = keyof typeof contributionFrequencies;
export type CompoundInterestPoint = {
  readonly balance: number;
  readonly contributions: number;
  readonly fees: number;
  readonly interest: number;
  readonly principal: number;
  readonly year: number;
};
export type CompoundInterestResult = {
  readonly finalBalance: number;
  readonly points: readonly CompoundInterestPoint[];
  readonly totalContributions: number;
  readonly totalFees: number;
  readonly totalInterest: number;
  readonly totalPrincipal: number;
};
export const calculateCompoundInterest = (
  initialDeposit: number,
  years: number,
  annualReturnRate: number,
  compoundFrequency: CompoundFrequency,
  contributionAmount: number,
  contributionFrequency: ContributionFrequency,
  annualFeeRate: number,
): CompoundInterestResult | null => {
  if (
    years < 0 ||
    !(compoundFrequency in compoundFrequencies) ||
    !(contributionFrequency in contributionFrequencies)
  )
    return null;
  const totalDays = Math.round(years * 365),
    compoundEvents = compoundFrequencies[compoundFrequency],
    contributionEvents = contributionFrequencies[contributionFrequency];
  let balance = initialDeposit,
    totalContributions = 0,
    totalFees = 0,
    totalInterest = 0;
  const points: CompoundInterestPoint[] = [
    {
      balance,
      contributions: 0,
      fees: 0,
      interest: 0,
      principal: initialDeposit,
      year: 0,
    },
  ];
  const event = (day: number, count: number) =>
    Math.floor((day * count) / 365) > Math.floor(((day - 1) * count) / 365);
  for (let day = 1; day <= totalDays; day += 1) {
    if (event(day, compoundEvents)) {
      const interest = (balance * annualReturnRate) / compoundEvents;
      balance += interest;
      totalInterest += interest;
    }
    const fee = (Math.max(balance, 0) * annualFeeRate) / 365;
    balance -= fee;
    totalFees += fee;
    if (event(day, contributionEvents)) {
      balance += contributionAmount;
      totalContributions += contributionAmount;
    }
    if (day % 365 === 0 || day === totalDays)
      points.push({
        balance,
        contributions: totalContributions,
        fees: totalFees,
        interest: totalInterest,
        principal: initialDeposit + totalContributions,
        year: day / 365,
      });
    if (![balance, totalFees, totalInterest].every(Number.isFinite))
      return null;
  }
  return {
    finalBalance: balance,
    points,
    totalContributions,
    totalFees,
    totalInterest,
    totalPrincipal: initialDeposit + totalContributions,
  };
};
export const compoundInterestExample = {
  input: {
    annualFeeRatePercent: 0,
    annualReturnRatePercent: 5,
    compoundFrequency: "yearly",
    contributionAmount: 50,
    contributionFrequency: "monthly",
    initialDeposit: 1_000,
    years: 1,
  },
  output: {
    result: {
      finalBalance: 1_677.5,
      points: [
        {
          balance: 1_000,
          contributions: 0,
          fees: 0,
          interest: 0,
          principal: 1_000,
          year: 0,
        },
        {
          balance: 1_677.5,
          contributions: 600,
          fees: 0,
          interest: 77.5,
          principal: 1_600,
          year: 1,
        },
      ],
      totalContributions: 600,
      totalFees: 0,
      totalInterest: 77.5,
      totalPrincipal: 1_600,
    },
  },
} satisfies ToolExample<
  {
    readonly annualFeeRatePercent: number;
    readonly annualReturnRatePercent: number;
    readonly compoundFrequency: string;
    readonly contributionAmount: number;
    readonly contributionFrequency: string;
    readonly initialDeposit: number;
    readonly years: number;
  },
  { readonly result: CompoundInterestResult }
>;
export const compoundInterestTool = createSimpleTool({
  id: "compound-interest-calculator",
  title: "Compound Interest Calculator",
  description:
    "Project investment growth with recurring contributions, compounding, and annual fees.",
  inputs: [
    { id: "initialDeposit", kind: "number", label: "Initial deposit" },
    { id: "years", kind: "number", label: "Years", minimum: 0 },
    {
      id: "annualReturnRatePercent",
      kind: "number",
      label: "Annual return (%)",
    },
    {
      enum: Object.keys(compoundFrequencies),
      id: "compoundFrequency",
      kind: "string",
      label: "Compound frequency",
    },
    { id: "contributionAmount", kind: "number", label: "Contribution amount" },
    {
      enum: Object.keys(contributionFrequencies),
      id: "contributionFrequency",
      kind: "string",
      label: "Contribution frequency",
    },
    { id: "annualFeeRatePercent", kind: "number", label: "Annual fees (%)" },
  ],
  outputs: [
    {
      format: "finance/compound-interest",
      id: "result",
      kind: "object",
      label: "Projection",
    },
  ],
  calculate: (input) => {
    const result = calculateCompoundInterest(
      input.initialDeposit as number,
      input.years as number,
      (input.annualReturnRatePercent as number) / 100,
      input.compoundFrequency as CompoundFrequency,
      input.contributionAmount as number,
      input.contributionFrequency as ContributionFrequency,
      (input.annualFeeRatePercent as number) / 100,
    );
    if (!result)
      return simpleError(
        "years",
        "Enter finite values and a nonnegative duration.",
      );
    return { result };
  },
});
export const runCompoundInterest = compoundInterestTool.execute;
export default compoundInterestTool;
