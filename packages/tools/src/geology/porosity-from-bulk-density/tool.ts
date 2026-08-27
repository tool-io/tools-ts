import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PorosityFromBulkDensityInput = {
  readonly bulkDensityKgPerM3: number;
  readonly grainDensityKgPerM3: number;
};

export type PorosityFromBulkDensityOutput = {
  readonly porosityFraction: number;
  readonly porosityPercent: number;
};

export const calculatePorosityFromBulkDensity = (
  input: PorosityFromBulkDensityInput,
): PorosityFromBulkDensityOutput => {
  if (!(input.grainDensityKgPerM3 > 0))
    simpleError(
      "grainDensityKgPerM3",
      "Grain density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.bulkDensityKgPerM3 > 0))
    simpleError(
      "bulkDensityKgPerM3",
      "Bulk density must be greater than zero.",
      "invalid_density",
    );
  if (input.bulkDensityKgPerM3 > input.grainDensityKgPerM3)
    simpleError(
      "bulkDensityKgPerM3",
      "Bulk density cannot exceed grain density.",
      "invalid_density",
    );
  const porosityFraction =
    1 - input.bulkDensityKgPerM3 / input.grainDensityKgPerM3;
  return { porosityFraction, porosityPercent: porosityFraction * 100 };
};

export const porosityFromBulkDensityExample = {
  input: { bulkDensityKgPerM3: 2000, grainDensityKgPerM3: 2650 },
  output: {
    porosityFraction: 0.24528301886792447,
    porosityPercent: 24.52830188679245,
  },
} satisfies ToolExample<
  PorosityFromBulkDensityInput,
  PorosityFromBulkDensityOutput
>;

export const porosityFromBulkDensityTool = createSimpleTool({
  id: "geology/porosity-from-bulk-density",
  title: "Porosity From Bulk Density Calculator",
  description:
    "Compute porosity as n = 1 - (bulk density / grain density) for a rock or soil sample.",
  inputs: [
    {
      description: "Dry bulk density of the sample in kg/m3.",
      id: "bulkDensityKgPerM3",
      kind: "number",
      label: "Bulk density",
      minimum: 0,
    },
    {
      description: "Grain (solid particle) density in kg/m3.",
      id: "grainDensityKgPerM3",
      kind: "number",
      label: "Grain density",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Porosity as a fraction (dimensionless).",
      id: "porosityFraction",
      kind: "number",
      label: "Porosity fraction",
    },
    {
      description: "Porosity expressed in percent.",
      id: "porosityPercent",
      kind: "number",
      label: "Porosity percent",
    },
  ],
  calculate: (input) =>
    calculatePorosityFromBulkDensity(
      input as unknown as PorosityFromBulkDensityInput,
    ),
});

export const runPorosityFromBulkDensity = porosityFromBulkDensityTool.execute;
export default porosityFromBulkDensityTool;
