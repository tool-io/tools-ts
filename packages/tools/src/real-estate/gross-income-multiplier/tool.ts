import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrossIncomeMultiplierInput = Readonly<{
  readonly salePrice: number;
  readonly annualGrossIncome: number;
}>;
export type GrossIncomeMultiplierOutput = Readonly<{
  readonly grossIncomeMultiplier: number;
}>;

export const calculateGrossIncomeMultiplier = (
  x: GrossIncomeMultiplierInput,
): GrossIncomeMultiplierOutput => {
  if (!Number.isFinite(x.salePrice) || x.salePrice < 0)
    simpleError("salePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.annualGrossIncome) || x.annualGrossIncome <= 0)
    simpleError("annualGrossIncome", "Provide a finite positive number.");
  const grossIncomeMultiplier = x.salePrice / x.annualGrossIncome;
  if (!Number.isFinite(grossIncomeMultiplier))
    simpleError(
      "grossIncomeMultiplier",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    grossIncomeMultiplier: Object.is(grossIncomeMultiplier, -0)
      ? 0
      : grossIncomeMultiplier,
  };
};

export const example = {
  input: {
    salePrice: 200000,
    annualGrossIncome: 20000,
  },
  output: { grossIncomeMultiplier: 10 },
} satisfies ToolExample<
  GrossIncomeMultiplierInput,
  GrossIncomeMultiplierOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/gross-income-multiplier",
  title: "Gross Income Multiplier",
  description:
    "Gross income multiplier from sale price divided by annual gross income.",
  inputs: [
    {
      id: "salePrice",
      kind: "number",
      label: "Sale Price",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "annualGrossIncome",
      kind: "number",
      label: "Annual Gross Income",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "grossIncomeMultiplier",
      kind: "number",
      label: "Gross Income Multiplier",
    },
  ],
  calculate: (input) =>
    calculateGrossIncomeMultiplier({
      salePrice: input.salePrice as number,
      annualGrossIncome: input.annualGrossIncome as number,
    }),
});
export const grossIncomeMultiplierTool = tool;
export const runGrossIncomeMultiplier = tool.execute;
export default tool;
