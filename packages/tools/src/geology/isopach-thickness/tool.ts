import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IsopachThicknessInput = {
  readonly verticalThicknessM: number;
  readonly bedDipDeg: number;
};

export type IsopachThicknessOutput = {
  readonly isopachThicknessM: number;
};

export const calculateIsopachThickness = (
  input: IsopachThicknessInput,
): IsopachThicknessOutput => {
  const { verticalThicknessM, bedDipDeg } = input;
  if (!(verticalThicknessM >= 0))
    simpleError(
      "verticalThicknessM",
      "Vertical thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(bedDipDeg >= 0 && bedDipDeg <= 90))
    simpleError(
      "bedDipDeg",
      "Bed dip must be between 0 and 90 degrees.",
      "invalid_dip",
    );
  return {
    isopachThicknessM:
      verticalThicknessM * Math.cos((bedDipDeg * Math.PI) / 180),
  };
};

export const isopachThicknessExample = {
  input: { verticalThicknessM: 60, bedDipDeg: 30 },
  output: { isopachThicknessM: 51.96152422706632 },
} satisfies ToolExample<IsopachThicknessInput, IsopachThicknessOutput>;

export const isopachThicknessTool = createSimpleTool({
  id: "geology/isopach-thickness",
  title: "Isopach Thickness Calculator",
  description:
    "True stratigraphic thickness (isopach) measured perpendicular to bedding from a vertical thickness: t = T * cos(dip).",
  inputs: [
    {
      description: "Measured vertical extent of the interval in metres.",
      id: "verticalThicknessM",
      kind: "number",
      label: "Vertical thickness",
      unit: "m",
    },
    {
      description: "Bed dip in degrees.",
      id: "bedDipDeg",
      kind: "number",
      label: "Bed dip",
    },
  ],
  outputs: [
    {
      description: "True stratigraphic (isopach) thickness in metres.",
      id: "isopachThicknessM",
      kind: "number",
      label: "Isopach thickness",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateIsopachThickness(input as unknown as IsopachThicknessInput),
});

export const runIsopachThickness = isopachThicknessTool.execute;
export default isopachThicknessTool;
