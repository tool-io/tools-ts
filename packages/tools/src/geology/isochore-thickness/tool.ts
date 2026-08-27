import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IsochoreThicknessInput = {
  readonly isopachThicknessM: number;
  readonly bedDipDeg: number;
};

export type IsochoreThicknessOutput = {
  readonly isochoreThicknessM: number;
};

export const calculateIsochoreThickness = (
  input: IsochoreThicknessInput,
): IsochoreThicknessOutput => {
  const { isopachThicknessM, bedDipDeg } = input;
  if (!(isopachThicknessM >= 0))
    simpleError(
      "isopachThicknessM",
      "True thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(bedDipDeg >= 0 && bedDipDeg < 90))
    simpleError(
      "bedDipDeg",
      "Bed dip must be at least 0 and below 90 degrees.",
      "invalid_dip",
    );
  return {
    isochoreThicknessM:
      isopachThicknessM / Math.cos((bedDipDeg * Math.PI) / 180),
  };
};

export const isochoreThicknessExample = {
  input: { isopachThicknessM: 45, bedDipDeg: 15 },
  output: { isochoreThicknessM: 46.58742811845374 },
} satisfies ToolExample<IsochoreThicknessInput, IsochoreThicknessOutput>;

export const isochoreThicknessTool = createSimpleTool({
  id: "geology/isochore-thickness",
  title: "Isochore Thickness Calculator",
  description:
    "Vertical (isochore) thickness from true stratigraphic thickness and dip: T = t / cos(dip).",
  inputs: [
    {
      description:
        "True stratigraphic thickness measured perpendicular to bedding, in metres.",
      id: "isopachThicknessM",
      kind: "number",
      label: "True thickness",
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
      description: "Vertical (isochore) thickness in metres.",
      id: "isochoreThicknessM",
      kind: "number",
      label: "Isochore thickness",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateIsochoreThickness(input as unknown as IsochoreThicknessInput),
});

export const runIsochoreThickness = isochoreThicknessTool.execute;
export default isochoreThicknessTool;
