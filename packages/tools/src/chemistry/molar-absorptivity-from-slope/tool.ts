import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const molarAbsorptivityFromSlopeTool = createSimpleTool({
  id: "chemistry/molar-absorptivity-from-slope",
  title: "Molar Absorptivity From Slope Calculator",
  description:
    "Derive molar absorptivity ε from a Beer-Lambert calibration slope (A = ε·b·c) and the path length.",
  inputs: [
    {
      description: "Slope of absorbance versus concentration.",
      id: "calibrationSlope",
      label: "Calibration slope",
      kind: "number",
      unit: "L/(mol·cm)",
    },
    {
      description: "Cuvette path length; must be greater than zero.",
      id: "pathLengthCm",
      label: "Path length",
      kind: "number",
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "Molar absorptivity in L·mol⁻¹·cm⁻¹.",
      id: "molarAbsorptivity",
      label: "Molar absorptivity",
      kind: "number",
      unit: "L/(mol·cm)",
    },
  ],
  calculate: (input) => {
    const path = input.pathLengthCm as number;
    if (path <= 0)
      simpleError(
        "pathLengthCm",
        "The path length must be greater than zero.",
        "invalid_path_length",
      );
    return { molarAbsorptivity: (input.calibrationSlope as number) / path };
  },
});
export const runMolarAbsorptivityFromSlope =
  molarAbsorptivityFromSlopeTool.execute;
export default molarAbsorptivityFromSlopeTool;

export type MolarAbsorptivityFromSlopeInput = {
  readonly calibrationSlope: number;
  readonly pathLengthCm: number;
};

export type MolarAbsorptivityFromSlopeOutput = {
  readonly molarAbsorptivity: number;
};

export const molarAbsorptivityFromSlopeExample = {
  input: {
    calibrationSlope: 1,
    pathLengthCm: 1,
  },
  output: {
    molarAbsorptivity: 1,
  },
} satisfies ToolExample<
  MolarAbsorptivityFromSlopeInput,
  MolarAbsorptivityFromSlopeOutput
>;
