import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EffectiveGrossIncomeInput = Readonly<{
  readonly potentialRent: number;
  readonly otherIncome: number;
  readonly vacancyLoss: number;
  readonly creditLoss: number;
}>;
export type EffectiveGrossIncomeOutput = Readonly<{
  readonly effectiveGrossIncome: number;
}>;

export const calculateEffectiveGrossIncome = (
  x: EffectiveGrossIncomeInput,
): EffectiveGrossIncomeOutput => {
  if (!Number.isFinite(x.potentialRent) || x.potentialRent < 0)
    simpleError("potentialRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.otherIncome) || x.otherIncome < 0)
    simpleError("otherIncome", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.vacancyLoss) || x.vacancyLoss < 0)
    simpleError("vacancyLoss", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.creditLoss) || x.creditLoss < 0)
    simpleError("creditLoss", "Provide a finite nonnegative number.");
  if (!(x.vacancyLoss + x.creditLoss <= x.potentialRent + x.otherIncome))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const effectiveGrossIncome =
    x.potentialRent + x.otherIncome - x.vacancyLoss - x.creditLoss;
  if (!Number.isFinite(effectiveGrossIncome))
    simpleError(
      "effectiveGrossIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    effectiveGrossIncome: Object.is(effectiveGrossIncome, -0)
      ? 0
      : effectiveGrossIncome,
  };
};

export const example = {
  input: {
    potentialRent: 100000,
    otherIncome: 5000,
    vacancyLoss: 5000,
    creditLoss: 1000,
  },
  output: { effectiveGrossIncome: 99000 },
} satisfies ToolExample<EffectiveGrossIncomeInput, EffectiveGrossIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/effective-gross-income",
  title: "Effective Gross Income",
  description:
    "Effective gross income: potential rental income plus other income, less vacancy and credit loss.",
  inputs: [
    {
      id: "potentialRent",
      kind: "number",
      label: "Potential Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "otherIncome",
      kind: "number",
      label: "Other Income",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "vacancyLoss",
      kind: "number",
      label: "Vacancy Loss",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "creditLoss",
      kind: "number",
      label: "Credit Loss",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "effectiveGrossIncome",
      kind: "number",
      label: "Effective Gross Income",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateEffectiveGrossIncome({
      potentialRent: input.potentialRent as number,
      otherIncome: input.otherIncome as number,
      vacancyLoss: input.vacancyLoss as number,
      creditLoss: input.creditLoss as number,
    }),
});
export const effectiveGrossIncomeTool = tool;
export const runEffectiveGrossIncome = tool.execute;
export default tool;
