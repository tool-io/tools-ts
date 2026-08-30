import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DailyFeedRateInput = Readonly<{
  readonly biomassKilograms: number;
  readonly feedingRatePercentPerDay: number;
}>;
export type DailyFeedRateOutput = Readonly<{
  readonly dailyFeedKilograms: number;
}>;

export const calculateDailyFeedRate = (
  x: DailyFeedRateInput,
): DailyFeedRateOutput => {
  if (!Number.isFinite(x.biomassKilograms) || x.biomassKilograms < 0)
    simpleError("biomassKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.feedingRatePercentPerDay) ||
    x.feedingRatePercentPerDay < 0
  )
    simpleError(
      "feedingRatePercentPerDay",
      "Provide a finite nonnegative number.",
    );
  const dailyFeedKilograms =
    (x.biomassKilograms * x.feedingRatePercentPerDay) / 100;
  if (!Number.isFinite(dailyFeedKilograms))
    simpleError(
      "dailyFeedKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dailyFeedKilograms: Object.is(dailyFeedKilograms, -0)
      ? 0
      : dailyFeedKilograms,
  };
};

export const example = {
  input: {
    biomassKilograms: 1000,
    feedingRatePercentPerDay: 2,
  },
  output: { dailyFeedKilograms: 20 },
} satisfies ToolExample<DailyFeedRateInput, DailyFeedRateOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/daily-feed-rate",
  title: "Daily Feed Rate",
  description:
    "Convert a chosen daily feeding percentage of live biomass into feed mass per day.",
  inputs: [
    {
      id: "biomassKilograms",
      kind: "number",
      label: "Biomass Kilograms",
      unit: "kg",
    },
    {
      id: "feedingRatePercentPerDay",
      kind: "number",
      label: "Feeding Rate Percent Per Day",
      unit: "%/day",
    },
  ],
  outputs: [
    {
      id: "dailyFeedKilograms",
      kind: "number",
      label: "Daily Feed Kilograms",
      unit: "kg/day",
    },
  ],
  calculate: (input) =>
    calculateDailyFeedRate({
      biomassKilograms: input.biomassKilograms as number,
      feedingRatePercentPerDay: input.feedingRatePercentPerDay as number,
    }),
});
export const runDailyFeedRate = tool.execute;
export default tool;
