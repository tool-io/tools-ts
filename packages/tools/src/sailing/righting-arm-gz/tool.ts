import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RightingArmGzInput = {
  readonly heelAngleDegrees: number;
  readonly metacentricHeightFeet: number;
};

export type RightingArmGzOutput = {
  readonly rightingArmFeet: number;
};

export const rightingArmGzExample = {
  input: { heelAngleDegrees: 10, metacentricHeightFeet: 4 },
  output: { rightingArmFeet: 0.6945927106677213 },
} satisfies ToolExample<RightingArmGzInput, RightingArmGzOutput>;

export const rightingArmGzTool = createSimpleTool({
  calculate: (input) => {
    const metacentricHeightFeet = input.metacentricHeightFeet as number;
    if (metacentricHeightFeet <= 0)
      simpleError(
        "metacentricHeightFeet",
        "Metacentric height must be positive.",
        "invalid_input",
      );
    const heelAngleDegrees = input.heelAngleDegrees as number;
    if (heelAngleDegrees < 0 || heelAngleDegrees > 15)
      simpleError(
        "heelAngleDegrees",
        "The GM sine approximation is limited to heel angles from zero to fifteen degrees.",
        "outside_small_angle_range",
      );
    return {
      rightingArmFeet:
        metacentricHeightFeet * Math.sin((heelAngleDegrees * Math.PI) / 180),
    };
  },
  description:
    "Approximate the initial-stability righting arm as GZ = GM sin(heel) for heel angles no greater than fifteen degrees; use a vessel's measured GZ curve at larger angles.",
  id: "sailing/righting-arm-gz",
  inputs: [
    {
      description: "Angle of heel from upright.",
      id: "heelAngleDegrees",
      kind: "number",
      label: "Heel angle",
      maximum: 15,
      minimum: 0,
      unit: "deg",
    },
    {
      description: "Metacentric height GM of the vessel.",
      id: "metacentricHeightFeet",
      kind: "number",
      label: "Metacentric height",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Righting arm GZ at the given heel angle.",
      format: "length-ft",
      id: "rightingArmFeet",
      kind: "number",
      label: "Righting arm",
      unit: "ft",
    },
  ],
  title: "Righting Arm GZ Calculator",
});
export const runRightingArmGz = rightingArmGzTool.execute;
export default rightingArmGzTool;
