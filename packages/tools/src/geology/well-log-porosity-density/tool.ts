import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogPorosityDensityInput = {
  readonly bulkDensityKgPerM3: number;
  readonly matrixDensityKgPerM3: number;
  readonly fluidDensityKgPerM3: number;
};

export type WellLogPorosityDensityOutput = {
  readonly densityPorosity: number;
};

export const calculateWellLogPorosityDensity = (
  input: WellLogPorosityDensityInput,
): WellLogPorosityDensityOutput => {
  if (!(input.bulkDensityKgPerM3 > 0))
    return simpleError(
      "bulkDensityKgPerM3",
      "Bulk density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.matrixDensityKgPerM3 > 0))
    return simpleError(
      "matrixDensityKgPerM3",
      "Matrix density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.fluidDensityKgPerM3 > 0))
    return simpleError(
      "fluidDensityKgPerM3",
      "Fluid density must be greater than zero.",
      "invalid_density",
    );
  if (input.matrixDensityKgPerM3 === input.fluidDensityKgPerM3)
    return simpleError(
      "fluidDensityKgPerM3",
      "Fluid density must differ from matrix density.",
      "invalid_density",
    );
  return {
    densityPorosity:
      (input.matrixDensityKgPerM3 - input.bulkDensityKgPerM3) /
      (input.matrixDensityKgPerM3 - input.fluidDensityKgPerM3),
  };
};

export const wellLogPorosityDensityExample = {
  input: {
    bulkDensityKgPerM3: 2350,
    matrixDensityKgPerM3: 2650,
    fluidDensityKgPerM3: 1000,
  },
  output: { densityPorosity: 0.18181818181818182 },
} satisfies ToolExample<
  WellLogPorosityDensityInput,
  WellLogPorosityDensityOutput
>;

export const wellLogPorosityDensityTool = createSimpleTool({
  id: "geology/well-log-porosity-density",
  title: "Well Log Porosity Density Calculator",
  description:
    "Density-log porosity phi_D = (rho_ma - rho_b) / (rho_ma - rho_f) from bulk, matrix and pore-fluid densities in kilograms per cubic meter; the standard formation-density porosity relation.",
  inputs: [
    {
      description:
        "Bulk density measured by the density log in kilograms per cubic meter.",
      id: "bulkDensityKgPerM3",
      kind: "number",
      label: "rho b",
      minimum: 0,
    },
    {
      description: "Matrix (grain) density in kilograms per cubic meter.",
      id: "matrixDensityKgPerM3",
      kind: "number",
      label: "rho ma",
      minimum: 0,
    },
    {
      description: "Pore-fluid density in kilograms per cubic meter.",
      id: "fluidDensityKgPerM3",
      kind: "number",
      label: "rho f",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Density porosity as a fraction of bulk volume.",
      id: "densityPorosity",
      kind: "number",
      label: "phi D",
    },
  ],
  calculate: (input) =>
    calculateWellLogPorosityDensity(
      input as unknown as WellLogPorosityDensityInput,
    ),
});

export const runWellLogPorosityDensity = wellLogPorosityDensityTool.execute;
export default wellLogPorosityDensityTool;
