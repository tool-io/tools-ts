import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LandToBuildingRatioInput = Readonly<{
  readonly landAreaSquareFeet: number;
  readonly buildingFootprintSquareFeet: number;
}>;
export type LandToBuildingRatioOutput = Readonly<{
  readonly landToBuildingRatio: number;
}>;

export const calculateLandToBuildingRatio = (
  x: LandToBuildingRatioInput,
): LandToBuildingRatioOutput => {
  if (!Number.isFinite(x.landAreaSquareFeet) || x.landAreaSquareFeet <= 0)
    simpleError("landAreaSquareFeet", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.buildingFootprintSquareFeet) ||
    x.buildingFootprintSquareFeet <= 0
  )
    simpleError(
      "buildingFootprintSquareFeet",
      "Provide a finite positive number.",
    );
  const landToBuildingRatio =
    x.landAreaSquareFeet / x.buildingFootprintSquareFeet;
  if (!Number.isFinite(landToBuildingRatio))
    simpleError(
      "landToBuildingRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    landToBuildingRatio: Object.is(landToBuildingRatio, -0)
      ? 0
      : landToBuildingRatio,
  };
};

export const example = {
  input: {
    landAreaSquareFeet: 10000,
    buildingFootprintSquareFeet: 2500,
  },
  output: { landToBuildingRatio: 4 },
} satisfies ToolExample<LandToBuildingRatioInput, LandToBuildingRatioOutput>;

export const tool = createSimpleTool({
  id: "real-estate/land-to-building-ratio",
  title: "Land To Building Ratio",
  description:
    "Site area divided by building footprint area, using matching area units.",
  inputs: [
    {
      id: "landAreaSquareFeet",
      kind: "number",
      label: "Land Area Square Feet",
      unit: "ft2",
      minimum: 0,
    },
    {
      id: "buildingFootprintSquareFeet",
      kind: "number",
      label: "Building Footprint Square Feet",
      unit: "ft2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "landToBuildingRatio",
      kind: "number",
      label: "Land To Building Ratio",
    },
  ],
  calculate: (input) =>
    calculateLandToBuildingRatio({
      landAreaSquareFeet: input.landAreaSquareFeet as number,
      buildingFootprintSquareFeet: input.buildingFootprintSquareFeet as number,
    }),
});
export const landToBuildingRatioTool = tool;
export const runLandToBuildingRatio = tool.execute;
export default tool;
