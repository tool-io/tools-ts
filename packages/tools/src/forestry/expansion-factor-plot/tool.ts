import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExpansionFactorPlotInput = Readonly<{
  readonly plotSquareMeters: number;
}>;
export type ExpansionFactorPlotOutput = Readonly<{
  readonly perHectareFactor: number;
}>;

export const calculateExpansionFactorPlot = (
  x: ExpansionFactorPlotInput,
): ExpansionFactorPlotOutput => {
  if (!Number.isFinite(x.plotSquareMeters) || x.plotSquareMeters <= 0)
    simpleError("plotSquareMeters", "Provide a finite positive number.");
  const perHectareFactor = 10000 / x.plotSquareMeters;
  if (!Number.isFinite(perHectareFactor))
    simpleError(
      "perHectareFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    perHectareFactor: Object.is(perHectareFactor, -0) ? 0 : perHectareFactor,
  };
};

export const example = {
  input: {
    plotSquareMeters: 100,
  },
  output: { perHectareFactor: 100 },
} satisfies ToolExample<ExpansionFactorPlotInput, ExpansionFactorPlotOutput>;

export const tool = createSimpleTool({
  id: "forestry/expansion-factor-plot",
  title: "Expansion Factor Plot",
  description:
    "Per-hectare expansion factor for each tree counted in a sample plot of known square-metre area.",
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
    { id: "perHectareFactor", kind: "number", label: "Per Hectare Factor" },
  ],
  calculate: (input) =>
    calculateExpansionFactorPlot({
      plotSquareMeters: input.plotSquareMeters as number,
    }),
});
export const expansionFactorPlotTool = tool;
export const runExpansionFactorPlot = tool.execute;
export default tool;
