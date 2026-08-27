import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticSusceptibilityLookupInput = {
  readonly inducedMagnetizationAPerM: number;
  readonly fieldStrengthAPerM: number;
};

export type MagneticSusceptibilityLookupOutput = {
  readonly volumeSusceptibilitySi: number;
  readonly volumeSusceptibilityCgsEmu: number;
};

export const calculateMagneticSusceptibilityLookup = (
  input: MagneticSusceptibilityLookupInput,
): MagneticSusceptibilityLookupOutput => {
  if (!(input.inducedMagnetizationAPerM >= 0))
    return simpleError(
      "inducedMagnetizationAPerM",
      "Induced magnetization magnitude must be non-negative.",
      "invalid_magnetization",
    );
  if (!(input.fieldStrengthAPerM > 0))
    return simpleError(
      "fieldStrengthAPerM",
      "Field strength must be greater than zero.",
      "invalid_field",
    );
  const volumeSusceptibilitySi =
    input.inducedMagnetizationAPerM / input.fieldStrengthAPerM;
  return {
    volumeSusceptibilitySi,
    volumeSusceptibilityCgsEmu: volumeSusceptibilitySi / (4 * Math.PI),
  };
};

export const magneticSusceptibilityLookupExample = {
  input: { inducedMagnetizationAPerM: 0.002, fieldStrengthAPerM: 40 },
  output: {
    volumeSusceptibilitySi: 0.00005,
    volumeSusceptibilityCgsEmu: 0.0000039788735772973834,
  },
} satisfies ToolExample<
  MagneticSusceptibilityLookupInput,
  MagneticSusceptibilityLookupOutput
>;

export const magneticSusceptibilityLookupTool = createSimpleTool({
  id: "geology/magnetic-susceptibility-lookup",
  title: "Magnetic Susceptibility Lookup",
  description:
    "Determine the dimensionless volume magnetic susceptibility chi = M / H (SI) from an induced magnetization in amperes per meter and a magnetizing field strength in amperes per meter, and convert it to CGS electromagnetic units (chi_cgs = chi_SI / 4 pi). A negative value indicates diamagnetic behavior.",
  inputs: [
    {
      description: "Induced magnetization magnitude in amperes per meter.",
      id: "inducedMagnetizationAPerM",
      kind: "number",
      label: "M",
      minimum: 0,
    },
    {
      description: "Magnetizing field strength in amperes per meter.",
      id: "fieldStrengthAPerM",
      kind: "number",
      label: "H",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Volume magnetic susceptibility, dimensionless (SI).",
      id: "volumeSusceptibilitySi",
      kind: "number",
      label: "chi SI",
    },
    {
      description:
        "Volume magnetic susceptibility in CGS electromagnetic units.",
      id: "volumeSusceptibilityCgsEmu",
      kind: "number",
      label: "chi CGS",
    },
  ],
  calculate: (input) =>
    calculateMagneticSusceptibilityLookup(
      input as unknown as MagneticSusceptibilityLookupInput,
    ),
});

export const runMagneticSusceptibilityLookup =
  magneticSusceptibilityLookupTool.execute;
export default magneticSusceptibilityLookupTool;
