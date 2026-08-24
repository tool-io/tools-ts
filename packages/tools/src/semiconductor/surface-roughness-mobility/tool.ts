import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurfaceRoughnessMobilityInput = {
  readonly effectiveFieldVCm: number;
  readonly referenceFieldVCm: number;
  readonly referenceMobility: number;
};

export type SurfaceRoughnessMobilityOutput = {
  readonly mobilityCm2PerVs: number;
};

export const surfaceRoughnessMobilityExample = {
  input: {
    effectiveFieldVCm: 1e6,
    referenceFieldVCm: 5e5,
    referenceMobility: 1400,
  },
  output: { mobilityCm2PerVs: 350 },
} satisfies ToolExample<
  SurfaceRoughnessMobilityInput,
  SurfaceRoughnessMobilityOutput
>;

export const surfaceRoughnessMobilityTool = createSimpleTool({
  calculate: (input) => {
    const effectiveFieldVCm = input.effectiveFieldVCm as number;
    const referenceFieldVCm = input.referenceFieldVCm as number;
    const referenceMobility = input.referenceMobility as number;
    if (!(effectiveFieldVCm > 0))
      simpleError(
        "effectiveFieldVCm",
        "Effective field must be positive.",
        "invalid_effective_field",
      );
    if (!(referenceFieldVCm > 0))
      simpleError(
        "referenceFieldVCm",
        "Reference field must be positive.",
        "invalid_reference_field",
      );
    if (!(referenceMobility > 0))
      simpleError(
        "referenceMobility",
        "Reference mobility must be positive.",
        "invalid_reference_mobility",
      );
    const mobilityCm2PerVs =
      referenceMobility * Math.pow(referenceFieldVCm / effectiveFieldVCm, 2);
    if (!Number.isFinite(mobilityCm2PerVs))
      simpleError("effectiveFieldVCm", "Calculated mobility is not finite.");
    return { mobilityCm2PerVs };
  },
  description:
    "Scale a reference mobility to vertical effective field using a surface roughness inverse square law.",
  id: "semiconductor/surface-roughness-mobility",
  inputs: [
    {
      description: "Vertical effective field.",
      format: "electric-field",
      id: "effectiveFieldVCm",
      kind: "number",
      label: "Effective field",
      unit: "V/cm",
    },
    {
      description: "Reference field at which the reference mobility holds.",
      format: "electric-field",
      id: "referenceFieldVCm",
      kind: "number",
      label: "Reference field",
      unit: "V/cm",
    },
    {
      description: "Mobility at the reference field.",
      format: "mobility",
      id: "referenceMobility",
      kind: "number",
      label: "Reference mobility",
      unit: "cm^2/Vs",
    },
  ],
  outputs: [
    {
      description: "Surface-roughness-limited mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Mobility",
      unit: "cm^2/Vs",
    },
  ],
  title: "Surface Roughness Mobility Calculator",
});
export const runSurfaceRoughnessMobility = surfaceRoughnessMobilityTool.execute;
export default surfaceRoughnessMobilityTool;
