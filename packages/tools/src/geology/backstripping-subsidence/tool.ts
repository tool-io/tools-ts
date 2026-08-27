import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BackstrippingSubsidenceInput = {
  readonly decompactedThicknessM: number;
  readonly sedimentDensityKgPerM3: number;
  readonly paleowaterDepthM: number;
  readonly seaLevelChangeM?: number;
  readonly mantleDensityKgPerM3?: number;
  readonly waterDensityKgPerM3?: number;
};

export type BackstrippingSubsidenceOutput = {
  readonly backstrippedSubsidenceM: number;
};

export const calculateBackstrippingSubsidence = (
  input: BackstrippingSubsidenceInput,
): BackstrippingSubsidenceOutput => {
  const thickness = input.decompactedThicknessM;
  const sedimentDensity = input.sedimentDensityKgPerM3;
  const paleowaterDepth = input.paleowaterDepthM;
  const seaLevelChange = input.seaLevelChangeM ?? 0;
  const mantleDensity = input.mantleDensityKgPerM3 ?? 3330;
  const waterDensity = input.waterDensityKgPerM3 ?? 1000;
  if (!(thickness >= 0))
    simpleError(
      "decompactedThicknessM",
      "Decompacted sediment thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(sedimentDensity > 0 && sedimentDensity < mantleDensity))
    simpleError(
      "sedimentDensityKgPerM3",
      "Sediment density must be positive and less than mantle density.",
      "invalid_density",
    );
  if (!(mantleDensity > waterDensity))
    simpleError(
      "mantleDensityKgPerM3",
      "Mantle density must exceed water density.",
      "invalid_density",
    );
  return {
    backstrippedSubsidenceM:
      (thickness * (mantleDensity - sedimentDensity)) /
        (mantleDensity - waterDensity) -
      paleowaterDepth +
      (seaLevelChange * waterDensity) / (mantleDensity - waterDensity),
  };
};

export const backstrippingSubsidenceExample = {
  input: {
    decompactedThicknessM: 1000,
    sedimentDensityKgPerM3: 2500,
    paleowaterDepthM: 150,
    seaLevelChangeM: 50,
    mantleDensityKgPerM3: 3330,
    waterDensityKgPerM3: 1000,
  },
  output: { backstrippedSubsidenceM: 227.6824034334764 },
} satisfies ToolExample<
  BackstrippingSubsidenceInput,
  BackstrippingSubsidenceOutput
>;

export const backstrippingSubsidenceTool = createSimpleTool({
  id: "geology/backstripping-subsidence",
  title: "Backstripping Subsidence Calculator",
  description:
    "Water-loaded backstripped tectonic subsidence (Steckler & Watts 1978) with a eustatic correction: Y = S(rho_m - rho_s)/(rho_m - rho_w) - Wd + dSL * rho_w/(rho_m - rho_w). Positive sea-level change means past sea level was higher than present.",
  inputs: [
    {
      description: "Backstripped-unit decompacted thickness in metres.",
      id: "decompactedThicknessM",
      kind: "number",
      label: "Decompacted thickness",
      unit: "m",
    },
    {
      description: "Mean sediment density in kilograms per cubic metre.",
      id: "sedimentDensityKgPerM3",
      kind: "number",
      label: "Sediment density",
      unit: "kg/m^3",
    },
    {
      description: "Paleo-water depth at deposition in metres (positive down).",
      id: "paleowaterDepthM",
      kind: "number",
      label: "Paleo-water depth",
      unit: "m",
    },
    {
      description:
        "Sea level at deposition relative to present in metres; default 0.",
      default: 0,
      id: "seaLevelChangeM",
      kind: "number",
      label: "Sea-level change",
      unit: "m",
    },
    {
      description:
        "Mantle (asthenosphere) density in kilograms per cubic metre; default 3330.",
      default: 3330,
      id: "mantleDensityKgPerM3",
      kind: "number",
      label: "Mantle density",
      unit: "kg/m^3",
    },
    {
      description:
        "Paleo-water density in kilograms per cubic metre; default 1000.",
      default: 1000,
      id: "waterDensityKgPerM3",
      kind: "number",
      label: "Water density",
      unit: "kg/m^3",
    },
  ],
  outputs: [
    {
      description: "Backstripped tectonic subsidence in metres.",
      id: "backstrippedSubsidenceM",
      kind: "number",
      label: "Tectonic subsidence",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateBackstrippingSubsidence(
      input as unknown as BackstrippingSubsidenceInput,
    ),
});

export const runBackstrippingSubsidence = backstrippingSubsidenceTool.execute;
export default backstrippingSubsidenceTool;
