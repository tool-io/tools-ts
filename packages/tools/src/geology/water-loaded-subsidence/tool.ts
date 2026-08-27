import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterLoadedSubsidenceInput = {
  readonly decompactedThicknessM: number;
  readonly sedimentDensityKgPerM3: number;
  readonly paleowaterDepthM: number;
  readonly mantleDensityKgPerM3?: number;
  readonly waterDensityKgPerM3?: number;
};

export type WaterLoadedSubsidenceOutput = {
  readonly waterLoadedSubsidenceM: number;
};

export const calculateWaterLoadedSubsidence = (
  input: WaterLoadedSubsidenceInput,
): WaterLoadedSubsidenceOutput => {
  const thickness = input.decompactedThicknessM;
  const sedimentDensity = input.sedimentDensityKgPerM3;
  const paleowaterDepth = input.paleowaterDepthM;
  const mantleDensity = input.mantleDensityKgPerM3 ?? 3330;
  const waterDensity = input.waterDensityKgPerM3 ?? 1000;
  if (!(thickness >= 0))
    simpleError(
      "decompactedThicknessM",
      "Decompacted sediment thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(paleowaterDepth >= 0))
    simpleError(
      "paleowaterDepthM",
      "Paleo-water depth must be non-negative.",
      "invalid_depth",
    );
  if (!(waterDensity > 0))
    simpleError(
      "waterDensityKgPerM3",
      "Water density must be greater than zero.",
      "invalid_density",
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
    waterLoadedSubsidenceM:
      (thickness * (mantleDensity - sedimentDensity)) /
        (mantleDensity - waterDensity) -
      paleowaterDepth,
  };
};

export const waterLoadedSubsidenceExample = {
  input: {
    decompactedThicknessM: 1000,
    sedimentDensityKgPerM3: 2500,
    paleowaterDepthM: 200,
    mantleDensityKgPerM3: 3330,
    waterDensityKgPerM3: 1000,
  },
  output: { waterLoadedSubsidenceM: 156.22317596566523 },
} satisfies ToolExample<
  WaterLoadedSubsidenceInput,
  WaterLoadedSubsidenceOutput
>;

export const waterLoadedSubsidenceTool = createSimpleTool({
  id: "geology/water-loaded-subsidence",
  title: "Water Loaded Subsidence Calculator",
  description:
    "Water-loaded tectonic subsidence after removing the sediment load and replacing it with water: Y = S(rho_m - rho_s)/(rho_m - rho_w) - Wd.",
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
      description: "Water-loaded tectonic subsidence in metres.",
      id: "waterLoadedSubsidenceM",
      kind: "number",
      label: "Water-loaded subsidence",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateWaterLoadedSubsidence(
      input as unknown as WaterLoadedSubsidenceInput,
    ),
});

export const runWaterLoadedSubsidence = waterLoadedSubsidenceTool.execute;
export default waterLoadedSubsidenceTool;
