import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DailyGrowthCoefficientInput = Readonly<{
  readonly initialWeightGrams: number;
  readonly finalWeightGrams: number;
  readonly elapsedDays: number;
}>;
export type DailyGrowthCoefficientOutput = Readonly<{
  readonly dailyGrowthCoefficient: number;
}>;

export const calculateDailyGrowthCoefficient = (
  x: DailyGrowthCoefficientInput,
): DailyGrowthCoefficientOutput => {
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
  const dailyGrowthCoefficient =
    (100 * (Math.cbrt(x.finalWeightGrams) - Math.cbrt(x.initialWeightGrams))) /
    x.elapsedDays;
  if (!Number.isFinite(dailyGrowthCoefficient))
    simpleError(
      "dailyGrowthCoefficient",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dailyGrowthCoefficient: Object.is(dailyGrowthCoefficient, -0)
      ? 0
      : dailyGrowthCoefficient,
  };
};

export const example = {
  input: {
    initialWeightGrams: 125,
    finalWeightGrams: 1000,
    elapsedDays: 10,
  },
  output: { dailyGrowthCoefficient: 50 },
} satisfies ToolExample<
  DailyGrowthCoefficientInput,
  DailyGrowthCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "aquaculture/daily-growth-coefficient",
  title: "Daily Growth Coefficient",
  description:
    "Compare cube-root body-weight growth per day; weight units must remain grams for comparison across batches.",
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
      id: "dailyGrowthCoefficient",
      kind: "number",
      label: "Daily Growth Coefficient",
      unit: "g^(1/3)/day ×100",
    },
  ],
  calculate: (input) =>
    calculateDailyGrowthCoefficient({
      initialWeightGrams: input.initialWeightGrams as number,
      finalWeightGrams: input.finalWeightGrams as number,
      elapsedDays: input.elapsedDays as number,
    }),
});
export const runDailyGrowthCoefficient = tool.execute;
export default tool;
