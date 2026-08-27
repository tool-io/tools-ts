import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrineDensityInput = {
  readonly saltMassKg: number;
  readonly volumeCubicMetres: number;
  readonly waterMassKg: number;
};

export type BrineDensityOutput = {
  readonly brineDensityKgPerCubicMetre: number;
  readonly salinityPpm: number;
};

export const calculateBrineDensity = (
  input: BrineDensityInput,
): BrineDensityOutput => {
  if (!(input.waterMassKg > 0))
    return simpleError(
      "waterMassKg",
      "Water mass must be greater than zero.",
      "invalid_mass",
    );
  if (!(input.saltMassKg >= 0))
    return simpleError(
      "saltMassKg",
      "Salt mass cannot be negative.",
      "invalid_mass",
    );
  if (!(input.volumeCubicMetres > 0))
    return simpleError(
      "volumeCubicMetres",
      "Volume must be greater than zero.",
      "invalid_volume",
    );
  const totalMassKg = input.waterMassKg + input.saltMassKg;
  return {
    brineDensityKgPerCubicMetre: totalMassKg / input.volumeCubicMetres,
    salinityPpm: (input.saltMassKg / totalMassKg) * 1e6,
  };
};

export const brineDensityExample = {
  input: { waterMassKg: 1, saltMassKg: 0.035, volumeCubicMetres: 0.001 },
  output: {
    brineDensityKgPerCubicMetre: 1035,
    salinityPpm: 33816.425120772954,
  },
} satisfies ToolExample<BrineDensityInput, BrineDensityOutput>;

export const brineDensityTool = createSimpleTool({
  id: "geology/brine-density",
  title: "Brine Density Calculator",
  description:
    "Compute brine density and dissolved-solids salinity from water mass, salt mass and solution volume.",
  inputs: [
    {
      description: "Mass of the water component in kilograms.",
      id: "waterMassKg",
      kind: "number",
      label: "Water mass",
      minimum: 0,
    },
    {
      description: "Mass of dissolved salts in kilograms.",
      id: "saltMassKg",
      kind: "number",
      label: "Salt mass",
      minimum: 0,
    },
    {
      description: "Total brine volume in cubic metres.",
      id: "volumeCubicMetres",
      kind: "number",
      label: "Volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Brine density in kilograms per cubic metre.",
      id: "brineDensityKgPerCubicMetre",
      kind: "number",
      label: "Brine density",
    },
    {
      description: "Dissolved salt concentration in parts per million by mass.",
      id: "salinityPpm",
      kind: "number",
      label: "Salinity",
    },
  ],
  calculate: (input) =>
    calculateBrineDensity(input as unknown as BrineDensityInput),
});

export const runBrineDensity = brineDensityTool.execute;
export default brineDensityTool;
