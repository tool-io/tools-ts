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
const NV_UNIT_MASS_300K = 2.51e19;

export const effectiveDensityValenceBandExample = {
  input: { massRatioX: 0.56, temperatureK: 300 },
  output: { nvPerCm3: 10518547245698906000 },
} satisfies ToolExample<
  EffectiveDensityValenceBandInput,
  EffectiveDensityValenceBandOutput
>;

export const calculateEffectiveDensityValenceBand = (
  input: EffectiveDensityValenceBandInput,
): EffectiveDensityValenceBandOutput => {
  const massRatio = input.massRatioX ?? 1;
  const temperatureK = input.temperatureK ?? 300;

  if (!Number.isFinite(massRatio) || massRatio <= 0)
    simpleError(
      "massRatioX",
      "Effective mass ratio must be a finite positive number greater than 0.",
      "invalid_mass",
    );
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be a finite positive number greater than 0 K.",
      "invalid_temperature",
    );

  const logNv =
    Math.log(NV_UNIT_MASS_300K) +
    1.5 * (Math.log(massRatio) + Math.log(temperatureK) - Math.log(300));
  const directNv =
    NV_UNIT_MASS_300K * massRatio ** 1.5 * (temperatureK / 300) ** 1.5;
  const nvPerCm3 =
    Number.isFinite(directNv) && directNv > 0 ? directNv : Math.exp(logNv);
  if (!Number.isFinite(nvPerCm3) || nvPerCm3 <= 0)
    simpleError(
      "temperatureK",
      "Effective density Nv could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return { nvPerCm3: nvPerCm3 === 0 ? 0 : nvPerCm3 };
};

export const effectiveDensityValenceBandTool = createSimpleTool({
  calculate: (input) =>
    calculateEffectiveDensityValenceBand({
      massRatioX: (input.massRatioX as number | undefined) ?? undefined,
      temperatureK: (input.temperatureK as number | undefined) ?? undefined,
    }),
  description:
    "Compute the valence-band effective density of states from a density-of-states effective hole mass and temperature. Formula: Nv(T) = 2.51e19·(m*_dos/m0)^{3/2}·(T/300)^{3/2} cm⁻³, using the same unit-effective-mass prefactor as the conduction-band expression. Assumes a parabolic band and temperature-independent DOS effective mass.",
  id: "semiconductor/effective-density-valence-band",
  inputs: [
    {
      default: 1,
      description:
        "Density-of-states effective hole mass relative to the free-electron mass. Must be greater than 0.",
      id: "massRatioX",
      kind: "number",
      label: "mh*/m0",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 300,
      description: "Lattice temperature. Must be greater than 0 K.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description:
        "Valence-band effective density of states. Greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "nvPerCm3",
      kind: "number",
      label: "Nv",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  title: "Semiconductor Effective Density Valence Band Calculator",
});
export const runEffectiveDensityValenceBand =
  effectiveDensityValenceBandTool.execute;
export default effectiveDensityValenceBandTool;
