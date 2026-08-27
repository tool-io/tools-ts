import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagmaDensityInput = {
  readonly crystalVolumeFraction: number;
  readonly crystalDensityKgPerM3: number;
  readonly meltDensityKgPerM3: number;
};

export type MagmaDensityOutput = {
  readonly magmaDensityKgPerM3: number;
};

export const calculateMagmaDensity = (
  input: MagmaDensityInput,
): MagmaDensityOutput => {
  if (!(input.meltDensityKgPerM3 > 0))
    simpleError(
      "meltDensityKgPerM3",
      "Melt density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.crystalDensityKgPerM3 > 0))
    simpleError(
      "crystalDensityKgPerM3",
      "Crystal density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.crystalVolumeFraction >= 0 && input.crystalVolumeFraction <= 1))
    simpleError(
      "crystalVolumeFraction",
      "Crystal volume fraction must lie between 0 and 1.",
      "invalid_fraction",
    );
  return {
    magmaDensityKgPerM3:
      input.meltDensityKgPerM3 * (1 - input.crystalVolumeFraction) +
      input.crystalDensityKgPerM3 * input.crystalVolumeFraction,
  };
};

export const magmaDensityExample = {
  input: {
    crystalVolumeFraction: 0.25,
    crystalDensityKgPerM3: 2700,
    meltDensityKgPerM3: 2400,
  },
  output: { magmaDensityKgPerM3: 2475 },
} satisfies ToolExample<MagmaDensityInput, MagmaDensityOutput>;

export const magmaDensityTool = createSimpleTool({
  id: "geology/magma-density",
  title: "Magma Density Calculator",
  description:
    "Bulk magma density as the volume-weighted mixture of melt and suspended crystals: rho = rho_melt (1 - phi) + rho_crystals phi.",
  inputs: [
    {
      description: "Volumetric crystal fraction, 0 to 1.",
      id: "crystalVolumeFraction",
      kind: "number",
      label: "Crystal fraction",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Crystal density in kilograms per cubic meter.",
      id: "crystalDensityKgPerM3",
      kind: "number",
      label: "Crystal density",
      minimum: 0,
    },
    {
      description: "Melt density in kilograms per cubic meter.",
      id: "meltDensityKgPerM3",
      kind: "number",
      label: "Melt density",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Bulk magma density in kilograms per cubic meter.",
      id: "magmaDensityKgPerM3",
      kind: "number",
      label: "Magma density",
    },
  ],
  calculate: (input) =>
    calculateMagmaDensity(input as unknown as MagmaDensityInput),
});

export const runMagmaDensity = magmaDensityTool.execute;
export default magmaDensityTool;
