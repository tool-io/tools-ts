import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurvivalRateInput = Readonly<{
  readonly survivingAnimals: number;
  readonly initialAnimals: number;
}>;
export type SurvivalRateOutput = Readonly<{
  readonly survivalPercent: number;
}>;

export const calculateSurvivalRate = (
  x: SurvivalRateInput,
): SurvivalRateOutput => {
  if (
    !Number.isFinite(x.survivingAnimals) ||
    x.survivingAnimals < 0 ||
    !Number.isSafeInteger(x.survivingAnimals)
  )
    simpleError("survivingAnimals", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.initialAnimals) ||
    x.initialAnimals <= 0 ||
    !Number.isSafeInteger(x.initialAnimals)
  )
    simpleError("initialAnimals", "Provide a positive whole number.");
  if (x.survivingAnimals > x.initialAnimals)
    simpleError("survivingAnimals", "Survivors cannot exceed initial stock.");
  const survivalPercent = (x.survivingAnimals / x.initialAnimals) * 100;
  if (!Number.isFinite(survivalPercent))
    simpleError(
      "survivalPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    survivalPercent: Object.is(survivalPercent, -0) ? 0 : survivalPercent,
  };
};

export const example = {
  input: {
    survivingAnimals: 900,
    initialAnimals: 1000,
  },
  output: { survivalPercent: 90 },
} satisfies ToolExample<SurvivalRateInput, SurvivalRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/survival-rate",
  title: "Survival Rate",
  description:
    "Measure the fraction of the initial stocked animals surviving to a census.",
  inputs: [
    {
      id: "survivingAnimals",
      kind: "number",
      label: "Surviving Animals",
      unit: "animals",
    },
    {
      id: "initialAnimals",
      kind: "number",
      label: "Initial Animals",
      unit: "animals",
    },
  ],
  outputs: [
    {
      id: "survivalPercent",
      kind: "number",
      label: "Survival Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateSurvivalRate({
      survivingAnimals: input.survivingAnimals as number,
      initialAnimals: input.initialAnimals as number,
    }),
});
export const runSurvivalRate = tool.execute;
export default tool;
