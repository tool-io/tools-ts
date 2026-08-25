import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeedConversionRatioInput = {
  readonly feedConsumedKg: number;
  readonly weightGainKg: number;
};

export type FeedConversionRatioOutput = {
  readonly feedConversionRatio: number;
};

export const feedConversionRatioExample = {
  input: { feedConsumedKg: 200, weightGainKg: 50 },
  output: { feedConversionRatio: 4 },
} satisfies ToolExample<FeedConversionRatioInput, FeedConversionRatioOutput>;

export const feedConversionRatioTool = createSimpleTool({
  id: "biology/feed-conversion-ratio",
  title: "FCR Calculator",
  description:
    "Compute the feed conversion ratio as feed consumed in kilograms divided by live weight gain in kilograms.",
  inputs: [
    {
      description: "Feed consumed in kilograms; must not be negative.",
      id: "feedConsumedKg",
      kind: "number",
      label: "Feed consumed",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Live weight gain in kilograms; must be greater than zero.",
      id: "weightGainKg",
      kind: "number",
      label: "Weight gain",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Kilograms of feed per kilogram of gain.",
      id: "feedConversionRatio",
      kind: "number",
      label: "Feed conversion ratio",
      unit: "kg/kg",
    },
  ],
  calculate: (input) => {
    const feedConsumedKg = input.feedConsumedKg as number;
    const weightGainKg = input.weightGainKg as number;
    if (!(weightGainKg > 0))
      simpleError(
        "weightGainKg",
        "The weight gain must be greater than zero.",
        "zero_gain",
      );
    return { feedConversionRatio: feedConsumedKg / weightGainKg };
  },
});
export const runFeedConversionRatio = feedConversionRatioTool.execute;
export default feedConversionRatioTool;
