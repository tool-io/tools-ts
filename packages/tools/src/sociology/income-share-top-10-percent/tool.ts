import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IncomeShareTop10PercentInput = {
  readonly incomes: readonly number[];
  readonly shareFraction?: number;
};

export type IncomeShareTop10PercentOutput = {
  readonly topSharePercent: number;
};

export const incomeShareTop10PercentExample = {
  input: {
    incomes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    shareFraction: 0.1,
  },
  output: {
    topSharePercent: 18.181818181818183,
  },
} satisfies ToolExample<
  IncomeShareTop10PercentInput,
  IncomeShareTop10PercentOutput
>;

export const calculateIncomeShareTop10Percent = (
  input: IncomeShareTop10PercentInput,
): IncomeShareTop10PercentOutput => {
  const fraction = input.shareFraction ?? 0.1;
  if (!Number.isFinite(fraction) || fraction <= 0 || fraction >= 1)
    simpleError(
      "shareFraction",
      "The share fraction must sit strictly between zero and one.",
      "invalid_value",
    );
  if (
    input.incomes.length === 0 ||
    input.incomes.some((income) => !Number.isFinite(income) || income < 0)
  )
    simpleError(
      "incomes",
      "Supply at least one finite nonnegative income.",
      "invalid_value",
    );
  const sorted = [...input.incomes].sort((a, b) => a - b);
  const topCount = Math.max(1, Math.ceil(sorted.length * fraction));
  const scale = sorted.at(-1) ?? 0;
  if (!(scale > 0))
    simpleError(
      "incomes",
      "Total sample income must be a positive finite number.",
      "invalid_value",
    );
  const scaledTotal = sorted.reduce((sum, value) => sum + value / scale, 0);
  const scaledTopSum = sorted
    .slice(-topCount)
    .reduce((sum, value) => sum + value / scale, 0);
  return {
    topSharePercent: (scaledTopSum / scaledTotal) * 100,
  };
};

export const incomeShareTop10PercentTool = createSimpleTool({
  calculate: (input) =>
    calculateIncomeShareTop10Percent({
      incomes: input.incomes as readonly number[],
      shareFraction: input.shareFraction as number,
    }),
  description:
    "Compute the share of total income held by the richest decile or any chosen top fraction of a sample.",
  id: "sociology/income-share-top-10-percent",
  inputs: [
    {
      description: "Individual incomes in the sample.",
      id: "incomes",
      kind: "numberList",
      label: "Incomes",
    },
    {
      default: 0.1,
      description:
        "Top fraction of earners whose share is measured; one tenth gives the classic top ten percent.",
      id: "shareFraction",
      kind: "number",
      label: "Top fraction",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Percentage of all income held by the top group.",
      id: "topSharePercent",
      kind: "number",
      label: "Top share",
      unit: "%",
    },
  ],
  title: "Top 10% Income Share Calculator",
});
export const runIncomeShareTop10Percent = incomeShareTop10PercentTool.execute;
export default incomeShareTop10PercentTool;
