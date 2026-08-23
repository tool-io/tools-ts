import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApportionablePremiumFactorInput = {
  readonly interestRate: number;
  readonly periodsPerYear: number;
};

export type ApportionablePremiumFactorOutput = {
  readonly apportionableFactor: number;
};

export const apportionablePremiumFactorExample = {
  input: {
    interestRate: 0.2,
    periodsPerYear: 2,
  },
  output: {
    apportionableFactor: 0.9583333333333334,
  },
} satisfies ToolExample<
  ApportionablePremiumFactorInput,
  ApportionablePremiumFactorOutput
>;

export const calculateApportionablePremiumFactor = (
  input: ApportionablePremiumFactorInput,
): ApportionablePremiumFactorOutput => {
  if (input.interestRate <= -1)
    simpleError(
      "interestRate",
      "The annual effective interest rate must be greater than -100%.",
      "invalid_interest_rate",
    );
  if (!Number.isSafeInteger(input.periodsPerYear) || input.periodsPerYear < 1)
    simpleError(
      "periodsPerYear",
      "Periods per year must be a positive integer.",
      "invalid_periods",
    );
  const discountRate = input.interestRate / (1 + input.interestRate);
  return {
    apportionableFactor:
      1 -
      ((input.periodsPerYear - 1) / (2 * input.periodsPerYear)) * discountRate,
  };
};

export const apportionablePremiumFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateApportionablePremiumFactor({
      interestRate: input.interestRate as number,
      periodsPerYear: input.periodsPerYear as number,
    }),
  description:
    "Calculate the apportionable premium factor that adjusts an annual premium for installment payment frequency assuming claims occur uniformly over the year.",
  id: "actuarial/apportionable-premium-factor",
  inputs: [
    {
      description:
        "Annual effective interest rate as a decimal, such as 0.05 for 5%; must be greater than -1.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: -0.9999999999999999,
    },
    {
      description:
        "Number of installments per year, for example four for quarterly.",
      id: "periodsPerYear",
      kind: "integer",
      label: "Periods per year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description:
        "Multiplier applied to the total annual premium to obtain the apportionable installment total.",
      id: "apportionableFactor",
      kind: "number",
      label: "Apportionable factor",
    },
  ],
  title: "Apportionable Premium Factor Calculator",
});
export const runApportionablePremiumFactor =
  apportionablePremiumFactorTool.execute;
export default apportionablePremiumFactorTool;
