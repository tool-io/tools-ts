import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContourDensityPerCmCheckerInput = Readonly<{
  readonly contourCrossings: number;
  readonly mapLengthCentimeters: number;
}>;
export type ContourDensityPerCmCheckerOutput = Readonly<{
  readonly crossingsPerCentimeter: number;
}>;

export const calculateContourDensityPerCmChecker = (
  x: ContourDensityPerCmCheckerInput,
): ContourDensityPerCmCheckerOutput => {
  if (!Number.isFinite(x.contourCrossings) || x.contourCrossings < 0)
    simpleError("contourCrossings", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.mapLengthCentimeters) || x.mapLengthCentimeters <= 0)
    simpleError("mapLengthCentimeters", "Provide a finite positive number.");
  const crossingsPerCentimeter = x.contourCrossings / x.mapLengthCentimeters;
  if (!Number.isFinite(crossingsPerCentimeter))
    simpleError(
      "crossingsPerCentimeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    crossingsPerCentimeter: Object.is(crossingsPerCentimeter, -0)
      ? 0
      : crossingsPerCentimeter,
  };
};

export const example = {
  input: {
    contourCrossings: 10,
    mapLengthCentimeters: 5,
  },
  output: { crossingsPerCentimeter: 2 },
} satisfies ToolExample<
  ContourDensityPerCmCheckerInput,
  ContourDensityPerCmCheckerOutput
>;

export const tool = createSimpleTool({
  id: "cartography/contour-density-per-cm-checker",
  title: "Contour Density Per Cm Checker",
  description:
    "Number of contour crossings per map centimetre from a count along a measured map transect.",
  inputs: [
    {
      id: "contourCrossings",
      kind: "number",
      label: "Contour Crossings",
      minimum: 0,
    },
    {
      id: "mapLengthCentimeters",
      kind: "number",
      label: "Map Length Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "crossingsPerCentimeter",
      kind: "number",
      label: "Crossings Per Centimeter",
      unit: "1/cm",
    },
  ],
  calculate: (input) =>
    calculateContourDensityPerCmChecker({
      contourCrossings: input.contourCrossings as number,
      mapLengthCentimeters: input.mapLengthCentimeters as number,
    }),
});
export const contourDensityPerCmCheckerTool = tool;
export const runContourDensityPerCmChecker = tool.execute;
export default tool;
