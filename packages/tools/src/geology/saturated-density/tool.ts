import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SaturatedDensityInput = {
  readonly specificGravity?: number;
  readonly voidRatio: number;
  readonly waterDensityKgPerM3?: number;
};

export type SaturatedDensityOutput = {
  readonly saturatedDensityKgPerM3: number;
};

export const calculateSaturatedDensity = (
  input: SaturatedDensityInput,
): SaturatedDensityOutput => {
  const specificGravity = input.specificGravity ?? 2.65;
  const waterDensityKgPerM3 = input.waterDensityKgPerM3 ?? 1000;
  if (!(specificGravity > 0))
    simpleError(
      "specificGravity",
      "Specific gravity must be greater than zero.",
      "invalid_density",
    );
  if (!(input.voidRatio >= 0))
    simpleError(
      "voidRatio",
      "Void ratio cannot be negative.",
      "invalid_void_ratio",
    );
  if (!(waterDensityKgPerM3 > 0))
    simpleError(
      "waterDensityKgPerM3",
      "Water density must be greater than zero.",
      "invalid_density",
    );
  return {
    saturatedDensityKgPerM3:
      ((specificGravity + input.voidRatio) / (1 + input.voidRatio)) *
      waterDensityKgPerM3,
  };
};

export const saturatedDensityExample = {
  input: { specificGravity: 2.65, voidRatio: 0.6, waterDensityKgPerM3: 1000 },
  output: { saturatedDensityKgPerM3: 2031.25 },
} satisfies ToolExample<SaturatedDensityInput, SaturatedDensityOutput>;

export const saturatedDensityTool = createSimpleTool({
  id: "geology/saturated-density",
  title: "Saturated Density Calculator",
  description:
    "Compute the saturated bulk density from specific gravity and void ratio using rho_sat = (Gs + e) / (1 + e) * rho_w.",
  inputs: [
    {
      default: 2.65,
      description: "Specific gravity of the solid particles (dimensionless).",
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
      minimum: 0,
    },
    {
      description: "Void ratio of the soil or rock (dimensionless).",
      id: "voidRatio",
      kind: "number",
      label: "Void ratio",
      minimum: 0,
    },
    {
      default: 1000,
      description: "Water density in kg/m3 (default 1000).",
      id: "waterDensityKgPerM3",
      kind: "number",
      label: "Water density",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Saturated bulk density in kg/m3.",
      id: "saturatedDensityKgPerM3",
      kind: "number",
      label: "Saturated density",
    },
  ],
  calculate: (input) =>
    calculateSaturatedDensity(input as unknown as SaturatedDensityInput),
});

export const runSaturatedDensity = saturatedDensityTool.execute;
export default saturatedDensityTool;
