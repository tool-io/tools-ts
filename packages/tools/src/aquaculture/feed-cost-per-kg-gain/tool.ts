import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeedCostPerKgGainInput = Readonly<{
  readonly feedConversionRatio: number;
  readonly feedPricePerKilogram: number;
}>;
export type FeedCostPerKgGainOutput = Readonly<{
  readonly feedCostPerKgGain: number;
}>;

export const calculateFeedCostPerKgGain = (
  x: FeedCostPerKgGainInput,
): FeedCostPerKgGainOutput => {
  if (!Number.isFinite(x.feedConversionRatio) || x.feedConversionRatio < 0)
    simpleError("feedConversionRatio", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.feedPricePerKilogram) || x.feedPricePerKilogram < 0)
    simpleError("feedPricePerKilogram", "Provide a finite nonnegative number.");
  const feedCostPerKgGain = x.feedConversionRatio * x.feedPricePerKilogram;
  if (!Number.isFinite(feedCostPerKgGain))
    simpleError(
      "feedCostPerKgGain",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    feedCostPerKgGain: Object.is(feedCostPerKgGain, -0) ? 0 : feedCostPerKgGain,
  };
};

export const example = {
  input: {
    feedConversionRatio: 1.2,
    feedPricePerKilogram: 2,
  },
  output: { feedCostPerKgGain: 2.4 },
} satisfies ToolExample<FeedCostPerKgGainInput, FeedCostPerKgGainOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/feed-cost-per-kg-gain",
  title: "Feed Cost Per Kg Gain",
  description:
    "Estimate feed cost per kilogram of wet biomass gain from FCR and feed price; other production costs are excluded.",
  inputs: [
    {
      id: "feedConversionRatio",
      kind: "number",
      label: "Feed Conversion Ratio",
      unit: "kg/kg",
    },
    {
      id: "feedPricePerKilogram",
      kind: "number",
      label: "Feed Price Per Kilogram",
      unit: "currency/kg",
    },
  ],
  outputs: [
    {
      id: "feedCostPerKgGain",
      kind: "number",
      label: "Feed Cost Per Kg Gain",
      unit: "currency/kg gain",
    },
  ],
  calculate: (input) =>
    calculateFeedCostPerKgGain({
      feedConversionRatio: input.feedConversionRatio as number,
      feedPricePerKilogram: input.feedPricePerKilogram as number,
    }),
});
export const runFeedCostPerKgGain = tool.execute;
export default tool;
