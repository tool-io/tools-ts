import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FoldWavelengthInput = {
  readonly layerThicknessMeters: number;
  readonly viscosityContrast: number;
};

export type FoldWavelengthOutput = {
  readonly dominantWavelengthMeters: number;
};

export const calculateFoldWavelength = (
  input: FoldWavelengthInput,
): FoldWavelengthOutput => {
  if (!(input.layerThicknessMeters > 0))
    simpleError(
      "layerThicknessMeters",
      "Layer thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(input.viscosityContrast > 0))
    simpleError(
      "viscosityContrast",
      "Viscosity contrast must be greater than zero.",
      "invalid_contrast",
    );
  return {
    dominantWavelengthMeters:
      2 *
      Math.PI *
      input.layerThicknessMeters *
      Math.cbrt(input.viscosityContrast / 6),
  };
};

export const foldWavelengthExample = {
  input: { layerThicknessMeters: 1, viscosityContrast: 100 },
  output: { dominantWavelengthMeters: 16.04954722122767 },
} satisfies ToolExample<FoldWavelengthInput, FoldWavelengthOutput>;

export const foldWavelengthTool = createSimpleTool({
  id: "geology/fold-wavelength",
  title: "Fold Wavelength Calculator",
  description:
    "Estimate the Biot–Ramberg dominant wavelength of a competent viscous layer as 2π times thickness times the cube root of the viscosity contrast divided by six.",
  inputs: [
    {
      description: "Competent layer thickness in meters.",
      id: "layerThicknessMeters",
      kind: "number",
      label: "Thickness",
      minimum: 0,
    },
    {
      description:
        "Ratio of layer viscosity to matrix viscosity (dimensionless).",
      id: "viscosityContrast",
      kind: "number",
      label: "Viscosity contrast",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dominant buckle-fold wavelength in meters.",
      id: "dominantWavelengthMeters",
      kind: "number",
      label: "Dominant wavelength",
    },
  ],
  calculate: (input) =>
    calculateFoldWavelength(input as unknown as FoldWavelengthInput),
});

export const runFoldWavelength = foldWavelengthTool.execute;
export default foldWavelengthTool;
