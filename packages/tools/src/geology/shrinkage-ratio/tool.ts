import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShrinkageRatioInput = {
  readonly wetVolumeCm3: number;
  readonly dryVolumeCm3: number;
  readonly wetMassG: number;
  readonly dryMassG: number;
  readonly waterDensityGPerCm3?: number;
};

export type ShrinkageRatioOutput = {
  readonly shrinkageRatio: number;
  readonly shrinkageLimitPercent: number;
};

export const calculateShrinkageRatio = (
  input: ShrinkageRatioInput,
): ShrinkageRatioOutput => {
  const waterDensity = input.waterDensityGPerCm3 ?? 1;
  for (const key of [
    "wetVolumeCm3",
    "dryVolumeCm3",
    "wetMassG",
    "dryMassG",
  ] as const) {
    if (!((input[key] as number) > 0))
      simpleError(
        key,
        "Volumes and masses must be greater than zero.",
        "invalid_measurement",
      );
  }
  if (!(input.wetVolumeCm3 > input.dryVolumeCm3))
    simpleError(
      "wetVolumeCm3",
      "Wet volume must exceed the oven-dry volume.",
      "invalid_measurement",
    );
  if (!(input.wetMassG > input.dryMassG))
    simpleError(
      "wetMassG",
      "Wet mass must exceed the oven-dry mass.",
      "invalid_measurement",
    );
  if (!(waterDensity > 0))
    simpleError(
      "waterDensityGPerCm3",
      "Water density must be greater than zero.",
      "invalid_density",
    );
  const shrinkageLimitPercent =
    ((input.wetMassG -
      input.dryMassG -
      (input.wetVolumeCm3 - input.dryVolumeCm3) * waterDensity) /
      input.dryMassG) *
    100;
  if (!(shrinkageLimitPercent >= 0))
    simpleError(
      "wetMassG",
      "The measurements imply a negative shrinkage limit.",
      "inconsistent_measurements",
    );
  return {
    shrinkageRatio: input.dryMassG / (input.dryVolumeCm3 * waterDensity),
    shrinkageLimitPercent,
  };
};

export const shrinkageRatioExample = {
  input: { wetVolumeCm3: 25, dryVolumeCm3: 20, wetMassG: 43, dryMassG: 37 },
  output: {
    shrinkageRatio: 1.85,
    shrinkageLimitPercent: 2.7027027027027026,
  },
} satisfies ToolExample<ShrinkageRatioInput, ShrinkageRatioOutput>;

export const shrinkageRatioTool = createSimpleTool({
  id: "geology/shrinkage-ratio",
  title: "Shrinkage Ratio Calculator",
  description:
    "Compute soil shrinkage ratio as oven-dry density divided by water density, and shrinkage limit from the mass and volume lost while drying.",
  inputs: [
    {
      description: "Initial wet volume V1 in cm3.",
      id: "wetVolumeCm3",
      kind: "number",
      label: "Wet volume",
      minimum: 0,
    },
    {
      description: "Oven-dry volume V2 in cm3.",
      id: "dryVolumeCm3",
      kind: "number",
      label: "Dry volume",
      minimum: 0,
    },
    {
      description: "Initial wet mass M1 in g.",
      id: "wetMassG",
      kind: "number",
      label: "Wet mass",
      minimum: 0,
    },
    {
      description: "Oven-dry mass M2 in g.",
      id: "dryMassG",
      kind: "number",
      label: "Dry mass",
      minimum: 0,
    },
    {
      default: 1,
      description: "Water density in grams per cubic centimeter.",
      id: "waterDensityGPerCm3",
      kind: "number",
      label: "Water density",
      unit: "g/cm³",
    },
  ],
  outputs: [
    {
      description:
        "Shrinkage ratio SR (dimensionless, equals dry density over water density when drying is fully saturated).",
      id: "shrinkageRatio",
      kind: "number",
      label: "Shrinkage ratio",
    },
    {
      description: "Shrinkage limit SL as a water content in percent.",
      id: "shrinkageLimitPercent",
      kind: "number",
      label: "Shrinkage limit",
    },
  ],
  calculate: (input) =>
    calculateShrinkageRatio(input as unknown as ShrinkageRatioInput),
});

export const runShrinkageRatio = shrinkageRatioTool.execute;
export default shrinkageRatioTool;
