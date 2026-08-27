import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrueThicknessFromApparentInput = {
  readonly apparentThicknessM: number;
  readonly angleFromDipDirectionDeg: number;
};

export type TrueThicknessFromApparentOutput = {
  readonly trueThicknessM: number;
};

export const calculateTrueThicknessFromApparent = (
  input: TrueThicknessFromApparentInput,
): TrueThicknessFromApparentOutput => {
  const { apparentThicknessM, angleFromDipDirectionDeg } = input;
  if (!(apparentThicknessM > 0))
    simpleError(
      "apparentThicknessM",
      "Apparent thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(angleFromDipDirectionDeg >= 0 && angleFromDipDirectionDeg < 90))
    simpleError(
      "angleFromDipDirectionDeg",
      "The traverse angle from the dip direction must be between 0 and 90 degrees (exclusive of 90).",
      "invalid_angle",
    );
  return {
    trueThicknessM:
      apparentThicknessM * Math.cos((angleFromDipDirectionDeg * Math.PI) / 180),
  };
};

export const trueThicknessFromApparentExample = {
  input: { apparentThicknessM: 14.2, angleFromDipDirectionDeg: 35 },
  output: { trueThicknessM: 11.631959028903683 },
} satisfies ToolExample<
  TrueThicknessFromApparentInput,
  TrueThicknessFromApparentOutput
>;

export const trueThicknessFromApparentTool = createSimpleTool({
  id: "geology/true-thickness-from-apparent",
  title: "True Thickness From Apparent Calculator",
  description:
    "Convert an apparent thickness measured on a vertical traverse to true bed thickness: t_true = t_apparent * cos(theta), where theta is the angle between the traverse and the dip direction.",
  inputs: [
    {
      description:
        "Apparent thickness measured on the oblique traverse in metres.",
      id: "apparentThicknessM",
      kind: "number",
      label: "t apparent",
      unit: "m",
    },
    {
      description:
        "Angle between the traverse line and the dip direction in degrees.",
      id: "angleFromDipDirectionDeg",
      kind: "number",
      label: "theta",
    },
  ],
  outputs: [
    {
      description: "True stratigraphic thickness in metres.",
      id: "trueThicknessM",
      kind: "number",
      label: "t true",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateTrueThicknessFromApparent(
      input as unknown as TrueThicknessFromApparentInput,
    ),
});

export const runTrueThicknessFromApparent =
  trueThicknessFromApparentTool.execute;
export default trueThicknessFromApparentTool;
