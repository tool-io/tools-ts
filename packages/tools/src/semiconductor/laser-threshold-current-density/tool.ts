import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaserThresholdCurrentDensityInput = {
  readonly activeThicknessUm: number;
  readonly recombinationRatePerCm3PerS: number;
};

export type LaserThresholdCurrentDensityOutput = {
  readonly thresholdCurrentDensityKAPerCm2: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const laserThresholdCurrentDensityExample = {
  input: {
    activeThicknessUm: 0.5,
    recombinationRatePerCm3PerS: 1e24,
  },
  output: { thresholdCurrentDensityKAPerCm2: 0.00801088317 },
} satisfies ToolExample<
  LaserThresholdCurrentDensityInput,
  LaserThresholdCurrentDensityOutput
>;

export const laserThresholdCurrentDensityTool = createSimpleTool({
  id: "semiconductor/laser-threshold-current-density",
  title: "Laser Threshold Current Density Calculator",
  description:
    "Compute the laser threshold current density from active region thickness and recombination rate using J equals q times d times R.",
  inputs: [
    {
      description: "Active region thickness.",
      id: "activeThicknessUm",
      kind: "number",
      label: "Active thickness",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Recombination rate at threshold.",
      id: "recombinationRatePerCm3PerS",
      kind: "number",
      label: "Recombination rate",
      minimum: Number.MIN_VALUE,
      unit: "cm⁻³·s⁻¹",
    },
  ],
  outputs: [
    {
      description: "Threshold current density.",
      format: "density",
      id: "thresholdCurrentDensityKAPerCm2",
      kind: "number",
      label: "Threshold current density",
      minimum: Number.MIN_VALUE,
      unit: "kA/cm²",
    },
  ],
  calculate: (input) => {
    const thicknessUm = input.activeThicknessUm as number;
    const recombinationRate = input.recombinationRatePerCm3PerS as number;
    if (!(thicknessUm > 0))
      simpleError(
        "activeThicknessUm",
        "Active thickness must be positive.",
        "invalid_thickness",
      );
    if (!(recombinationRate > 0))
      simpleError(
        "recombinationRatePerCm3PerS",
        "Recombination rate must be positive.",
        "invalid_recombination_rate",
      );
    return {
      thresholdCurrentDensityKAPerCm2:
        (ELEMENTARY_CHARGE_C * thicknessUm * 1e-4 * recombinationRate) / 1e3,
    };
  },
});
export const runLaserThresholdCurrentDensity =
  laserThresholdCurrentDensityTool.execute;
export default laserThresholdCurrentDensityTool;
