import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BonusAccrualInput = {
  readonly bonusTarget: number;
  readonly monthsElapsed: number;
  readonly targetPercent: number;
};

export type BonusAccrualOutput = {
  readonly accruedToDate: number;
  readonly monthlyExpense: number;
};

export const bonusAccrualExample = {
  input: { bonusTarget: 120000, monthsElapsed: 5, targetPercent: 10 },
  output: { accruedToDate: 5000, monthlyExpense: 1000 },
} satisfies ToolExample<BonusAccrualInput, BonusAccrualOutput>;

export const calculateBonusAccrual = (
  input: BonusAccrualInput,
): BonusAccrualOutput => {
  if (!Number.isFinite(input.bonusTarget) || input.bonusTarget < 0)
    simpleError(
      "bonusTarget",
      "The bonus target must be a finite non-negative number.",
      "invalid_bonus_target",
    );
  if (
    !Number.isFinite(input.targetPercent) ||
    input.targetPercent < 0 ||
    input.targetPercent > 100
  )
    simpleError(
      "targetPercent",
      "The bonus rate must be a percentage between 0 and 100.",
      "invalid_bonus_percent",
    );
  if (!Number.isSafeInteger(input.monthsElapsed) || input.monthsElapsed < 0)
    simpleError(
      "monthsElapsed",
      "The months elapsed must be a non-negative whole number.",
      "invalid_months_elapsed",
    );
  const annualBonus = input.bonusTarget * (input.targetPercent / 100);
  const monthlyExpense = annualBonus / 12;
  const accruedToDate =
    input.monthsElapsed >= 12
      ? annualBonus
      : annualBonus * (input.monthsElapsed / 12);
  return {
    accruedToDate: accruedToDate === 0 ? 0 : accruedToDate,
    monthlyExpense: monthlyExpense === 0 ? 0 : monthlyExpense,
  };
};

export const bonusAccrualTool = createSimpleTool({
  calculate: (input) =>
    calculateBonusAccrual({
      bonusTarget: input.bonusTarget as number,
      monthsElapsed: input.monthsElapsed as number,
      targetPercent: input.targetPercent as number,
    }),
  description:
    "Accrue a bonus expense monthly straight line from a bonus target and percentage: per-month expense and the cumulative accrued amount after elapsed months.",
  id: "accounting/bonus-accrual-monthly-recognition",
  inputs: [
    {
      description:
        "Bonus base amount such as target net income or the salary base the bonus rate applies to.",
      id: "bonusTarget",
      kind: "number",
      label: "Bonus target",
      minimum: 0,
    },
    {
      description:
        "Bonus rate on a 0-100 percentage scale applied to the base.",
      id: "targetPercent",
      kind: "number",
      label: "Bonus rate percent",
      maximum: 100,
      minimum: 0,
    },
    {
      description:
        "Whole months of the year elapsed for the cumulative accrual; later than 12 is capped at the full-year bonus.",
      id: "monthsElapsed",
      kind: "integer",
      label: "Months elapsed",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Bonus expense recognized each month under straight-line accrual.",
      id: "monthlyExpense",
      kind: "number",
      label: "Monthly bonus expense",
    },
    {
      description:
        "Cumulative bonus liability accrued through the elapsed months, capped at the full-year bonus.",
      id: "accruedToDate",
      kind: "number",
      label: "Accrued to date",
    },
  ],
  title: "Bonus Accrual Monthly Recognition Calculator",
});
export const runBonusAccrual = bonusAccrualTool.execute;
export default bonusAccrualTool;
