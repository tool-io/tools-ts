import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlotAreaCircularInput = Readonly<{
  readonly radiusMeters: number;
}>;
export type PlotAreaCircularOutput = Readonly<{
  readonly plotSquareMeters: number;
}>;

export const calculatePlotAreaCircular = (
  x: PlotAreaCircularInput,
): PlotAreaCircularOutput => {
  if (!Number.isFinite(x.radiusMeters) || x.radiusMeters <= 0)
    simpleError("radiusMeters", "Provide a finite positive number.");
  const plotSquareMeters = Math.PI * x.radiusMeters ** 2;
  if (!Number.isFinite(plotSquareMeters))
    simpleError(
      "plotSquareMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    plotSquareMeters: Object.is(plotSquareMeters, -0) ? 0 : plotSquareMeters,
  };
};

export const example = {
  input: {
    radiusMeters: 10,
  },
  output: { plotSquareMeters: 314.1592653589793 },
} satisfies ToolExample<PlotAreaCircularInput, PlotAreaCircularOutput>;

export const tool = createSimpleTool({
  id: "forestry/plot-area-circular",
  title: "Plot Area Circular",
  description:
    "Ground area in square metres of a circular plot from its radius.",
  inputs: [
    {
      id: "radiusMeters",
      kind: "number",
      label: "Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "plotSquareMeters",
      kind: "number",
      label: "Plot Square Meters",
      unit: "m2",
    },
  ],
  calculate: (input) =>
    calculatePlotAreaCircular({
      radiusMeters: input.radiusMeters as number,
    }),
});
export const plotAreaCircularTool = tool;
export const runPlotAreaCircular = tool.execute;
export default tool;
