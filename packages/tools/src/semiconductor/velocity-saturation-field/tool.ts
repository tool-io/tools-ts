import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VelocitySaturationFieldInput = {
  readonly mobilityCm2PerVs: number;
  readonly saturationVelocityCmPerS: number;
};

export type VelocitySaturationFieldOutput = {
  readonly criticalFieldKVcm: number;
};

export const velocitySaturationFieldExample = {
  input: { mobilityCm2PerVs: 1400, saturationVelocityCmPerS: 1e7 },
  output: { criticalFieldKVcm: 7.142857142857143 },
} satisfies ToolExample<
  VelocitySaturationFieldInput,
  VelocitySaturationFieldOutput
>;

export const velocitySaturationFieldTool = createSimpleTool({
  calculate: (input) => {
    const saturationVelocityCmPerS = input.saturationVelocityCmPerS as number;
    const mobilityCm2PerVs = input.mobilityCm2PerVs as number;
    if (!(saturationVelocityCmPerS > 0))
      simpleError(
        "saturationVelocityCmPerS",
        "Saturation velocity must be positive.",
        "invalid_saturation_velocity",
      );
    if (!(mobilityCm2PerVs > 0))
      simpleError(
        "mobilityCm2PerVs",
        "Mobility must be positive.",
        "invalid_mobility",
      );
    return {
      criticalFieldKVcm: saturationVelocityCmPerS / mobilityCm2PerVs / 1000,
    };
  },
  description:
    "Derive the critical electric field where drift velocity saturates from the saturation velocity and low-field mobility.",
  id: "semiconductor/velocity-saturation-field",
  inputs: [
    {
      description: "Carrier saturation drift velocity.",
      format: "velocity",
      id: "saturationVelocityCmPerS",
      kind: "number",
      label: "Saturation velocity",
      unit: "cm/s",
    },
    {
      description: "Low-field carrier mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Mobility",
      unit: "cm^2/Vs",
    },
  ],
  outputs: [
    {
      description: "Critical field for velocity saturation.",
      format: "electric-field",
      id: "criticalFieldKVcm",
      kind: "number",
      label: "Critical field",
      unit: "kV/cm",
    },
  ],
  title: "Saturation Field Calculator",
});
export const runVelocitySaturationField = velocitySaturationFieldTool.execute;
export default velocitySaturationFieldTool;
