import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly beginningStockBasis: number;
  readonly beginningDebtBasis: number;
  readonly incomeItems: number;
  readonly distributions: number;
  readonly lossDeductions: number;
  readonly debtRepayments: number;
}>;
export type Output = Readonly<{
  readonly endingStockBasis: number;
  readonly endingDebtBasis: number;
  readonly nondeductibleLoss: number;
  readonly distributionExcess: number;
}>;

export const calculate = (input: Input): Output => {
  const stockBeforeDistribution = input.beginningStockBasis + input.incomeItems;
  const distributionExcess = Math.max(
    0,
    input.distributions - stockBeforeDistribution,
  );
  let endingStockBasis = Math.max(
    0,
    stockBeforeDistribution - input.distributions,
  );
  const stockLossUsed = Math.min(endingStockBasis, input.lossDeductions);
  endingStockBasis -= stockLossUsed;
  const remainingLoss = input.lossDeductions - stockLossUsed;
  const debtAvailable = Math.max(
    0,
    input.beginningDebtBasis - input.debtRepayments,
  );
  const debtLossUsed = Math.min(debtAvailable, remainingLoss);
  const endingDebtBasis = debtAvailable - debtLossUsed;
  return {
    endingStockBasis,
    endingDebtBasis,
    nondeductibleLoss: remainingLoss - debtLossUsed,
    distributionExcess,
  };
};

export const exampleInput = {
  beginningStockBasis: 10000,
  beginningDebtBasis: 5000,
  incomeItems: 2000,
  distributions: 3000,
  lossDeductions: 12000,
  debtRepayments: 0,
} satisfies Input;
export const exampleOutput = {
  endingStockBasis: 0,
  endingDebtBasis: 2000,
  nondeductibleLoss: 0,
  distributionExcess: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      beginningStockBasis: input.beginningStockBasis as number,
      beginningDebtBasis: input.beginningDebtBasis as number,
      incomeItems: input.incomeItems as number,
      distributions: input.distributions as number,
      lossDeductions: input.lossDeductions as number,
      debtRepayments: input.debtRepayments as number,
    }),
  description:
    "Track simplified stock and debt basis ordering from caller-supplied annual adjustments.",
  id: "taxation/s-corp-basis-tracker",
  inputs: [
    {
      id: "beginningStockBasis",
      label: "Beginning stock basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "beginningDebtBasis",
      label: "Beginning debt basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "incomeItems",
      label: "Income and contributions",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "distributions",
      label: "Distributions",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "lossDeductions",
      label: "Loss deductions",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "debtRepayments",
      label: "Debt repayments",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "endingStockBasis",
      label: "Ending stock basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "endingDebtBasis",
      label: "Ending debt basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "nondeductibleLoss",
      label: "Loss exceeding basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "distributionExcess",
      label: "Distribution exceeding stock basis",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "S-Corp Basis Tracker",
});

export const run = tool.execute;
export default tool;
