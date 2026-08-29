import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpectroscopyAbsorptivityFromSlopeInput = {
  readonly calibrationSlope: number;
  readonly pathLengthCm: number;
};

export type SpectroscopyAbsorptivityFromSlopeOutput = {
  readonly molarAbsorptivity: number;
};

export const spectroscopyAbsorptivityFromSlopeExample = {
  input: { calibrationSlope: 6000, pathLengthCm: 2 },
  output: { molarAbsorptivity: 3000 },
} satisfies ToolExample<
  SpectroscopyAbsorptivityFromSlopeInput,
  SpectroscopyAbsorptivityFromSlopeOutput
>;

export const spectroscopyAbsorptivityFromSlopeTool = createSimpleTool({
  id: "chemistry/spectroscopy-absorptivity-from-slope",
  title: "Absorptivity From Slope",
  description:
    "Compute molar absorptivity from a Beer-Lambert calibration slope by dividing the slope by the optical path length.",
  inputs: [
    {
      id: "calibrationSlope",
      label: "Calibration slope",
      kind: "number",
      unit: "absorbance/M",
    },
    { id: "pathLengthCm", label: "Path length", kind: "number", unit: "cm" },
  ],
  outputs: [
    {
      id: "molarAbsorptivity",
      label: "Molar absorptivity",
      kind: "number",
      unit: "L/(mol·cm)",
    },
  ],
  calculate: (input) => {
    const calibrationSlope = input.calibrationSlope as number;
    const pathLengthCm = input.pathLengthCm as number;
    if (!(calibrationSlope > 0))
      simpleError(
        "calibrationSlope",
        "Calibration slope must be positive.",
        "invalid_slope",
      );
    if (!(pathLengthCm > 0))
      simpleError(
        "pathLengthCm",
        "Path length must be positive.",
        "invalid_path_length",
      );
    return { molarAbsorptivity: calibrationSlope / pathLengthCm };
  },
});
export const runSpectroscopyAbsorptivityFromSlope =
  spectroscopyAbsorptivityFromSlopeTool.execute;
export default spectroscopyAbsorptivityFromSlopeTool;
