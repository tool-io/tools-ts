import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyGapFractionForestryInput = Readonly<{
  readonly coveredSquareMeters: number;
  readonly plotSquareMeters: number;
}>;
export type CanopyGapFractionForestryOutput = Readonly<{
  readonly gapFraction: number;
}>;

export const calculateCanopyGapFractionForestry = (
  x: CanopyGapFractionForestryInput,
): CanopyGapFractionForestryOutput => {
  if (!Number.isFinite(x.coveredSquareMeters) || x.coveredSquareMeters < 0)
    simpleError("coveredSquareMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.plotSquareMeters) || x.plotSquareMeters <= 0)
    simpleError("plotSquareMeters", "Provide a finite positive number.");
  if (!(x.coveredSquareMeters <= x.plotSquareMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const gapFraction = 1 - x.coveredSquareMeters / x.plotSquareMeters;
  if (!Number.isFinite(gapFraction))
    simpleError(
      "gapFraction",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gapFraction: Object.is(gapFraction, -0) ? 0 : gapFraction };
};

export const example = {
  input: {
    coveredSquareMeters: 60,
    plotSquareMeters: 100,
  },
  output: { gapFraction: 0.4 },
} satisfies ToolExample<
  CanopyGapFractionForestryInput,
  CanopyGapFractionForestryOutput
>;

export const tool = createSimpleTool({
  id: "forestry/canopy-gap-fraction-forestry",
  title: "Canopy Gap Fraction Forestry",
  description:
    "Uncovered fraction of plot ground area from canopy-covered and total plot areas.",
  inputs: [
    {
      id: "coveredSquareMeters",
      kind: "number",
      label: "Covered Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "plotSquareMeters",
      kind: "number",
      label: "Plot Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [{ id: "gapFraction", kind: "number", label: "Gap Fraction" }],
  calculate: (input) =>
    calculateCanopyGapFractionForestry({
      coveredSquareMeters: input.coveredSquareMeters as number,
      plotSquareMeters: input.plotSquareMeters as number,
    }),
});
export const canopyGapFractionForestryTool = tool;
export const runCanopyGapFractionForestry = tool.execute;
export default tool;
