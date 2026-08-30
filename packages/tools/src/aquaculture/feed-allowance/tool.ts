import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeedAllowanceInput = Readonly<{
  readonly dailyFeedKilograms: number;
  readonly feedingDays: number;
}>;
export type FeedAllowanceOutput = Readonly<{
  readonly periodFeedKilograms: number;
}>;

export const calculateFeedAllowance = (
  x: FeedAllowanceInput,
): FeedAllowanceOutput => {
  if (!Number.isFinite(x.dailyFeedKilograms) || x.dailyFeedKilograms < 0)
    simpleError("dailyFeedKilograms", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.feedingDays) || x.feedingDays < 0)
    simpleError("feedingDays", "Provide a finite nonnegative number.");
  const periodFeedKilograms = x.dailyFeedKilograms * x.feedingDays;
  if (!Number.isFinite(periodFeedKilograms))
    simpleError(
      "periodFeedKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    periodFeedKilograms: Object.is(periodFeedKilograms, -0)
      ? 0
      : periodFeedKilograms,
  };
};

export const example = {
  input: {
    dailyFeedKilograms: 100,
    feedingDays: 7,
  },
  output: { periodFeedKilograms: 700 },
} satisfies ToolExample<FeedAllowanceInput, FeedAllowanceOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/feed-allowance",
  title: "Feed Allowance",
  description:
    "Calculate total feed allowance over a fixed number of days at an unchanged daily ration.",
  inputs: [
    {
      id: "dailyFeedKilograms",
      kind: "number",
      label: "Daily Feed Kilograms",
      unit: "kg/day",
    },
    { id: "feedingDays", kind: "number", label: "Feeding Days", unit: "days" },
  ],
  outputs: [
    {
      id: "periodFeedKilograms",
      kind: "number",
      label: "Period Feed Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateFeedAllowance({
      dailyFeedKilograms: input.dailyFeedKilograms as number,
      feedingDays: input.feedingDays as number,
    }),
});
export const runFeedAllowance = tool.execute;
export default tool;
