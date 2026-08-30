import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyCoverPercentageForestryInput = Readonly<{
  readonly coveredSquareMeters: number;
  readonly plotSquareMeters: number;
}>;
export type CanopyCoverPercentageForestryOutput = Readonly<{
  readonly coverPercent: number;
}>;

export const calculateCanopyCoverPercentageForestry = (
  x: CanopyCoverPercentageForestryInput,
): CanopyCoverPercentageForestryOutput => {
  if (!Number.isFinite(x.coveredSquareMeters) || x.coveredSquareMeters < 0)
    simpleError("coveredSquareMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.plotSquareMeters) || x.plotSquareMeters <= 0)
    simpleError("plotSquareMeters", "Provide a finite positive number.");
  if (!(x.coveredSquareMeters <= x.plotSquareMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const coverPercent = (100 * x.coveredSquareMeters) / x.plotSquareMeters;
  if (!Number.isFinite(coverPercent))
    simpleError(
      "coverPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { coverPercent: Object.is(coverPercent, -0) ? 0 : coverPercent };
};

export const example = {
  input: {
    coveredSquareMeters: 60,
    plotSquareMeters: 100,
  },
  output: { coverPercent: 60 },
} satisfies ToolExample<
  CanopyCoverPercentageForestryInput,
  CanopyCoverPercentageForestryOutput
>;

export const tool = createSimpleTool({
  id: "forestry/canopy-cover-percentage-forestry",
  title: "Canopy Cover Percentage Forestry",
  description:
    "Canopy-covered projected ground area as a percentage of total sample plot area.",
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
  outputs: [
    {
      id: "coverPercent",
      kind: "number",
      label: "Cover Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateCanopyCoverPercentageForestry({
      coveredSquareMeters: input.coveredSquareMeters as number,
      plotSquareMeters: input.plotSquareMeters as number,
    }),
});
export const canopyCoverPercentageForestryTool = tool;
export const runCanopyCoverPercentageForestry = tool.execute;
export default tool;
