import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TreesPerHectareFromPlotInput = Readonly<{
  readonly treeCount: number;
  readonly plotSquareMeters: number;
}>;
export type TreesPerHectareFromPlotOutput = Readonly<{
  readonly treesPerHectare: number;
}>;

export const calculateTreesPerHectareFromPlot = (
  x: TreesPerHectareFromPlotInput,
): TreesPerHectareFromPlotOutput => {
  if (!Number.isFinite(x.treeCount) || x.treeCount < 0)
    simpleError("treeCount", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.plotSquareMeters) || x.plotSquareMeters <= 0)
    simpleError("plotSquareMeters", "Provide a finite positive number.");
  if (!Number.isInteger(x.treeCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const treesPerHectare = (10000 * x.treeCount) / x.plotSquareMeters;
  if (!Number.isFinite(treesPerHectare))
    simpleError(
      "treesPerHectare",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    treesPerHectare: Object.is(treesPerHectare, -0) ? 0 : treesPerHectare,
  };
};

export const example = {
  input: {
    treeCount: 10,
    plotSquareMeters: 100,
  },
  output: { treesPerHectare: 1000 },
} satisfies ToolExample<
  TreesPerHectareFromPlotInput,
  TreesPerHectareFromPlotOutput
>;

export const tool = createSimpleTool({
  id: "forestry/trees-per-hectare-from-plot",
  title: "Trees Per Hectare From Plot",
  description:
    "Estimated stems per hectare from tree count in a measured plot area.",
  inputs: [
    { id: "treeCount", kind: "number", label: "Tree Count", minimum: 0 },
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
      id: "treesPerHectare",
      kind: "number",
      label: "Trees Per Hectare",
      unit: "1/ha",
    },
  ],
  calculate: (input) =>
    calculateTreesPerHectareFromPlot({
      treeCount: input.treeCount as number,
      plotSquareMeters: input.plotSquareMeters as number,
    }),
});
export const treesPerHectareFromPlotTool = tool;
export const runTreesPerHectareFromPlot = tool.execute;
export default tool;
