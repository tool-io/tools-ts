import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type StallSpeedWeightInput = {
  readonly newWeightLb: number;
  readonly publishedStallSpeedKt: number;
  readonly publishedWeightLb: number;
};

export type StallSpeedWeightOutput = {
  readonly stallSpeedKt: number;
};

export const stallSpeedWeightExample = {
  input: {
    newWeightLb: 2400,
    publishedStallSpeedKt: 50,
    publishedWeightLb: 2000,
  },
  output: { stallSpeedKt: 54.7722557505 },
} satisfies ToolExample<StallSpeedWeightInput, StallSpeedWeightOutput>;

export const calculateStallSpeedWeight = (
  input: StallSpeedWeightInput,
): StallSpeedWeightOutput => {
  const ratio = input.newWeightLb / input.publishedWeightLb;
  if (ratio <= 0)
    simpleError("newWeightLb", "Weights must be positive.", "invalid_weight");
  return {
    stallSpeedKt: roundStatistic(
      input.publishedStallSpeedKt * Math.sqrt(ratio),
    ),
  };
};

export const stallSpeedWeightTool = createSimpleTool({
  calculate: (input) =>
    calculateStallSpeedWeight(input as unknown as StallSpeedWeightInput),
  description:
    "Scale a published stall speed for actual weight using the square-root weight ratio.",
  id: "aviation/stall-speed-weight",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "newWeightLb",
      kind: "number",
      label: "New weight",
      unit: "lb",
    },
    {
      description: "Stall speed from the pilot handbook.",
      id: "publishedStallSpeedKt",
      kind: "number",
      label: "Published stall speed",
      unit: "kt",
    },
    {
      description: "Weight at which the stall speed was published.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Stall speed at the actual weight.",
      format: "speed",
      id: "stallSpeedKt",
      kind: "number",
      label: "Corrected stall speed",
      unit: "kt",
    },
  ],
  title: "Stall Speed Weight Correction Calculator",
});
export const runStallSpeedWeight = stallSpeedWeightTool.execute;
export default stallSpeedWeightTool;
