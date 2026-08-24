import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NoiInput = {
  readonly grossScheduledIncomeUsd: number;
  readonly otherAnnualIncomeUsd?: number;
  readonly vacancyAndCreditLossPercent?: number;
  readonly operatingExpensesUsd: number;
};

export type NoiOutput = {
  readonly vacancyLossUsd: number;
  readonly effectiveGrossIncomeUsd: number;
  readonly netOperatingIncomeUsd: number;
};

export const calculateNoi = (input: NoiInput): NoiOutput => {
  const other = input.otherAnnualIncomeUsd ?? 0;
  const vacancyPercent = input.vacancyAndCreditLossPercent ?? 5;
  if (!(input.grossScheduledIncomeUsd >= 0))
    return simpleError(
      "grossScheduledIncomeUsd",
      "Gross scheduled income cannot be negative.",
      "invalid_income",
    );
  if (!(other >= 0))
    return simpleError(
      "otherAnnualIncomeUsd",
      "Other income cannot be negative.",
      "invalid_income",
    );
  if (!(vacancyPercent >= 0 && vacancyPercent <= 100))
    return simpleError(
      "vacancyAndCreditLossPercent",
      "Vacancy and credit loss must lie between 0 and 100 percent.",
      "invalid_percent",
    );
  if (!(input.operatingExpensesUsd >= 0))
    return simpleError(
      "operatingExpensesUsd",
      "Operating expenses cannot be negative.",
      "invalid_expenses",
    );
  const vacancyLoss = (input.grossScheduledIncomeUsd * vacancyPercent) / 100;
  const effectiveGrossIncome =
    input.grossScheduledIncomeUsd - vacancyLoss + other;
  return {
    vacancyLossUsd: vacancyLoss,
    effectiveGrossIncomeUsd: effectiveGrossIncome,
    netOperatingIncomeUsd: effectiveGrossIncome - input.operatingExpensesUsd,
  };
};

export const noiExample = {
  input: {
    grossScheduledIncomeUsd: 180000,
    otherAnnualIncomeUsd: 6000,
    vacancyAndCreditLossPercent: 5,
    operatingExpensesUsd: 54000,
  },
  output: {
    vacancyLossUsd: 9000,
    effectiveGrossIncomeUsd: 177000,
    netOperatingIncomeUsd: 123000,
  },
} satisfies ToolExample<NoiInput, NoiOutput>;

export const noiTool = createSimpleTool({
  id: "real-estate/noi",
  title: "Net Operating Income Calculator",
  description:
    "Compute rental property net operating income from gross scheduled income, vacancy loss, other income and operating expenses (excluding debt service).",
  inputs: [
    {
      description: "Gross scheduled rental income per year in US dollars.",
      id: "grossScheduledIncomeUsd",
      kind: "number",
      label: "Gross rent",
    },
    {
      default: 0,
      description:
        "Other annual income such as parking or laundry in US dollars.",
      id: "otherAnnualIncomeUsd",
      kind: "number",
      label: "Other income",
    },
    {
      default: 5,
      description:
        "Vacancy and credit loss allowance in percent of gross scheduled income.",
      id: "vacancyAndCreditLossPercent",
      kind: "number",
      label: "Vacancy",
    },
    {
      description: "Total annual operating expenses in US dollars.",
      id: "operatingExpensesUsd",
      kind: "number",
      label: "Operating expenses",
    },
  ],
  outputs: [
    {
      description: "Vacancy and credit loss per year in US dollars.",
      id: "vacancyLossUsd",
      kind: "number",
      label: "Vacancy loss",
    },
    {
      description: "Effective gross income per year in US dollars.",
      id: "effectiveGrossIncomeUsd",
      kind: "number",
      label: "EGI",
    },
    {
      description: "Net operating income per year in US dollars.",
      id: "netOperatingIncomeUsd",
      kind: "number",
      label: "NOI",
    },
  ],
  calculate: (input) =>
    calculateNoi({
      grossScheduledIncomeUsd: input.grossScheduledIncomeUsd as number,
      operatingExpensesUsd: input.operatingExpensesUsd as number,
      otherAnnualIncomeUsd: input.otherAnnualIncomeUsd as number,
      vacancyAndCreditLossPercent: input.vacancyAndCreditLossPercent as number,
    }),
});

export const runNoi = noiTool.execute;
export default noiTool;
