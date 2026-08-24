import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ImpurityScatteringMobilityInput = {
  readonly dopingPerCm3: number;
  readonly referenceDopingPerCm3?: number;
  readonly referenceMobility?: number;
  readonly temperatureK: number;
};

export type ImpurityScatteringMobilityOutput = {
  readonly mobilityCm2PerVs: number;
};

export const impurityScatteringMobilityExample = {
  input: { dopingPerCm3: 1e16, temperatureK: 300 },
  output: { mobilityCm2PerVs: 14000 },
} satisfies ToolExample<
  ImpurityScatteringMobilityInput,
  ImpurityScatteringMobilityOutput
>;

export const calculateImpurityScatteringMobility = (
  input: ImpurityScatteringMobilityInput,
): ImpurityScatteringMobilityOutput => {
  const referenceMobility = input.referenceMobility ?? 1400;
  const referenceDopingPerCm3 = input.referenceDopingPerCm3 ?? 1e17;
  for (const [field, value] of [
    ["temperatureK", input.temperatureK],
    ["dopingPerCm3", input.dopingPerCm3],
    ["referenceMobility", referenceMobility],
    ["referenceDopingPerCm3", referenceDopingPerCm3],
  ] as const)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(field, `${field} must be finite and positive.`);
  const mobilityCm2PerVs =
    referenceMobility *
    Math.pow(input.temperatureK / 300, 1.5) *
    (referenceDopingPerCm3 / input.dopingPerCm3);
  if (!Number.isFinite(mobilityCm2PerVs) || mobilityCm2PerVs <= 0)
    simpleError(
      "temperatureK",
      "The mobility is outside the representable range.",
      "numeric_range",
    );
  return { mobilityCm2PerVs };
};

export const impurityScatteringMobilityTool = createSimpleTool({
  calculate: (input) =>
    calculateImpurityScatteringMobility({
      dopingPerCm3: input.dopingPerCm3 as number,
      referenceDopingPerCm3: input.referenceDopingPerCm3 as number,
      referenceMobility: input.referenceMobility as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Scale a reference mobility to temperature and doping using ionized impurity scattering with a 1.5 power law.",
  id: "semiconductor/impurity-scattering-mobility",
  inputs: [
    {
      description: "Lattice temperature.",
      format: "temperature",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
    {
      description: "Ionized impurity doping concentration.",
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "Doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      default: 1400,
      description: "Reference mobility at 300 K and the reference doping.",
      format: "mobility",
      id: "referenceMobility",
      kind: "number",
      label: "Reference mobility",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/Vs",
    },
    {
      default: 1e17,
      description: "Reference doping concentration.",
      format: "density-per-cm3",
      id: "referenceDopingPerCm3",
      kind: "number",
      label: "Reference doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  outputs: [
    {
      description: "Impurity-scattering-limited mobility.",
      format: "mobility",
      id: "mobilityCm2PerVs",
      kind: "number",
      label: "Mobility",
      minimum: Number.MIN_VALUE,
      unit: "cm^2/Vs",
    },
  ],
  title: "Impurity Scattering Mobility Calculator",
});
export const runImpurityScatteringMobility =
  impurityScatteringMobilityTool.execute;
export default impurityScatteringMobilityTool;
