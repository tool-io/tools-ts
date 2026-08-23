import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntrinsicCarrierConcentrationInput = {
  readonly bandgapEv: number;
  readonly ncPerCm3?: number;
  readonly nvPerCm3?: number;
  readonly temperatureK?: number;
};

export type IntrinsicCarrierConcentrationOutput = {
  readonly niPerCm3: number;
};

/** Boltzmann constant in electronvolts per kelvin. */
const KB_EV_PER_K = 8.617333262e-5;

export const intrinsicCarrierConcentrationExample = {
  input: {
    bandgapEv: 1.12,
    ncPerCm3: 2.8e19,
    nvPerCm3: 1.04e19,
    temperatureK: 300,
  },
  output: { niPerCm3: 6675898717.278456 },
} satisfies ToolExample<
  IntrinsicCarrierConcentrationInput,
  IntrinsicCarrierConcentrationOutput
>;

export const calculateIntrinsicCarrierConcentration = (
  input: IntrinsicCarrierConcentrationInput,
): IntrinsicCarrierConcentrationOutput => {
  const temperatureK = input.temperatureK ?? 300;
  const bandgapEv = input.bandgapEv;
  const nc = input.ncPerCm3 ?? 2.8e19;
  const nv = input.nvPerCm3 ?? 1.04e19;

  if (!Number.isFinite(bandgapEv) || bandgapEv <= 0)
    simpleError(
      "bandgapEv",
      "Band gap must be a finite positive number.",
      "invalid_bandgap",
    );
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be a finite positive number.",
      "invalid_temperature",
    );
  if (!Number.isFinite(nc) || nc <= 0)
    simpleError(
      "ncPerCm3",
      "Effective density of states Nc must be a finite positive number.",
      "invalid_nc",
    );
  if (!Number.isFinite(nv) || nv <= 0)
    simpleError(
      "nvPerCm3",
      "Effective density of states Nv must be a finite positive number.",
      "invalid_nv",
    );

  const exponent = -bandgapEv / (2 * KB_EV_PER_K * temperatureK);
  if (!Number.isFinite(exponent))
    simpleError("temperatureK", "Exponent overflowed.", "numeric_overflow");
  // Work in logarithms so Nc*Nv cannot overflow before its square root is
  // taken. This also avoids underflowing the Boltzmann factor prematurely.
  const logNi = (Math.log(nc) + Math.log(nv)) / 2 + exponent;
  const niPerCm3 = Math.exp(logNi);
  if (!Number.isFinite(niPerCm3))
    simpleError(
      "temperatureK",
      "Intrinsic concentration overflowed.",
      "numeric_overflow",
    );
  // Underflow to 0 is allowed for large bandgap/low T
  return { niPerCm3: niPerCm3 === 0 ? 0 : niPerCm3 };
};

export const intrinsicCarrierConcentrationTool = createSimpleTool({
  calculate: (input) =>
    calculateIntrinsicCarrierConcentration({
      bandgapEv: input.bandgapEv as number,
      ncPerCm3: (input.ncPerCm3 as number | undefined) ?? undefined,
      nvPerCm3: (input.nvPerCm3 as number | undefined) ?? undefined,
      temperatureK: (input.temperatureK as number | undefined) ?? undefined,
    }),
  description:
    "Compute the intrinsic carrier concentration from the band gap and effective densities of states. Uses ni = sqrt(Nc·Nv)·exp(-Eg/(2·kB·T)).",
  id: "semiconductor/intrinsic-carrier-concentration",
  inputs: [
    {
      description: "Band gap energy. Must be greater than 0 eV.",
      id: "bandgapEv",
      kind: "number",
      label: "Band gap",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      default: 2.8e19,
      description:
        "Effective conduction-band density of states at the selected temperature. The default is a common 300 K silicon value and is not temperature-scaled automatically.",
      format: "density-per-cm3",
      id: "ncPerCm3",
      kind: "number",
      label: "Nc",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      default: 1.04e19,
      description:
        "Effective valence-band density of states at the selected temperature. The default is a common 300 K silicon value and is not temperature-scaled automatically.",
      format: "density-per-cm3",
      id: "nvPerCm3",
      kind: "number",
      label: "Nv",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
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
      description: "Intrinsic carrier concentration.",
      format: "density-per-cm3",
      id: "niPerCm3",
      kind: "number",
      label: "ni",
      minimum: 0,
      unit: "cm^-3",
    },
  ],
  title: "Intrinsic Carrier Concentration Calculator",
});
export const runIntrinsicCarrierConcentration =
  intrinsicCarrierConcentrationTool.execute;
export default intrinsicCarrierConcentrationTool;
