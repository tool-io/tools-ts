import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VySpeedInput = {
  readonly currentWeightLb: number;
  readonly publishedVyKt: number;
  readonly publishedWeightLb: number;
};

export type VySpeedOutput = {
  readonly vyKt: number;
};

export const vySpeedExample = {
  input: { currentWeightLb: 2200, publishedVyKt: 74, publishedWeightLb: 2000 },
  output: { vyKt: 77.61185476459121 },
} satisfies ToolExample<VySpeedInput, VySpeedOutput>;

export const calculateVySpeed = (input: VySpeedInput): VySpeedOutput => {
  if (input.publishedWeightLb <= 0)
    simpleError(
      "publishedWeightLb",
      "The published weight must be positive.",
      "invalid_weight",
    );
  return {
    vyKt:
      input.publishedVyKt *
      Math.sqrt(input.currentWeightLb / input.publishedWeightLb),
  };
};

export const vySpeedTool = createSimpleTool({
  calculate: (input) => calculateVySpeed(input as unknown as VySpeedInput),
  description:
    "Compute the best rate-of-climb speed for the current weight from a published reference.",
  id: "aviation/vy-speed",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "currentWeightLb",
      kind: "number",
      label: "Current weight",
      unit: "lb",
    },
    {
      description: "Best rate-of-climb speed at the published weight.",
      id: "publishedVyKt",
      kind: "number",
      label: "Published Vy",
      unit: "kt",
    },
    {
      description: "Weight at which Vy was published.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Best rate-of-climb speed at the current weight.",
      format: "speed",
      id: "vyKt",
      kind: "number",
      label: "Vy",
      unit: "kt",
    },
  ],
  title: "Vy Speed Calculator",
});
export const runVySpeed = vySpeedTool.execute;
export default vySpeedTool;
