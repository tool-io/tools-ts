import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FermiLevelIntrinsicInput = {
  readonly bandgapEv: number;
  readonly ncPerCm3?: number;
  readonly nvPerCm3?: number;
  readonly temperatureK?: number;
};

export type FermiLevelIntrinsicOutput = {
  readonly fermiLevelEv: number;
};

export const fermiLevelIntrinsicExample = {
  input: {
    bandgapEv: 1.12,
    ncPerCm3: 2.8e19,
    nvPerCm3: 1.04e19,
    temperatureK: 300,
  },
  output: { fermiLevelEv: 0.5471981064577084 },
} satisfies ToolExample<FermiLevelIntrinsicInput, FermiLevelIntrinsicOutput>;

export const calculateFermiLevelIntrinsic = (
  input: FermiLevelIntrinsicInput,
): FermiLevelIntrinsicOutput => {
  if (!Number.isFinite(input.bandgapEv) || input.bandgapEv <= 0)
    simpleError(
      "bandgapEv",
      "The band gap must be positive.",
      "invalid_bandgap",
    );
  const nc = input.ncPerCm3 ?? 2.8e19;
  const nv = input.nvPerCm3 ?? 1.04e19;
  const temperatureK = input.temperatureK ?? 300;
  if (!Number.isFinite(nc) || nc <= 0)
    simpleError("ncPerCm3", "Nc must be finite and greater than zero.");
  if (!Number.isFinite(nv) || nv <= 0)
    simpleError("nvPerCm3", "Nv must be finite and greater than zero.");
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be finite and greater than zero.",
    );
  const fermiLevelEv =
    input.bandgapEv / 2 +
    (8.617333262e-5 * temperatureK * (Math.log(nv) - Math.log(nc))) / 2;
  if (!Number.isFinite(fermiLevelEv))
    simpleError("bandgapEv", "The intrinsic Fermi level is not representable.");
  return { fermiLevelEv };
};

export const fermiLevelIntrinsicTool = createSimpleTool({
  calculate: (input) =>
    calculateFermiLevelIntrinsic({
      bandgapEv: input.bandgapEv as number,
      ncPerCm3: input.ncPerCm3 as number,
      nvPerCm3: input.nvPerCm3 as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Compute the intrinsic Fermi level relative to the valence-band edge.",
  id: "semiconductor/fermi-level-intrinsic",
  inputs: [
    {
      description: "Band gap energy.",
      format: "energy-ev",
      id: "bandgapEv",
      kind: "number",
      label: "Band gap",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      default: 2.8e19,
      description: "Conduction-band effective density of states.",
      format: "density-per-cm3",
      id: "ncPerCm3",
      kind: "number",
      label: "Nc",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      default: 1.04e19,
      description: "Valence-band effective density of states.",
      format: "density-per-cm3",
      id: "nvPerCm3",
      kind: "number",
      label: "Nv",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      default: 300,
      description:
        "Absolute temperature used in the density-of-states correction.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Intrinsic Fermi level above the valence-band edge.",
      format: "energy-ev",
      id: "fermiLevelEv",
      kind: "number",
      label: "Ei",
      unit: "eV",
    },
  ],
  title: "Fermi Level Intrinsic Calculator",
});
export const runFermiLevelIntrinsic = fermiLevelIntrinsicTool.execute;
export default fermiLevelIntrinsicTool;
