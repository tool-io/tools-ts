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

  const logNc =
    Math.log(NC_UNIT_MASS_300K) +
    1.5 * (Math.log(massRatio) + Math.log(temperatureK) - Math.log(300));
  const directNc =
    NC_UNIT_MASS_300K * massRatio ** 1.5 * (temperatureK / 300) ** 1.5;
  const ncPerCm3 =
    Number.isFinite(directNc) && directNc > 0 ? directNc : Math.exp(logNc);
  if (!Number.isFinite(ncPerCm3) || ncPerCm3 <= 0)
    simpleError(
      "temperatureK",
      "Effective density Nc could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return { ncPerCm3: ncPerCm3 === 0 ? 0 : ncPerCm3 };
};

export const effectiveDensityConductionBandTool = createSimpleTool({
  calculate: (input) =>
    calculateEffectiveDensityConductionBand({
      massRatioX: (input.massRatioX as number | undefined) ?? undefined,
      temperatureK: (input.temperatureK as number | undefined) ?? undefined,
    }),
  description:
    "Compute the conduction-band effective density of states from a density-of-states effective mass and temperature. Formula: Nc(T) = 2.51e19·(m*_dos/m0)^{3/2}·(T/300)^{3/2} [cm⁻³], where 2.51e19 cm⁻³ is the 300 K value for m*=m0, m*_dos>0 is the DOS effective mass ratio, T>0 K is lattice temperature (default 300 K). Inputs: m*_dos>0 (default 1), T>0 K (default 300 K). Output: Nc>0 cm⁻³. Assumes parabolic band, Boltzmann statistics, and isotropic effective mass.",
  id: "semiconductor/effective-density-conduction-band",
  inputs: [
    {
      default: 1,
      description:
        "Density-of-states effective mass relative to the free-electron mass. Must be greater than 0.",
      id: "massRatioX",
      kind: "number",
      label: "me*/m0",
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
        "Conduction-band effective density of states. Greater than 0 cm⁻³.",
      format: "density-per-cm3",
      id: "ncPerCm3",
      kind: "number",
      label: "Nc",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  title: "Semiconductor Effective Density Conduction Band Calculator",
});
export const runEffectiveDensityConductionBand =
  effectiveDensityConductionBandTool.execute;
export default effectiveDensityConductionBandTool;
