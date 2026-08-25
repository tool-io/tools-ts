import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CellSeedingDensityInput = {
  readonly cellCount: number;
  readonly growthAreaCm2: number;
};

export type CellSeedingDensityOutput = {
  readonly seedingDensityPerCm2: number;
};

export const cellSeedingDensityExample = {
  input: { cellCount: 250000, growthAreaCm2: 25 },
  output: { seedingDensityPerCm2: 10000 },
} satisfies ToolExample<CellSeedingDensityInput, CellSeedingDensityOutput>;

export const cellSeedingDensityTool = createSimpleTool({
  id: "biology/cell-seeding-density",
  title: "Seeding Density",
  description:
    "Compute cell seeding density in cells per square centimeter from a cell count and growth area.",
  inputs: [
    { id: "cellCount", label: "Cell count", kind: "integer", minimum: 0 },
    {
      id: "growthAreaCm2",
      label: "Growth area",
      kind: "number",
      unit: "cm^2",
    },
  ],
  outputs: [
    {
      id: "seedingDensityPerCm2",
      label: "Seeding density",
      kind: "number",
      unit: "cells/cm^2",
    },
  ],
  calculate: (input) => {
    const growthAreaCm2 = input.growthAreaCm2 as number;
    if (!(growthAreaCm2 > 0))
      simpleError("growthAreaCm2", "Growth area must be positive.");
    return {
      seedingDensityPerCm2: (input.cellCount as number) / growthAreaCm2,
    };
  },
});
export const runCellSeedingDensity = cellSeedingDensityTool.execute;
export default cellSeedingDensityTool;
