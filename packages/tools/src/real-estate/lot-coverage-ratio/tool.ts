import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LotCoverageRatioInput = Readonly<{
  readonly buildingFootprintSquareFeet: number;
  readonly landAreaSquareFeet: number;
}>;
export type LotCoverageRatioOutput = Readonly<{
  readonly coveragePercent: number;
}>;

export const calculateLotCoverageRatio = (
  x: LotCoverageRatioInput,
): LotCoverageRatioOutput => {
  if (
    !Number.isFinite(x.buildingFootprintSquareFeet) ||
    x.buildingFootprintSquareFeet < 0
  )
    simpleError(
      "buildingFootprintSquareFeet",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.landAreaSquareFeet) || x.landAreaSquareFeet <= 0)
    simpleError("landAreaSquareFeet", "Provide a finite positive number.");
  if (!(x.buildingFootprintSquareFeet <= x.landAreaSquareFeet))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const coveragePercent =
    (100 * x.buildingFootprintSquareFeet) / x.landAreaSquareFeet;
  if (!Number.isFinite(coveragePercent))
    simpleError(
      "coveragePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    coveragePercent: Object.is(coveragePercent, -0) ? 0 : coveragePercent,
  };
};

export const example = {
  input: {
    buildingFootprintSquareFeet: 2500,
    landAreaSquareFeet: 10000,
  },
  output: { coveragePercent: 25 },
} satisfies ToolExample<LotCoverageRatioInput, LotCoverageRatioOutput>;

export const tool = createSimpleTool({
  id: "real-estate/lot-coverage-ratio",
  title: "Lot Coverage Ratio",
  description: "Building footprint area as a percentage of site area.",
  inputs: [
    {
      id: "buildingFootprintSquareFeet",
      kind: "number",
      label: "Building Footprint Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "landAreaSquareFeet",
      kind: "number",
      label: "Land Area Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coveragePercent",
      kind: "number",
      label: "Coverage Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateLotCoverageRatio({
      buildingFootprintSquareFeet: input.buildingFootprintSquareFeet as number,
      landAreaSquareFeet: input.landAreaSquareFeet as number,
    }),
});
export const lotCoverageRatioTool = tool;
export const runLotCoverageRatio = tool.execute;
export default tool;
