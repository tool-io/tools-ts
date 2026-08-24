import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WealthQuintileRatioInput = {
  readonly wealthValues: readonly number[];
};

export type WealthQuintileRatioOutput = {
  readonly quintileRatio: number;
};

export const wealthQuintileRatioExample = {
  input: {
    wealthValues: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
  },
  output: {
    quintileRatio: 6.333333333333333,
  },
} satisfies ToolExample<WealthQuintileRatioInput, WealthQuintileRatioOutput>;

export const calculateWealthQuintileRatio = (
  input: WealthQuintileRatioInput,
): WealthQuintileRatioOutput => {
  if (input.wealthValues.some((wealth) => !Number.isFinite(wealth)))
    simpleError(
      "wealthValues",
      "Wealth values must be finite numbers.",
      "invalid_value",
    );
  const values = [...input.wealthValues].sort((a, b) => a - b);
  const size = Math.floor(values.length / 5);
  if (size < 1)
    simpleError(
      "wealthValues",
      "At least five wealth values are needed to form quintiles.",
      "invalid_value",
    );
  const bottomMean = values.slice(0, size).reduce((s, v) => s + v, 0) / size;
  const topMean = values.slice(-size).reduce((s, v) => s + v, 0) / size;
  if (bottomMean <= 0)
    simpleError(
      "wealthValues",
      "The bottom quintile mean must be positive to form a ratio.",
      "invalid_value",
    );
  return {
    quintileRatio: topMean / bottomMean,
  };
};

export const wealthQuintileRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateWealthQuintileRatio({
      wealthValues: input.wealthValues as readonly number[],
    }),
  description:
    "Divide a wealth sample into fifths and report the ratio of the richest fifth's average to the poorest fifth's.",
  id: "sociology/wealth-quintile-ratio",
  inputs: [
    {
      description:
        "Household wealth values in the sample; at least five entries. The ratio requires a positive mean in the bottom fifth, so samples whose poorest fifth has zero or negative net wealth are rejected.",
      id: "wealthValues",
      kind: "numberList",
      label: "Wealth values",
    },
  ],
  outputs: [
    {
      description: "Top fifth mean divided by bottom fifth mean.",
      id: "quintileRatio",
      kind: "number",
      label: "Quintile ratio",
    },
  ],
  title: "Wealth Quintile Ratio Calculator",
});
export const runWealthQuintileRatio = wealthQuintileRatioTool.execute;
export default wealthQuintileRatioTool;
