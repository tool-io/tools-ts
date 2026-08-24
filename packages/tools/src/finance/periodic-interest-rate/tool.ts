import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeriodicInterestRateInput = {
  readonly annualRatePercent: number;
  readonly periodsPerYear?: number;
};

export type PeriodicInterestRateOutput = {
  readonly periodicRatePercent: number;
  readonly effectiveAnnualRatePercent: number;
};

export const calculatePeriodicInterestRate = (
  input: PeriodicInterestRateInput,
): PeriodicInterestRateOutput => {
  const periodsPerYear = input.periodsPerYear ?? 12;
  if (!Number.isInteger(periodsPerYear) || periodsPerYear < 1)
    simpleError(
      "periodsPerYear",
      "Periods per year must be a positive integer.",
    );
  const periodicRatePercent = input.annualRatePercent / periodsPerYear;
  const periodicRate = periodicRatePercent / 100;
  if (periodicRate <= -1)
    simpleError(
      "annualRatePercent",
      "The rate per period must be greater than -100 percent.",
    );
  const effectiveAnnualRatePercent =
    Math.expm1(periodsPerYear * Math.log1p(periodicRate)) * 100;
  if (!Number.isFinite(effectiveAnnualRatePercent))
    simpleError(
      "annualRatePercent",
      "The effective annual rate exceeds the numeric range.",
    );
  return {
    periodicRatePercent,
    effectiveAnnualRatePercent,
  };
};

export const periodicInterestRateExample = {
  input: {
    annualRatePercent: 12,
  },
  output: {
    periodicRatePercent: 1,
    effectiveAnnualRatePercent: 12.682503013196971,
  },
} satisfies ToolExample<PeriodicInterestRateInput, PeriodicInterestRateOutput>;

export const periodicInterestRateTool = createSimpleTool({
  id: "finance/periodic-interest-rate",
  title: "Periodic Interest Rate Calculator",
  description:
    "Convert a nominal annual interest rate into the per-period rate and the effective annual rate for a compounding frequency.",
  inputs: [
    {
      description: "Nominal annual interest rate in percent.",
      id: "annualRatePercent",
      kind: "number",
      label: "Annual rate",
    },
    {
      description:
        "Compounding frequency, e.g. 12 for monthly or 4 for quarterly.",
      default: 12,
      id: "periodsPerYear",
      kind: "integer",
      label: "Periods per year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Nominal annual rate divided by the number of periods per year.",
      id: "periodicRatePercent",
      kind: "number",
      label: "periodicRatePercent",
      unit: "%",
    },
    {
      description:
        "Effective annual rate earned with compounding at the periodic rate.",
      id: "effectiveAnnualRatePercent",
      kind: "number",
      label: "effectiveAnnualRatePercent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculatePeriodicInterestRate({
      annualRatePercent: input.annualRatePercent as number,
      periodsPerYear: input.periodsPerYear as number,
    }),
});

export const runPeriodicInterestRate = periodicInterestRateTool.execute;
export default periodicInterestRateTool;
