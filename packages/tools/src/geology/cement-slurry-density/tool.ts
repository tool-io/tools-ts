import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CementSlurryDensityInput = {
  readonly waterCementRatioKilogramPerKilogram?: number;
  readonly cementSpecificGravity?: number;
};

export type CementSlurryDensityOutput = {
  readonly slurryVolumeCubicMetresPerTonne: number;
  readonly slurryDensityKilogramsPerCubicMetre: number;
};

export const calculateCementSlurryDensity = (
  input: CementSlurryDensityInput,
): CementSlurryDensityOutput => {
  const waterCementRatio = input.waterCementRatioKilogramPerKilogram ?? 0.44;
  const specificGravity = input.cementSpecificGravity ?? 3.14;
  if (!(waterCementRatio > 0))
    return simpleError(
      "waterCementRatioKilogramPerKilogram",
      "Water/cement ratio must be greater than zero.",
      "invalid_ratio",
    );
  if (!(specificGravity > 0))
    return simpleError(
      "cementSpecificGravity",
      "Cement specific gravity must be greater than zero.",
      "invalid_gravity",
    );
  const volume = 1 / specificGravity + waterCementRatio;
  return {
    slurryVolumeCubicMetresPerTonne: volume,
    slurryDensityKilogramsPerCubicMetre:
      (1000 * (1 + waterCementRatio)) / volume,
  };
};

export const cementSlurryDensityExample = {
  input: {
    waterCementRatioKilogramPerKilogram: 0.44,
    cementSpecificGravity: 3.14,
  },
  output: {
    slurryVolumeCubicMetresPerTonne: 0.7584713375796178,
    slurryDensityKilogramsPerCubicMetre: 1898.5555928787371,
  },
} satisfies ToolExample<CementSlurryDensityInput, CementSlurryDensityOutput>;

export const cementSlurryDensityTool = createSimpleTool({
  id: "geology/cement-slurry-density",
  title: "Cement Slurry Density Calculator",
  description:
    "Compute neat cement slurry density and yield per tonne of dry cement from the water/cement mass ratio and cement specific gravity.",
  inputs: [
    {
      default: 0.44,
      description: "Water-to-cement mass ratio in kilograms per kilogram.",
      id: "waterCementRatioKilogramPerKilogram",
      kind: "number",
      label: "Water/cement ratio",
    },
    {
      default: 3.14,
      description: "Specific gravity of the dry cement.",
      id: "cementSpecificGravity",
      kind: "number",
      label: "Cement SG",
    },
  ],
  outputs: [
    {
      description:
        "Slurry volume produced per tonne of dry cement in cubic metres.",
      id: "slurryVolumeCubicMetresPerTonne",
      kind: "number",
      label: "Yield",
    },
    {
      description: "Slurry density in kilograms per cubic metre.",
      id: "slurryDensityKilogramsPerCubicMetre",
      kind: "number",
      label: "Density",
    },
  ],
  calculate: (input) =>
    calculateCementSlurryDensity(input as unknown as CementSlurryDensityInput),
});

export const runCementSlurryDensity = cementSlurryDensityTool.execute;
export default cementSlurryDensityTool;
