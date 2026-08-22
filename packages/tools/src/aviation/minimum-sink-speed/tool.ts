import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinimumSinkSpeedInput = {
  readonly currentWeightLb: number;
  readonly publishedMinimumSinkKt: number;
  readonly publishedWeightLb: number;
};

export type MinimumSinkSpeedOutput = {
  readonly minimumSinkKt: number;
};

export const minimumSinkSpeedExample = {
  input: {
    currentWeightLb: 2400,
    publishedMinimumSinkKt: 55,
    publishedWeightLb: 2000,
  },
  output: { minimumSinkKt: 57.56493266656581 },
} satisfies ToolExample<MinimumSinkSpeedInput, MinimumSinkSpeedOutput>;

export const calculateMinimumSinkSpeed = (
  input: MinimumSinkSpeedInput,
): MinimumSinkSpeedOutput => {
  if (input.publishedWeightLb <= 0 || input.currentWeightLb <= 0)
    simpleError(
      "publishedWeightLb",
      "Weights must be positive.",
      "invalid_weight",
    );
  return {
    minimumSinkKt:
      input.publishedMinimumSinkKt *
      (input.currentWeightLb / input.publishedWeightLb) ** 0.25,
  };
};

export const minimumSinkSpeedTool = createSimpleTool({
  calculate: (input) =>
    calculateMinimumSinkSpeed(input as unknown as MinimumSinkSpeedInput),
  description:
    "Compute the speed for minimum sink rate scaled by the fourth-root weight ratio.",
  id: "aviation/minimum-sink-speed",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "currentWeightLb",
      kind: "number",
      label: "Current weight",
      unit: "lb",
    },
    {
      description: "Speed for minimum sink at the reference weight.",
      id: "publishedMinimumSinkKt",
      kind: "number",
      label: "Published minimum sink",
      unit: "kt",
    },
    {
      description: "Weight at which the speed was published.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Speed for minimum sink at the current weight.",
      format: "speed",
      id: "minimumSinkKt",
      kind: "number",
      label: "Minimum sink speed",
      unit: "kt",
    },
  ],
  title: "Minimum Sink Speed Calculator",
});
export const runMinimumSinkSpeed = minimumSinkSpeedTool.execute;
export default minimumSinkSpeedTool;
