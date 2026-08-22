import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type VaSpeedInput = {
  readonly newWeightLb: number;
  readonly publishedVaKt: number;
  readonly publishedWeightLb: number;
};

export type VaSpeedOutput = {
  readonly vaKt: number;
};

export const vaSpeedExample = {
  input: {
    newWeightLb: 2600,
    publishedVaKt: 100,
    publishedWeightLb: 2200,
  },
  output: { vaKt: 108.711461301 },
} satisfies ToolExample<VaSpeedInput, VaSpeedOutput>;

export const calculateVaSpeed = (input: VaSpeedInput): VaSpeedOutput => {
  const ratio = input.newWeightLb / input.publishedWeightLb;
  if (ratio <= 0)
    simpleError("newWeightLb", "Weights must be positive.", "invalid_weight");
  return { vaKt: roundStatistic(input.publishedVaKt * Math.sqrt(ratio)) };
};

export const vaSpeedTool = createSimpleTool({
  calculate: (input) => calculateVaSpeed(input as unknown as VaSpeedInput),
  description:
    "Scale the maneuvering speed for actual weight using the square-root weight ratio.",
  id: "aviation/va-speed",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "newWeightLb",
      kind: "number",
      label: "New weight",
      unit: "lb",
    },
    {
      description: "Maneuvering speed from the pilot handbook.",
      id: "publishedVaKt",
      kind: "number",
      label: "Published Va",
      unit: "kt",
    },
    {
      description: "Weight at which maneuvering speed was published.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Maneuvering speed at the actual weight.",
      format: "speed",
      id: "vaKt",
      kind: "number",
      label: "Maneuvering speed",
      unit: "kt",
    },
  ],
  title: "Maneuvering Speed Va Calculator",
});
export const runVaSpeed = vaSpeedTool.execute;
export default vaSpeedTool;
