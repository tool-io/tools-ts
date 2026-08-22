import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type VrefSpeedInput = {
  readonly currentWeightLb: number;
  readonly publishedWeightLb: number;
  readonly stallSpeedRefKt: number;
};

export type VrefSpeedOutput = {
  readonly vrefKt: number;
};

/** Standard final-approach margin: 1.3 times the stall speed. */
const VREF_MULTIPLIER = 1.3;

export const vrefSpeedExample = {
  input: {
    currentWeightLb: 2400,
    publishedWeightLb: 2000,
    stallSpeedRefKt: 50,
  },
  output: { vrefKt: 71.2039324757 },
} satisfies ToolExample<VrefSpeedInput, VrefSpeedOutput>;

export const calculateVrefSpeed = (input: VrefSpeedInput): VrefSpeedOutput => {
  const ratio = input.currentWeightLb / input.publishedWeightLb;
  if (ratio <= 0 || input.stallSpeedRefKt <= 0)
    simpleError(
      "stallSpeedRefKt",
      "Weights and stall speed must be positive.",
      "invalid_input",
    );
  return {
    vrefKt: roundStatistic(
      VREF_MULTIPLIER * input.stallSpeedRefKt * Math.sqrt(ratio),
    ),
  };
};

export const vrefSpeedTool = createSimpleTool({
  calculate: (input) => calculateVrefSpeed(input as unknown as VrefSpeedInput),
  description:
    "Compute final-approach speed as 1.3 times the stall speed scaled for actual weight.",
  id: "aviation/vref-speed",
  inputs: [
    {
      description: "Actual landing weight.",
      id: "currentWeightLb",
      kind: "number",
      label: "Current weight",
      unit: "lb",
    },
    {
      description: "Stall speed at the published weight.",
      id: "stallSpeedRefKt",
      kind: "number",
      label: "Reference stall speed",
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
      description: "Final-approach target speed.",
      format: "speed",
      id: "vrefKt",
      kind: "number",
      label: "Vref",
      unit: "kt",
    },
  ],
  title: "Vref Speed Calculator",
});
export const runVrefSpeed = vrefSpeedTool.execute;
export default vrefSpeedTool;
