import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApparentDipInput = {
  readonly trueDipDeg: number;
  readonly angleFromDipDirectionDeg: number;
};

export type ApparentDipOutput = {
  readonly apparentDipDeg: number;
};

export const calculateApparentDip = (
  input: ApparentDipInput,
): ApparentDipOutput => {
  const { trueDipDeg, angleFromDipDirectionDeg } = input;
  if (!(trueDipDeg > 0 && trueDipDeg <= 90))
    simpleError(
      "trueDipDeg",
      "True dip must be greater than 0 and at most 90 degrees.",
      "invalid_dip",
    );
  if (!(angleFromDipDirectionDeg >= 0 && angleFromDipDirectionDeg <= 90))
    simpleError(
      "angleFromDipDirectionDeg",
      "The section angle from the dip direction must be between 0 and 90 degrees.",
      "invalid_angle",
    );
  const thetaRad = (angleFromDipDirectionDeg * Math.PI) / 180;
  return {
    apparentDipDeg:
      Math.atan(Math.tan((trueDipDeg * Math.PI) / 180) * Math.cos(thetaRad)) /
      (Math.PI / 180),
  };
};

export const apparentDipExample = {
  input: { trueDipDeg: 32, angleFromDipDirectionDeg: 45 },
  output: { apparentDipDeg: 23.838207652018653 },
} satisfies ToolExample<ApparentDipInput, ApparentDipOutput>;

export const apparentDipTool = createSimpleTool({
  id: "geology/apparent-dip",
  title: "Apparent Dip Calculator",
  description:
    "Apparent dip seen on a vertical section: tan(delta_apparent) = tan(delta_true) * cos(theta), where theta is the angle between the section and the dip direction.",
  inputs: [
    {
      description: "True dip of the plane in degrees.",
      id: "trueDipDeg",
      kind: "number",
      label: "True dip",
    },
    {
      description:
        "Angle between the vertical section and the dip direction in degrees.",
      id: "angleFromDipDirectionDeg",
      kind: "number",
      label: "theta",
    },
  ],
  outputs: [
    {
      description: "Apparent dip on the section in degrees.",
      id: "apparentDipDeg",
      kind: "number",
      label: "Apparent dip",
    },
  ],
  calculate: (input) =>
    calculateApparentDip(input as unknown as ApparentDipInput),
});

export const runApparentDip = apparentDipTool.execute;
export default apparentDipTool;
