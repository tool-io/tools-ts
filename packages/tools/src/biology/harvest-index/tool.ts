import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HarvestIndexInput = {
  readonly grainYieldKg: number;
  readonly totalBiomassKg: number;
};

export type HarvestIndexOutput = {
  readonly harvestIndex: number;
};

export const harvestIndexExample = {
  input: { grainYieldKg: 4000, totalBiomassKg: 8000 },
  output: { harvestIndex: 0.5 },
} satisfies ToolExample<HarvestIndexInput, HarvestIndexOutput>;

export const harvestIndexTool = createSimpleTool({
  id: "biology/harvest-index",
  title: "Harvest Index",
  description:
    "Compute the harvest index as grain yield divided by total above-ground biomass, which must not exceed the biomass.",
  inputs: [
    {
      id: "grainYieldKg",
      kind: "number",
      label: "Grain yield",
      minimum: 0,
      unit: "kg",
    },
    {
      id: "totalBiomassKg",
      kind: "number",
      label: "Total biomass",
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "harvestIndex",
      kind: "number",
      label: "Harvest index",
    },
  ],
  calculate: (input) => {
    const grainYieldKg = input.grainYieldKg as number;
    const totalBiomassKg = input.totalBiomassKg as number;
    if (!(totalBiomassKg > 0))
      simpleError(
        "totalBiomassKg",
        "The total biomass must be greater than zero.",
      );
    if (grainYieldKg > totalBiomassKg)
      simpleError(
        "grainYieldKg",
        "The grain yield cannot exceed the total biomass.",
        "invalid_yields",
      );
    return { harvestIndex: grainYieldKg / totalBiomassKg };
  },
});
export const runHarvestIndex = harvestIndexTool.execute;
export default harvestIndexTool;
