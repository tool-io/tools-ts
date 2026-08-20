import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EffectiveDensityValenceBandInput = {
  readonly massRatioX?: number;
  readonly temperatureK?: number;
};

export type EffectiveDensityValenceBandOutput = {
  readonly nvPerCm3: number;
};

/** Effective density of states at 300 K for a unit effective mass, cm^-3. */
const NV_UNIT_MASS_300K = 1.51e19;

export const effectiveDensityValenceBandExample = {
  input: { massRatioX: 0.56, temperatureK: 300 },
  output: { nvPerCm3: 6327890972512091000 },
} satisfies ToolExample<
  EffectiveDensityValenceBandInput,
  EffectiveDensityValenceBandOutput
>;

export const calculateEffectiveDensityValenceBand = (
  input: EffectiveDensityValenceBandInput,
): EffectiveDensityValenceBandOutput => {
  const massRatio = input.massRatioX ?? 1;
  const temperatureK = input.temperatureK ?? 300;
  if (massRatio <= 0 || temperatureK <= 0)
    simpleError(
      "massRatioX",
      "Effective mass and temperature must be positive.",
      "invalid_input",
    );
  const nv =
    NV_UNIT_MASS_300K *
    massRatio ** 1.5 *
    (temperatureK / 300) ** 1.5;
  return { nvPerCm3: nv };
};

export const effectiveDensityValenceBandTool = createSimpleTool({
  calculate: (input) =>
    calculateEffectiveDensityValenceBand(
      input as unknown as EffectiveDensityValenceBandInput,
    ),
  description:
    "Compute the valence-band effective density of states from a density-of-states effective hole mass and temperature.",
  id: "semiconductor/effective-density-valence-band",
  inputs: [
    {
      description:
        "Density-of-states effective hole mass relative to the free-electron mass.",
      id: "massRatioX",
      kind: "number",
      label: "mh*/m0",
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
      description: "Valence-band effective density of states.",
      format: "density-per-cm3",
      id: "nvPerCm3",
      kind: "number",
      label: "Nv",
      unit: "cm^-3",
    },
  ],
  title: "Semiconductor Effective Density Valence Band Calculator",
});
export const runEffectiveDensityValenceBand =
  effectiveDensityValenceBandTool.execute;
export default effectiveDensityValenceBandTool;
