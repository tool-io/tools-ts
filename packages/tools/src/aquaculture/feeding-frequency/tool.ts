import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeedingFrequencyInput = Readonly<{
  readonly dailyFeedKilograms: number;
  readonly maxFeedPerMealKilograms: number;
}>;
export type FeedingFrequencyOutput = Readonly<{
  readonly minimumMealsPerDay: number;
}>;

export const calculateFeedingFrequency = (
  x: FeedingFrequencyInput,
): FeedingFrequencyOutput => {
  if (!Number.isFinite(x.dailyFeedKilograms) || x.dailyFeedKilograms < 0)
    simpleError("dailyFeedKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.maxFeedPerMealKilograms) ||
    x.maxFeedPerMealKilograms <= 0
  )
    simpleError("maxFeedPerMealKilograms", "Provide a finite positive number.");
  const minimumMealsPerDay = Math.ceil(
    x.dailyFeedKilograms / x.maxFeedPerMealKilograms,
  );
  if (!Number.isFinite(minimumMealsPerDay))
    simpleError(
      "minimumMealsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    minimumMealsPerDay: Object.is(minimumMealsPerDay, -0)
      ? 0
      : minimumMealsPerDay,
  };
};

export const example = {
  input: {
    dailyFeedKilograms: 100,
    maxFeedPerMealKilograms: 25,
  },
  output: { minimumMealsPerDay: 4 },
} satisfies ToolExample<FeedingFrequencyInput, FeedingFrequencyOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/feeding-frequency",
  title: "Feeding Frequency",
  description:
    "Find the minimum whole number of meals to distribute a chosen daily ration without exceeding a chosen mass per meal.",
  inputs: [
    {
      id: "dailyFeedKilograms",
      kind: "number",
      label: "Daily Feed Kilograms",
      unit: "kg/day",
    },
    {
      id: "maxFeedPerMealKilograms",
      kind: "number",
      label: "Max Feed Per Meal Kilograms",
      unit: "kg/meal",
    },
  ],
  outputs: [
    {
      id: "minimumMealsPerDay",
      kind: "number",
      label: "Minimum Meals Per Day",
      unit: "meals/day",
    },
  ],
  calculate: (input) =>
    calculateFeedingFrequency({
      dailyFeedKilograms: input.dailyFeedKilograms as number,
      maxFeedPerMealKilograms: input.maxFeedPerMealKilograms as number,
    }),
});
export const runFeedingFrequency = tool.execute;
export default tool;
