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
  output: { niPerCm3: 6675898717.278493 },
} satisfies ToolExample<
  IntrinsicCarrierConcentrationInput,
  IntrinsicCarrierConcentrationOutput
>;

export const calculateIntrinsicCarrierConcentration = (
  input: IntrinsicCarrierConcentrationInput,
): IntrinsicCarrierConcentrationOutput => {
  const temperatureK = input.temperatureK ?? 300;
  if (temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be positive.",
      "invalid_temperature",
    );
  if (input.bandgapEv <= 0)
    simpleError(
      "bandgapEv",
      "The band gap must be positive.",
      "invalid_bandgap",
    );
  const nc = input.ncPerCm3 ?? 2.8e19;
  const nv = input.nvPerCm3 ?? 1.04e19;
  if (nc <= 0 || nv <= 0)
    simpleError(
      "ncPerCm3",
      "Effective densities of states must be positive.",
      "invalid_density",
    );
  const ni =
    Math.sqrt(nc * nv) *
    Math.exp(-input.bandgapEv / (2 * KB_EV_PER_K * temperatureK));
  return { niPerCm3: ni };
};

export const intrinsicCarrierConcentrationTool = createSimpleTool({
  calculate: (input) =>
    calculateIntrinsicCarrierConcentration(
      input as unknown as IntrinsicCarrierConcentrationInput,
    ),
  description:
    "Compute the intrinsic carrier concentration from the band gap and effective densities of states.",
  id: "semiconductor/intrinsic-carrier-concentration",
  inputs: [
    {
      description: "Band gap energy.",
      id: "bandgapEv",
      kind: "number",
      label: "Band gap",
      unit: "eV",
    },
    {
      default: 2.8e19,
      description: "Effective density of states in the conduction band.",
      format: "density-per-cm3",
      id: "ncPerCm3",
      kind: "number",
      label: "Nc",
      unit: "cm^-3",
    },
    {
      default: 1.04e19,
      description: "Effective density of states in the valence band.",
      format: "density-per-cm3",
      id: "nvPerCm3",
      kind: "number",
      label: "Nv",
      unit: "cm^-3",
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
      description: "Intrinsic carrier concentration.",
      format: "density-per-cm3",
      id: "niPerCm3",
      kind: "number",
      label: "ni",
      unit: "cm^-3",
    },
  ],
  title: "Intrinsic Carrier Concentration Calculator",
});
export const runIntrinsicCarrierConcentration =
  intrinsicCarrierConcentrationTool.execute;
export default intrinsicCarrierConcentrationTool;
