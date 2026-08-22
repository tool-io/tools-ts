import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type VrSpeedInput = {
  readonly newWeightLb: number;
  readonly publishedVrKt: number;
  readonly publishedWeightLb: number;
};

export type VrSpeedOutput = {
  readonly vrKt: number;
};

export const vrSpeedExample = {
  input: {
    newWeightLb: 2400,
    publishedVrKt: 55,
    publishedWeightLb: 2000,
  },
  output: { vrKt: 60.2494813256 },
} satisfies ToolExample<VrSpeedInput, VrSpeedOutput>;

export const calculateVrSpeed = (input: VrSpeedInput): VrSpeedOutput => {
  const ratio = input.newWeightLb / input.publishedWeightLb;
  if (ratio <= 0)
    simpleError("newWeightLb", "Weights must be positive.", "invalid_weight");
  return { vrKt: roundStatistic(input.publishedVrKt * Math.sqrt(ratio)) };
};

export const vrSpeedTool = createSimpleTool({
  calculate: (input) => calculateVrSpeed(input as unknown as VrSpeedInput),
  description:
    "Scale the rotation speed for actual weight using the square-root weight ratio.",
  id: "aviation/vr-speed",
  inputs: [
    {
      description: "Actual aircraft weight at the start of the roll.",
      id: "newWeightLb",
      kind: "number",
      label: "New weight",
      unit: "lb",
    },
    {
      description: "Rotation speed from the pilot handbook.",
      id: "publishedVrKt",
      kind: "number",
      label: "Published Vr",
      unit: "kt",
    },
    {
      description: "Weight at which rotation speed was published.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Rotation speed at the actual weight.",
      format: "speed",
      id: "vrKt",
      kind: "number",
      label: "Rotation speed",
      unit: "kt",
    },
  ],
  title: "Vr Speed Calculator",
});
export const runVrSpeed = vrSpeedTool.execute;
export default vrSpeedTool;
