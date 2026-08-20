import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EffectiveDensityConductionBandInput = {
  readonly massRatioX?: number;
  readonly temperatureK?: number;
};

export type EffectiveDensityConductionBandOutput = {
  readonly ncPerCm3: number;
};

/** Effective density of states at 300 K for a unit effective mass, cm^-3. */
const NC_UNIT_MASS_300K = 2.51e19;

export const effectiveDensityConductionBandExample = {
  input: { massRatioX: 1.08, temperatureK: 300 },
  output: { ncPerCm3: 28171459974946275000 },
} satisfies ToolExample<
  EffectiveDensityConductionBandInput,
  EffectiveDensityConductionBandOutput
>;

export const calculateEffectiveDensityConductionBand = (
  input: EffectiveDensityConductionBandInput,
): EffectiveDensityConductionBandOutput => {
  const massRatio = input.massRatioX ?? 1;
  const temperatureK = input.temperatureK ?? 300;
  if (massRatio <= 0 || temperatureK <= 0)
    simpleError(
      "massRatioX",
      "Effective mass and temperature must be positive.",
      "invalid_input",
    );
  const nc =
    NC_UNIT_MASS_300K *
    massRatio ** 1.5 *
    (temperatureK / 300) ** 1.5;
  return { ncPerCm3: nc };
};

export const effectiveDensityConductionBandTool = createSimpleTool({
  calculate: (input) =>
    calculateEffectiveDensityConductionBand(
      input as unknown as EffectiveDensityConductionBandInput,
    ),
  description:
    "Compute the conduction-band effective density of states from a density-of-states effective mass and temperature.",
  id: "semiconductor/effective-density-conduction-band",
  inputs: [
    {
      description:
        "Density-of-states effective mass relative to the free-electron mass.",
      id: "massRatioX",
      kind: "number",
      label: "me*/m0",
      required: false,
    },
    {
      default: 300,
      description: "Lattice temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Conduction-band effective density of states.",
      format: "density-per-cm3",
      id: "ncPerCm3",
      kind: "number",
      label: "Nc",
      unit: "cm^-3",
    },
  ],
  title: "Semiconductor Effective Density Conduction Band Calculator",
});
export const runEffectiveDensityConductionBand =
  effectiveDensityConductionBandTool.execute;
export default effectiveDensityConductionBandTool;
