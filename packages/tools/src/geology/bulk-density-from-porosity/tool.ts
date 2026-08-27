import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BulkDensityFromPorosityInput = {
  readonly grainDensityKgPerM3: number;
  readonly porosityFraction: number;
};

export type BulkDensityFromPorosityOutput = {
  readonly bulkDensityKgPerM3: number;
};

export const calculateBulkDensityFromPorosity = (
  input: BulkDensityFromPorosityInput,
): BulkDensityFromPorosityOutput => {
  if (!(input.grainDensityKgPerM3 > 0))
    simpleError(
      "grainDensityKgPerM3",
      "Grain density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.porosityFraction >= 0 && input.porosityFraction < 1))
    simpleError(
      "porosityFraction",
      "Porosity must lie in the range [0, 1).",
      "invalid_porosity",
    );
  return {
    bulkDensityKgPerM3:
      input.grainDensityKgPerM3 * (1 - input.porosityFraction),
  };
};

export const bulkDensityFromPorosityExample = {
  input: { grainDensityKgPerM3: 2650, porosityFraction: 0.25 },
  output: { bulkDensityKgPerM3: 1987.5 },
} satisfies ToolExample<
  BulkDensityFromPorosityInput,
  BulkDensityFromPorosityOutput
>;

export const bulkDensityFromPorosityTool = createSimpleTool({
  id: "geology/bulk-density-from-porosity",
  title: "Bulk Density From Porosity Calculator",
  description:
    "Compute dry bulk density as the product of grain density and (1 - porosity).",
  inputs: [
    {
      description: "Grain (solid particle) density in kg/m3.",
      id: "grainDensityKgPerM3",
      kind: "number",
      label: "Grain density",
      minimum: 0,
    },
    {
      description: "Porosity as a fraction between 0 and 1.",
      id: "porosityFraction",
      kind: "number",
      label: "Porosity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dry bulk density in kg/m3.",
      id: "bulkDensityKgPerM3",
      kind: "number",
      label: "Bulk density",
    },
  ],
  calculate: (input) =>
    calculateBulkDensityFromPorosity(
      input as unknown as BulkDensityFromPorosityInput,
    ),
});

export const runBulkDensityFromPorosity = bulkDensityFromPorosityTool.execute;
export default bulkDensityFromPorosityTool;
