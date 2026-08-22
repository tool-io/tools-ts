import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VxSpeedInput = {
  readonly currentWeightLb: number;
  readonly publishedVxKt: number;
  readonly publishedWeightLb: number;
};

export type VxSpeedOutput = {
  readonly vxKt: number;
};

export const vxSpeedExample = {
  input: { currentWeightLb: 2200, publishedVxKt: 62, publishedWeightLb: 2000 },
  output: { vxKt: 65.0261485865494 },
} satisfies ToolExample<VxSpeedInput, VxSpeedOutput>;

export const calculateVxSpeed = (input: VxSpeedInput): VxSpeedOutput => {
  if (input.publishedWeightLb <= 0)
    simpleError(
      "publishedWeightLb",
      "The published weight must be positive.",
      "invalid_weight",
    );
  return {
    vxKt:
      input.publishedVxKt *
      Math.sqrt(input.currentWeightLb / input.publishedWeightLb),
  };
};

export const vxSpeedTool = createSimpleTool({
  calculate: (input) => calculateVxSpeed(input as unknown as VxSpeedInput),
  description:
    "Compute the best angle-of-climb speed for the current weight from a published reference.",
  id: "aviation/vx-speed",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "currentWeightLb",
      kind: "number",
      label: "Current weight",
      unit: "lb",
    },
    {
      description: "Best angle-of-climb speed at the published weight.",
      id: "publishedVxKt",
      kind: "number",
      label: "Published Vx",
      unit: "kt",
    },
    {
      description: "Weight at which Vx was published.",
      id: "publishedWeightLb",
      kind: "number",
      label: "Published weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Best angle-of-climb speed at the current weight.",
      format: "speed",
      id: "vxKt",
      kind: "number",
      label: "Vx",
      unit: "kt",
    },
  ],
  title: "Vx Speed Calculator",
});
export const runVxSpeed = vxSpeedTool.execute;
export default vxSpeedTool;
