import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShrinkageLimitInput = {
  readonly initialWaterContentPercent: number;
  readonly wetVolumeCm3: number;
  readonly dryVolumeCm3: number;
  readonly dryMassG: number;
  readonly waterDensityGPerCm3?: number;
};

export type ShrinkageLimitOutput = {
  readonly shrinkageLimitPercent: number;
};

export const calculateShrinkageLimit = (
  input: ShrinkageLimitInput,
): ShrinkageLimitOutput => {
  const waterDensity = input.waterDensityGPerCm3 ?? 1;
  for (const key of ["wetVolumeCm3", "dryVolumeCm3", "dryMassG"] as const) {
    if (!(input[key] > 0))
      simpleError(
        key,
        "Volumes and dry mass must be greater than zero.",
        "invalid_measurement",
      );
  }
  if (!(waterDensity > 0))
    simpleError(
      "waterDensityGPerCm3",
      "Water density must be positive.",
      "invalid_density",
    );
  if (!(input.initialWaterContentPercent >= 0))
    simpleError(
      "initialWaterContentPercent",
      "Initial water content must not be negative.",
      "invalid_water_content",
    );
  if (input.wetVolumeCm3 < input.dryVolumeCm3)
    simpleError(
      "wetVolumeCm3",
      "Wet volume must not be less than the dry volume.",
      "invalid_measurement",
    );
  const shrinkageLimitPercent =
    input.initialWaterContentPercent -
    ((input.wetVolumeCm3 - input.dryVolumeCm3) * waterDensity * 100) /
      input.dryMassG;
  if (!(shrinkageLimitPercent >= 0))
    simpleError(
      "initialWaterContentPercent",
      "The measurements imply a negative shrinkage limit.",
      "inconsistent_measurements",
    );
  return { shrinkageLimitPercent };
};

export const shrinkageLimitExample = {
  input: {
    initialWaterContentPercent: 32,
    wetVolumeCm3: 18.5,
    dryVolumeCm3: 13.2,
    dryMassG: 42,
  },
  output: { shrinkageLimitPercent: 19.38095238095238 },
} satisfies ToolExample<ShrinkageLimitInput, ShrinkageLimitOutput>;

export const shrinkageLimitTool = createSimpleTool({
  id: "geology/shrinkage-limit",
  title: "Shrinkage Limit Calculator",
  description:
    "Compute the shrinkage limit SL in percent from the initial water content (percent), wet and dry pat volumes (cm3), oven-dry mass (g) and water density (g/cm3).",
  inputs: [
    {
      description: "Initial water content of the soil pat in percent.",
      id: "initialWaterContentPercent",
      kind: "number",
      label: "w",
    },
    {
      description: "Initial wet volume of the soil pat in cubic centimeters.",
      id: "wetVolumeCm3",
      kind: "number",
      label: "V",
    },
    {
      description: "Oven-dry volume of the soil pat in cubic centimeters.",
      id: "dryVolumeCm3",
      kind: "number",
      label: "Vd",
    },
    {
      description: "Oven-dry mass of the soil pat in grams.",
      id: "dryMassG",
      kind: "number",
      label: "Md",
    },
    {
      default: 1,
      description: "Water density in grams per cubic centimeter.",
      id: "waterDensityGPerCm3",
      kind: "number",
      label: "rho_w",
    },
  ],
  outputs: [
    {
      description: "Shrinkage limit in percent.",
      id: "shrinkageLimitPercent",
      kind: "number",
      label: "SL",
    },
  ],
  calculate: (input) =>
    calculateShrinkageLimit(input as unknown as ShrinkageLimitInput),
});

export const runShrinkageLimit = shrinkageLimitTool.execute;
export default shrinkageLimitTool;
