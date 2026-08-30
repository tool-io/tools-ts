import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlopePercentContourSpacingInput = Readonly<{
  readonly contourIntervalMeters: number;
  readonly gradePercent: number;
}>;
export type SlopePercentContourSpacingOutput = Readonly<{
  readonly horizontalSpacingMeters: number;
}>;

export const calculateSlopePercentContourSpacing = (
  x: SlopePercentContourSpacingInput,
): SlopePercentContourSpacingOutput => {
  if (!Number.isFinite(x.contourIntervalMeters) || x.contourIntervalMeters < 0)
    simpleError(
      "contourIntervalMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.gradePercent) || x.gradePercent <= 0)
    simpleError("gradePercent", "Provide a finite positive number.");
  const horizontalSpacingMeters =
    (100 * x.contourIntervalMeters) / x.gradePercent;
  if (!Number.isFinite(horizontalSpacingMeters))
    simpleError(
      "horizontalSpacingMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    horizontalSpacingMeters: Object.is(horizontalSpacingMeters, -0)
      ? 0
      : horizontalSpacingMeters,
  };
};

export const example = {
  input: {
    contourIntervalMeters: 10,
    gradePercent: 20,
  },
  output: { horizontalSpacingMeters: 50 },
} satisfies ToolExample<
  SlopePercentContourSpacingInput,
  SlopePercentContourSpacingOutput
>;

export const tool = createSimpleTool({
  id: "cartography/slope-percent-contour-spacing",
  title: "Slope Percent Contour Spacing",
  description:
    "Horizontal spacing in metres between contours from vertical interval and grade percentage.",
  inputs: [
    {
      id: "contourIntervalMeters",
      kind: "number",
      label: "Contour Interval Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "gradePercent",
      kind: "number",
      label: "Grade Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "horizontalSpacingMeters",
      kind: "number",
      label: "Horizontal Spacing Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateSlopePercentContourSpacing({
      contourIntervalMeters: input.contourIntervalMeters as number,
      gradePercent: input.gradePercent as number,
    }),
});
export const slopePercentContourSpacingTool = tool;
export const runSlopePercentContourSpacing = tool.execute;
export default tool;
