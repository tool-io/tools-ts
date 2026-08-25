import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fickDiffusionRateExample = {
  input: {
    areaCm2: 1,
    concentrationDifferenceMgMl: 1,
    diffusionCoefficientCm2S: 0.00001,
    membraneThicknessUm: 100,
  },
  output: { diffusionRateMgPerS: 0.001 },
} satisfies ToolExample<
  {
    readonly areaCm2: number;
    readonly concentrationDifferenceMgMl: number;
    readonly diffusionCoefficientCm2S: number;
    readonly membraneThicknessUm: number;
  },
  { readonly diffusionRateMgPerS: number }
>;

export const fickDiffusionRateTool = createSimpleTool({
  id: "biology/fick-diffusion-rate",
  title: "Fick Diffusion Rate",
  description:
    "Compute the magnitude of steady-state diffusion with Fick's first law. Concentration in mg/mL is equivalent to mg/cm³, and membrane thickness is converted from micrometres to centimetres so the result is in mg/s.",
  inputs: [
    {
      description: "Diffusion coefficient in square centimetres per second.",
      id: "diffusionCoefficientCm2S",
      label: "Diffusion coefficient",
      kind: "number",
      unit: "cm²/s",
    },
    {
      description: "Membrane surface area in square centimetres.",
      id: "areaCm2",
      label: "Area",
      kind: "number",
      unit: "cm²",
    },
    {
      description:
        "Magnitude of the concentration difference across the membrane.",
      id: "concentrationDifferenceMgMl",
      label: "Concentration difference",
      kind: "number",
      unit: "mg/mL",
    },
    {
      description: "Membrane thickness in micrometres.",
      id: "membraneThicknessUm",
      label: "Membrane thickness",
      kind: "number",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Magnitude of the steady-state diffusion rate.",
      id: "diffusionRateMgPerS",
      label: "Diffusion rate",
      kind: "number",
      unit: "mg/s",
    },
  ],
  calculate: (input) => {
    const coefficient = input.diffusionCoefficientCm2S as number;
    const area = input.areaCm2 as number;
    const deltaConc = input.concentrationDifferenceMgMl as number;
    const thickness = input.membraneThicknessUm as number;
    if (!(coefficient > 0))
      simpleError(
        "diffusionCoefficientCm2S",
        "The diffusion coefficient must be greater than zero.",
      );
    if (!(area > 0))
      simpleError("areaCm2", "The area must be greater than zero.");
    if (!(deltaConc > 0))
      simpleError(
        "concentrationDifferenceMgMl",
        "The concentration difference must be greater than zero.",
      );
    if (!(thickness > 0))
      simpleError(
        "membraneThicknessUm",
        "The membrane thickness must be greater than zero.",
      );
    const thicknessCm = thickness * 1e-4;
    return {
      diffusionRateMgPerS: (coefficient * area * deltaConc) / thicknessCm,
    };
  },
});
export const runFickDiffusionRate = fickDiffusionRateTool.execute;
export default fickDiffusionRateTool;
