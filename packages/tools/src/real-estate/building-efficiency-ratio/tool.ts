import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuildingEfficiencyRatioInput = Readonly<{
  readonly usableSquareFeet: number;
  readonly grossSquareFeet: number;
}>;
export type BuildingEfficiencyRatioOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculateBuildingEfficiencyRatio = (
  x: BuildingEfficiencyRatioInput,
): BuildingEfficiencyRatioOutput => {
  if (!Number.isFinite(x.usableSquareFeet) || x.usableSquareFeet < 0)
    simpleError("usableSquareFeet", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.grossSquareFeet) || x.grossSquareFeet <= 0)
    simpleError("grossSquareFeet", "Provide a finite positive number.");
  if (!(x.usableSquareFeet <= x.grossSquareFeet))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent = (100 * x.usableSquareFeet) / x.grossSquareFeet;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: {
    usableSquareFeet: 8000,
    grossSquareFeet: 10000,
  },
  output: { efficiencyPercent: 80 },
} satisfies ToolExample<
  BuildingEfficiencyRatioInput,
  BuildingEfficiencyRatioOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/building-efficiency-ratio",
  title: "Building Efficiency Ratio",
  description:
    "Usable floor area as a percentage of total gross building area.",
  inputs: [
    {
      id: "usableSquareFeet",
      kind: "number",
      label: "Usable Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "grossSquareFeet",
      kind: "number",
      label: "Gross Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateBuildingEfficiencyRatio({
      usableSquareFeet: input.usableSquareFeet as number,
      grossSquareFeet: input.grossSquareFeet as number,
    }),
});
export const buildingEfficiencyRatioTool = tool;
export const runBuildingEfficiencyRatio = tool.execute;
export default tool;
