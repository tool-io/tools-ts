import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafAreaDensityInput = Readonly<{
  readonly leafSquareMeters: number;
  readonly canopyCubicMeters: number;
}>;
export type LeafAreaDensityOutput = Readonly<{
  readonly leafAreaDensity: number;
}>;

export const calculateLeafAreaDensity = (
  x: LeafAreaDensityInput,
): LeafAreaDensityOutput => {
  if (!Number.isFinite(x.leafSquareMeters) || x.leafSquareMeters < 0)
    simpleError("leafSquareMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.canopyCubicMeters) || x.canopyCubicMeters <= 0)
    simpleError("canopyCubicMeters", "Provide a finite positive number.");
  const leafAreaDensity = x.leafSquareMeters / x.canopyCubicMeters;
  if (!Number.isFinite(leafAreaDensity))
    simpleError(
      "leafAreaDensity",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    leafAreaDensity: Object.is(leafAreaDensity, -0) ? 0 : leafAreaDensity,
  };
};

export const example = {
  input: {
    leafSquareMeters: 100,
    canopyCubicMeters: 50,
  },
  output: { leafAreaDensity: 2 },
} satisfies ToolExample<LeafAreaDensityInput, LeafAreaDensityOutput>;

export const tool = createSimpleTool({
  id: "forestry/leaf-area-density",
  title: "Leaf Area Density",
  description: "One-sided foliage area per occupied canopy volume, in m²/m³.",
  inputs: [
    {
      id: "leafSquareMeters",
      kind: "number",
      label: "Leaf Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "canopyCubicMeters",
      kind: "number",
      label: "Canopy Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "leafAreaDensity",
      kind: "number",
      label: "Leaf Area Density",
      unit: "m2/m3",
    },
  ],
  calculate: (input) =>
    calculateLeafAreaDensity({
      leafSquareMeters: input.leafSquareMeters as number,
      canopyCubicMeters: input.canopyCubicMeters as number,
    }),
});
export const leafAreaDensityTool = tool;
export const runLeafAreaDensity = tool.execute;
export default tool;
