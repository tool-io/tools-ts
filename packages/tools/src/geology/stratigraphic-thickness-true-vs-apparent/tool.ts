import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StratigraphicThicknessTrueVsApparentInput = {
  readonly outcropWidthMeters: number;
  readonly trueDipDegrees: number;
};

export type StratigraphicThicknessTrueVsApparentOutput = {
  readonly trueThicknessMeters: number;
  readonly verticalThicknessMeters: number;
};

const radians = (degrees: number): number => (degrees * Math.PI) / 180;

export const calculateStratigraphicThicknessTrueVsApparent = (
  input: StratigraphicThicknessTrueVsApparentInput,
): StratigraphicThicknessTrueVsApparentOutput => {
  if (!(input.outcropWidthMeters > 0))
    simpleError(
      "outcropWidthMeters",
      "Outcrop width must be greater than zero.",
      "invalid_width",
    );
  if (!(input.trueDipDegrees > 0 && input.trueDipDegrees < 90))
    simpleError(
      "trueDipDegrees",
      "True dip must lie between 0 (exclusive) and 90 (exclusive) degrees.",
      "invalid_dip",
    );
  return {
    trueThicknessMeters:
      input.outcropWidthMeters * Math.sin(radians(input.trueDipDegrees)),
    verticalThicknessMeters:
      input.outcropWidthMeters * Math.tan(radians(input.trueDipDegrees)),
  };
};

export const stratigraphicThicknessTrueVsApparentExample = {
  input: { outcropWidthMeters: 100, trueDipDegrees: 30 },
  output: {
    trueThicknessMeters: 49.99999999999999,
    verticalThicknessMeters: 57.735026918962575,
  },
} satisfies ToolExample<
  StratigraphicThicknessTrueVsApparentInput,
  StratigraphicThicknessTrueVsApparentOutput
>;

export const stratigraphicThicknessTrueVsApparentTool = createSimpleTool({
  id: "geology/stratigraphic-thickness-true-vs-apparent",
  title: "Stratigraphic Thickness True Vs Apparent Calculator",
  description:
    "For a bed cropped out over width w perpendicular to strike on horizontal ground: true thickness t = w sin(delta) and vertical (apparent) thickness t_v = w tan(delta), with dip delta in degrees.",
  inputs: [
    {
      description:
        "Outcrop map width measured horizontally, perpendicular to strike, in meters.",
      id: "outcropWidthMeters",
      kind: "number",
      label: "Outcrop width",
      minimum: 0,
    },
    {
      description:
        "True dip of the beds in degrees, strictly between 0 and 90.",
      id: "trueDipDegrees",
      kind: "number",
      label: "True dip",
      maximum: 90,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "True stratigraphic thickness in meters.",
      id: "trueThicknessMeters",
      kind: "number",
      label: "True thickness",
    },
    {
      description: "Vertical apparent thickness in meters.",
      id: "verticalThicknessMeters",
      kind: "number",
      label: "Vertical thickness",
    },
  ],
  calculate: (input) =>
    calculateStratigraphicThicknessTrueVsApparent(
      input as unknown as StratigraphicThicknessTrueVsApparentInput,
    ),
});

export const runStratigraphicThicknessTrueVsApparent =
  stratigraphicThicknessTrueVsApparentTool.execute;
export default stratigraphicThicknessTrueVsApparentTool;
