import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FermiLevelNTypeInput = {
  readonly donorConcentrationPerCm3: number;
  readonly niPerCm3: number;
  readonly temperatureK?: number;
};

export type FermiLevelNTypeOutput = {
  readonly fermiLevelOffsetEv: number;
};

const KB_EV_PER_K = 8.617333262e-5;

export const fermiLevelNTypeExample = {
  input: {
    donorConcentrationPerCm3: 1e16,
    niPerCm3: 6.7e9,
    temperatureK: 300,
  },
  output: { fermiLevelOffsetEv: 0.36751172195393994 },
} satisfies ToolExample<FermiLevelNTypeInput, FermiLevelNTypeOutput>;

export const calculateFermiLevelNType = (
  input: FermiLevelNTypeInput,
): FermiLevelNTypeOutput => {
  const temperatureK = input.temperatureK ?? 300;
  if (
    !Number.isFinite(input.donorConcentrationPerCm3) ||
    input.donorConcentrationPerCm3 <= 0
  )
    simpleError(
      "donorConcentrationPerCm3",
      "Donor concentration must be finite and greater than zero.",
      "invalid_donor_concentration",
    );
  if (!Number.isFinite(input.niPerCm3) || input.niPerCm3 <= 0)
    simpleError(
      "niPerCm3",
      "Intrinsic concentration must be finite and greater than zero.",
      "invalid_intrinsic_concentration",
    );
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError("temperatureK", "Temperature must be greater than zero.");
  const fermiLevelOffsetEv =
    KB_EV_PER_K *
    temperatureK *
    (Math.log(input.donorConcentrationPerCm3) - Math.log(input.niPerCm3));
  if (!Number.isFinite(fermiLevelOffsetEv))
    simpleError(
      "temperatureK",
      "The Fermi-level offset is outside the representable range.",
      "numeric_range",
    );
  return { fermiLevelOffsetEv };
};

export const fermiLevelNTypeTool = createSimpleTool({
  calculate: (input) =>
    calculateFermiLevelNType({
      donorConcentrationPerCm3: input.donorConcentrationPerCm3 as number,
      niPerCm3: input.niPerCm3 as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Compute the n-type Fermi level offset from the intrinsic level (EF − Ei) at a supplied temperature.",
  id: "semiconductor/fermi-level-n-type",
  inputs: [
    {
      description: "Donor concentration.",
      format: "density-per-cm3",
      id: "donorConcentrationPerCm3",
      kind: "number",
      label: "Donor doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description: "Intrinsic carrier concentration.",
      format: "density-per-cm3",
      id: "niPerCm3",
      kind: "number",
      label: "ni",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      default: 300,
      description:
        "Absolute temperature for the nondegenerate Boltzmann relation.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Fermi level offset from Ei in electronvolts.",
      format: "energy-ev",
      id: "fermiLevelOffsetEv",
      kind: "number",
      label: "EF − Ei",
      unit: "eV",
    },
  ],
  title: "Fermi Level N-Type Calculator",
});
export const runFermiLevelNType = fermiLevelNTypeTool.execute;
export default fermiLevelNTypeTool;
