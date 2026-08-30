import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualIncome: number;
  readonly incomeThreshold: number;
  readonly netWorth: number;
  readonly excludedResidenceValue: number;
  readonly netWorthThreshold: number;
}>;
export type Output = Readonly<{
  readonly adjustedNetWorth: number;
  readonly meetsIncomeThreshold: boolean;
  readonly meetsNetWorthThreshold: boolean;
  readonly meetsEitherThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const adjustedNetWorth = input.netWorth - input.excludedResidenceValue;
  const meetsIncomeThreshold = input.annualIncome >= input.incomeThreshold;
  const meetsNetWorthThreshold = adjustedNetWorth >= input.netWorthThreshold;
  return {
    adjustedNetWorth,
    meetsIncomeThreshold,
    meetsNetWorthThreshold,
    meetsEitherThreshold: meetsIncomeThreshold || meetsNetWorthThreshold,
  };
};

export const exampleInput = {
  annualIncome: 250000,
  incomeThreshold: 200000,
  netWorth: 900000,
  excludedResidenceValue: 200000,
  netWorthThreshold: 1000000,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  annualIncome: 100000,
  incomeThreshold: 200000,
  netWorth: 1200000,
  excludedResidenceValue: 100000,
  netWorthThreshold: 1000000,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualIncome: input.annualIncome as number,
      incomeThreshold: input.incomeThreshold as number,
      netWorth: input.netWorth as number,
      excludedResidenceValue: input.excludedResidenceValue as number,
      netWorthThreshold: input.netWorthThreshold as number,
    }),
  description:
    "Apply caller-supplied investor thresholds; the caller owns jurisdiction and period rules.",
  id: "banking/investor-threshold-screen",
  inputs: [
    {
      id: "annualIncome",
      label: "Annual income",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "incomeThreshold",
      label: "Income threshold",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    { id: "netWorth", label: "Net worth", kind: "number", unit: "currency" },
    {
      id: "excludedResidenceValue",
      label: "Excluded residence value",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "netWorthThreshold",
      label: "Net-worth threshold",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "adjustedNetWorth",
      label: "Adjusted net worth",
      kind: "number",
      unit: "currency",
    },
    {
      id: "meetsIncomeThreshold",
      label: "Meets income threshold",
      kind: "boolean",
    },
    {
      id: "meetsNetWorthThreshold",
      label: "Meets net-worth threshold",
      kind: "boolean",
    },
    {
      id: "meetsEitherThreshold",
      label: "Meets either threshold",
      kind: "boolean",
    },
  ],
  title: "Investor Threshold Screen",
});

export const run = tool.execute;
export default tool;
