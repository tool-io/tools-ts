import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlotRadiusFromAreaInput = Readonly<{
  readonly plotSquareMeters: number;
}>;
export type PlotRadiusFromAreaOutput = Readonly<{
  readonly radiusMeters: number;
}>;

export const calculatePlotRadiusFromArea = (
  x: PlotRadiusFromAreaInput,
): PlotRadiusFromAreaOutput => {
  if (!Number.isFinite(x.plotSquareMeters) || x.plotSquareMeters <= 0)
    simpleError("plotSquareMeters", "Provide a finite positive number.");
  const radiusMeters = Math.sqrt(x.plotSquareMeters / Math.PI);
  if (!Number.isFinite(radiusMeters))
    simpleError(
      "radiusMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { radiusMeters: Object.is(radiusMeters, -0) ? 0 : radiusMeters };
};

export const example = {
  input: {
    plotSquareMeters: 100,
  },
  output: { radiusMeters: 5.641895835477563 },
} satisfies ToolExample<PlotRadiusFromAreaInput, PlotRadiusFromAreaOutput>;

export const tool = createSimpleTool({
  id: "forestry/plot-radius-from-area",
  title: "Plot Radius From Area",
  description:
    "Radius in metres of a circular sample plot from its ground area in square metres.",
  inputs: [
    {
      id: "plotSquareMeters",
      kind: "number",
      label: "Plot Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "radiusMeters", kind: "number", label: "Radius Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculatePlotRadiusFromArea({
      plotSquareMeters: input.plotSquareMeters as number,
    }),
});
export const plotRadiusFromAreaTool = tool;
export const runPlotRadiusFromArea = tool.execute;
export default tool;
