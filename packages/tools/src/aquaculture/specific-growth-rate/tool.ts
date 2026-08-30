import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificGrowthRateInput = Readonly<{
  readonly initialWeightGrams: number;
  readonly finalWeightGrams: number;
  readonly elapsedDays: number;
}>;
export type SpecificGrowthRateOutput = Readonly<{
  readonly specificGrowthRatePercentPerDay: number;
}>;

export const calculateSpecificGrowthRate = (
  x: SpecificGrowthRateInput,
): SpecificGrowthRateOutput => {
  if (!Number.isFinite(x.initialWeightGrams) || x.initialWeightGrams < 0)
    simpleError("initialWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.finalWeightGrams) || x.finalWeightGrams < 0)
    simpleError("finalWeightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.elapsedDays) || x.elapsedDays < 0)
    simpleError("elapsedDays", "Provide a finite nonnegative number.");
  if (
    x.initialWeightGrams <= 0 ||
    x.finalWeightGrams <= 0 ||
    x.elapsedDays <= 0
  )
    simpleError(
      "initialWeightGrams",
      "Weights and elapsed days must be positive.",
    );
  const specificGrowthRatePercentPerDay =
    (100 * (Math.log(x.finalWeightGrams) - Math.log(x.initialWeightGrams))) /
    x.elapsedDays;
  if (!Number.isFinite(specificGrowthRatePercentPerDay))
    simpleError(
      "specificGrowthRatePercentPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    specificGrowthRatePercentPerDay: Object.is(
      specificGrowthRatePercentPerDay,
      -0,
    )
      ? 0
      : specificGrowthRatePercentPerDay,
  };
};

export const example = {
  input: {
    initialWeightGrams: 100,
    finalWeightGrams: 200,
    elapsedDays: 10,
  },
  output: { specificGrowthRatePercentPerDay: 6.931471805599445 },
} satisfies ToolExample<SpecificGrowthRateInput, SpecificGrowthRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/specific-growth-rate",
  title: "Specific Growth Rate",
  description:
    "Calculate log-based specific growth rate between two positive fish weights, in percent per day.",
  inputs: [
    {
      id: "initialWeightGrams",
      kind: "number",
      label: "Initial Weight Grams",
      unit: "g",
    },
    {
      id: "finalWeightGrams",
      kind: "number",
      label: "Final Weight Grams",
      unit: "g",
    },
    { id: "elapsedDays", kind: "number", label: "Elapsed Days", unit: "days" },
  ],
  outputs: [
    {
      id: "specificGrowthRatePercentPerDay",
      kind: "number",
      label: "Specific Growth Rate Percent Per Day",
      unit: "%/day",
    },
  ],
  calculate: (input) =>
    calculateSpecificGrowthRate({
      initialWeightGrams: input.initialWeightGrams as number,
      finalWeightGrams: input.finalWeightGrams as number,
      elapsedDays: input.elapsedDays as number,
    }),
});
export const runSpecificGrowthRate = tool.execute;
export default tool;
