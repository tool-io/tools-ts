import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AirLoadedSubsidenceInput = {
  readonly decompactedThicknessM: number;
  readonly sedimentDensityKgPerM3: number;
  readonly paleowaterDepthM: number;
  readonly mantleDensityKgPerM3?: number;
};

export type AirLoadedSubsidenceOutput = {
  readonly airLoadedSubsidenceM: number;
};

export const calculateAirLoadedSubsidence = (
  input: AirLoadedSubsidenceInput,
): AirLoadedSubsidenceOutput => {
  const thickness = input.decompactedThicknessM;
  const sedimentDensity = input.sedimentDensityKgPerM3;
  const paleowaterDepth = input.paleowaterDepthM;
  const mantleDensity = input.mantleDensityKgPerM3 ?? 3330;
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
  return {
    airLoadedSubsidenceM:
      (thickness * (mantleDensity - sedimentDensity)) / mantleDensity -
      paleowaterDepth,
  };
};

export const airLoadedSubsidenceExample = {
  input: {
    decompactedThicknessM: 600,
    sedimentDensityKgPerM3: 2400,
    paleowaterDepthM: 80,
    mantleDensityKgPerM3: 3330,
  },
  output: { airLoadedSubsidenceM: 87.56756756756758 },
} satisfies ToolExample<AirLoadedSubsidenceInput, AirLoadedSubsidenceOutput>;

export const airLoadedSubsidenceTool = createSimpleTool({
  id: "geology/air-loaded-subsidence",
  title: "Air Loaded Subsidence Calculator",
  description:
    "Air-loaded tectonic subsidence with the water column replaced by air (zero load): Y = S(rho_m - rho_s)/rho_m - Wd.",
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
        "Mantle (asthenosphere) density in kilograms per cubic metre; default 3330.",
      default: 3330,
      id: "mantleDensityKgPerM3",
      kind: "number",
      label: "Mantle density",
      unit: "kg/m^3",
    },
  ],
  outputs: [
    {
      description: "Air-loaded tectonic subsidence in metres.",
      id: "airLoadedSubsidenceM",
      kind: "number",
      label: "Air-loaded subsidence",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateAirLoadedSubsidence(input as unknown as AirLoadedSubsidenceInput),
});

export const runAirLoadedSubsidence = airLoadedSubsidenceTool.execute;
export default airLoadedSubsidenceTool;
