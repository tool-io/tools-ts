import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RightingMomentInput = {
  readonly displacementPounds: number;
  readonly rightingArmFeet: number;
};

export type RightingMomentOutput = {
  readonly rightingMomentPoundFeet: number;
};

export const rightingMomentExample = {
  input: { displacementPounds: 10000, rightingArmFeet: 3 },
  output: { rightingMomentPoundFeet: 30000 },
} satisfies ToolExample<RightingMomentInput, RightingMomentOutput>;

export const calculateRightingMoment = (
  input: RightingMomentInput,
): RightingMomentOutput => {
  if (input.displacementPounds <= 0)
    simpleError(
      "displacementPounds",
      "Displacement must be positive.",
      "invalid_input",
    );
  return {
    rightingMomentPoundFeet: input.rightingArmFeet * input.displacementPounds,
  };
};

export const rightingMomentTool = createSimpleTool({
  calculate: (input) =>
    calculateRightingMoment(input as unknown as RightingMomentInput),
  description:
    "Compute the righting moment in pound-feet as righting arm times displacement; a negative arm yields a capsize moment.",
  id: "sailing/righting-moment",
  inputs: [
    {
      description:
        "Horizontal distance from centerline to center of gravity; negative values represent a capsize moment.",
      format: "length-ft",
      id: "rightingArmFeet",
      kind: "number",
      label: "Righting arm",
      unit: "ft",
    },
    {
      description: "Displacement of the vessel.",
      format: "weight-lb",
      id: "displacementPounds",
      kind: "number",
      label: "Displacement",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Righting moment; negative values indicate capsize moment.",
      format: "moment-lb-ft",
      id: "rightingMomentPoundFeet",
      kind: "number",
      label: "Righting moment",
      unit: "lb·ft",
    },
  ],
  title: "Righting Moment Calculator",
});
export const runRightingMoment = rightingMomentTool.execute;
export default rightingMomentTool;
