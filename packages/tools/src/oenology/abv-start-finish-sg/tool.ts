import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AbvStartFinishSgInput = {
  readonly finishingGravity: number;
  readonly startingGravity: number;
};

export type AbvStartFinishSgOutput = {
  readonly alcoholByVolumePercent: number;
};

export const abvStartFinishSgExample = {
  input: {
    finishingGravity: 0.995,
    startingGravity: 1.09,
  },
  output: {
    alcoholByVolumePercent: 12.46875,
  },
} satisfies ToolExample<AbvStartFinishSgInput, AbvStartFinishSgOutput>;

export const calculateAbvStartFinishSg = (
  input: AbvStartFinishSgInput,
): AbvStartFinishSgOutput => {
  if (input.startingGravity < input.finishingGravity)
    simpleError(
      "startingGravity",
      "The starting gravity must be at or above the finishing gravity.",
      "invalid_value",
    );
  return {
    alcoholByVolumePercent: roundStatistic(
      (input.startingGravity - input.finishingGravity) * 131.25,
    ),
  };
};

export const abvStartFinishSgTool = createSimpleTool({
  calculate: (input) =>
    calculateAbvStartFinishSg(input as unknown as AbvStartFinishSgInput),
  description:
    "Estimate alcohol by volume from original and final specific gravity using ABV ≈ (starting SG − finishing SG) × 131.25; the shortcut is not a laboratory alcohol measurement.",
  id: "oenology/abv-start-finish-sg",
  inputs: [
    {
      description: "Specific gravity when fermentation finished.",
      id: "finishingGravity",
      label: "Finishing gravity",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Specific gravity of the fresh must.",
      id: "startingGravity",
      label: "Starting gravity",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated alcohol by volume of the fermented wine.",
      id: "alcoholByVolumePercent",
      kind: "number",
      label: "Alcohol by volume",
      unit: "%",
    },
  ],
  title: "Fermentation Completion ABV Estimator",
});
export const runAbvStartFinishSg = abvStartFinishSgTool.execute;
export default abvStartFinishSgTool;
