import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BestGlideSpeedInput = {
  readonly currentWeightLb: number;
  readonly publishedBestGlideKt: number;
  readonly publishedWeightLb: number;
};

export type BestGlideSpeedOutput = {
  readonly bestGlideKt: number;
};

export const bestGlideSpeedExample = {
  input: {
    currentWeightLb: 2400,
    publishedBestGlideKt: 68,
    publishedWeightLb: 2000,
  },
  output: { bestGlideKt: 74.49026782070258 },
} satisfies ToolExample<BestGlideSpeedInput, BestGlideSpeedOutput>;

export const calculateBestGlideSpeed = (
  input: BestGlideSpeedInput,
): BestGlideSpeedOutput => {
  if (input.publishedWeightLb <= 0 || input.currentWeightLb <= 0)
    simpleError(
      "publishedWeightLb",
      "Weights must be positive.",
      "invalid_weight",
    );
  return {
    bestGlideKt:
      input.publishedBestGlideKt *
      Math.sqrt(input.currentWeightLb / input.publishedWeightLb),
  };
};

export const bestGlideSpeedTool = createSimpleTool({
  calculate: (input) =>
    calculateBestGlideSpeed(input as unknown as BestGlideSpeedInput),
  description:
    "Compute the best glide speed for the current weight from a published reference.",
  id: "aviation/best-glide-speed",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "currentWeightLb",
      kind: "number",
      label: "Current weight",
      unit: "lb",
    },
    {
      description: "Best glide speed at the published weight.",
      id: "publishedBestGlideKt",
      kind: "number",
      label: "Published best glide",
      unit: "kt",
    },
    {
      description: "Reference weight for the published speed.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Best glide speed at the current weight.",
      format: "speed",
      id: "bestGlideKt",
      kind: "number",
      label: "Best glide speed",
      unit: "kt",
    },
  ],
  title: "Best Glide Speed Calculator",
});
export const runBestGlideSpeed = bestGlideSpeedTool.execute;
export default bestGlideSpeedTool;
