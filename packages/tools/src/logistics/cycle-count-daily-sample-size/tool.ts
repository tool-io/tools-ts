import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CycleCountDailySampleSizeInput = {
  readonly countsPerSkuPerYear?: number;
  readonly operatingDaysPerYear?: number;
  readonly skuCount: number;
};

export type CycleCountDailySampleSizeOutput = {
  readonly dailySampleSize: number;
  readonly daysBetweenCountsOfEachSku: number;
};

export const calculateCycleCountDailySampleSize = (
  input: CycleCountDailySampleSizeInput,
): CycleCountDailySampleSizeOutput => {
  const countsPerSkuPerYear = input.countsPerSkuPerYear ?? 4;
  const operatingDaysPerYear = input.operatingDaysPerYear ?? 250;
  if (!(Number.isSafeInteger(input.skuCount) && input.skuCount >= 1))
    return simpleError(
      "skuCount",
      "SKU count must be a positive whole number.",
      "invalid_skus",
    );
  if (!Number.isFinite(countsPerSkuPerYear) || countsPerSkuPerYear <= 0)
    return simpleError(
      "countsPerSkuPerYear",
      "Counts per SKU per year must be greater than zero.",
      "invalid_counts",
    );
  if (!Number.isFinite(operatingDaysPerYear) || operatingDaysPerYear <= 0)
    return simpleError(
      "operatingDaysPerYear",
      "Operating days per year must be greater than zero.",
      "invalid_days",
    );
  const annualCountTasks = input.skuCount * countsPerSkuPerYear;
  const dailySampleSize = Math.ceil(annualCountTasks / operatingDaysPerYear);
  const daysBetweenCountsOfEachSku = operatingDaysPerYear / countsPerSkuPerYear;
  if (
    !Number.isFinite(annualCountTasks) ||
    annualCountTasks <= 0 ||
    !Number.isSafeInteger(dailySampleSize) ||
    dailySampleSize < 1 ||
    !Number.isFinite(daysBetweenCountsOfEachSku) ||
    daysBetweenCountsOfEachSku <= 0
  )
    return simpleError(
      "skuCount",
      "The cycle-count schedule is outside the representable range.",
      "schedule_out_of_range",
    );
  return { dailySampleSize, daysBetweenCountsOfEachSku };
};

export const cycleCountDailySampleSizeExample = {
  input: { skuCount: 8000, countsPerSkuPerYear: 4, operatingDaysPerYear: 250 },
  output: { dailySampleSize: 128, daysBetweenCountsOfEachSku: 62.5 },
} satisfies ToolExample<
  CycleCountDailySampleSizeInput,
  CycleCountDailySampleSizeOutput
>;

export const cycleCountDailySampleSizeTool = createSimpleTool({
  id: "logistics/cycle-count-daily-sample-size",
  title: "Cycle Count Daily Sample Size Calculator",
  description:
    "Determine the whole-number daily cycle-count workload needed to cover every SKU at the selected annual frequency, rounding the average workload up so the target is not missed.",
  inputs: [
    {
      description: "Number of SKUs in the count program.",
      id: "skuCount",
      kind: "integer",
      label: "SKUs",
      minimum: 1,
    },
    {
      default: 4,
      description:
        "Planned counts of each SKU per year; fractional frequencies are allowed.",
      id: "countsPerSkuPerYear",
      kind: "number",
      label: "Counts/SKU/yr",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 250,
      description: "Operating days per year available for counting.",
      id: "operatingDaysPerYear",
      kind: "number",
      label: "Operating days/yr",
      minimum: Number.MIN_VALUE,
      unit: "d",
    },
  ],
  outputs: [
    {
      description: "Whole SKUs to schedule per operating day, rounded up.",
      id: "dailySampleSize",
      kind: "integer",
      label: "Daily sample",
      minimum: 1,
    },
    {
      description:
        "Average operating days between successive counts of one SKU.",
      id: "daysBetweenCountsOfEachSku",
      kind: "number",
      label: "Days between counts",
      minimum: Number.MIN_VALUE,
      unit: "d",
    },
  ],
  calculate: (input) =>
    calculateCycleCountDailySampleSize({
      countsPerSkuPerYear: input.countsPerSkuPerYear as number | undefined,
      operatingDaysPerYear: input.operatingDaysPerYear as number | undefined,
      skuCount: input.skuCount as number,
    }),
});

export const runCycleCountDailySampleSize =
  cycleCountDailySampleSizeTool.execute;
export default cycleCountDailySampleSizeTool;
