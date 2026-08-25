import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AbvSimpleSgDropInput = {
  readonly gravityDrop: number;
};

export type AbvSimpleSgDropOutput = {
  readonly alcoholByVolumePercent: number;
};

export const abvSimpleSgDropExample = {
  input: {
    gravityDrop: 0.09,
  },
  output: {
    alcoholByVolumePercent: 11.8125,
  },
} satisfies ToolExample<AbvSimpleSgDropInput, AbvSimpleSgDropOutput>;

export const calculateAbvSimpleSgDrop = (
  input: AbvSimpleSgDropInput,
): AbvSimpleSgDropOutput => {
  if (input.gravityDrop < 0)
    simpleError(
      "gravityDrop",
      "The gravity drop cannot be negative.",
      "invalid_value",
    );
  return {
    alcoholByVolumePercent: roundStatistic(input.gravityDrop * 131.25),
  };
};

export const abvSimpleSgDropTool = createSimpleTool({
  calculate: (input) =>
    calculateAbvSimpleSgDrop(input as unknown as AbvSimpleSgDropInput),
  description:
    "Estimate alcohol by volume from the specific-gravity drop using ABV ≈ gravity drop × 131.25; this common fermentation shortcut is not a laboratory alcohol measurement.",
  id: "oenology/abv-simple-sg-drop",
  inputs: [
    {
      description: "Original gravity minus final gravity.",
      id: "gravityDrop",
      label: "Gravity drop",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Approximate alcohol by volume of the wine.",
      id: "alcoholByVolumePercent",
      kind: "number",
      label: "Alcohol by volume",
      unit: "%",
    },
  ],
  title: "Simple ABV from SG Drop Calculator",
});
export const runAbvSimpleSgDrop = abvSimpleSgDropTool.execute;
export default abvSimpleSgDropTool;
