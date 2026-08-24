import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FermiLevelPTypeInput = {
  readonly acceptorConcentrationPerCm3: number;
  readonly niPerCm3: number;
  readonly temperatureK?: number;
};

export type FermiLevelPTypeOutput = {
  readonly fermiLevelOffsetEv: number;
};

export const fermiLevelPTypeExample = {
  input: {
    acceptorConcentrationPerCm3: 1e16,
    niPerCm3: 6.7e9,
    temperatureK: 300,
  },
  output: { fermiLevelOffsetEv: -0.36751172195393994 },
} satisfies ToolExample<FermiLevelPTypeInput, FermiLevelPTypeOutput>;

export const calculateFermiLevelPType = (
  input: FermiLevelPTypeInput,
): FermiLevelPTypeOutput => {
  const temperatureK = input.temperatureK ?? 300;
  if (
    !Number.isFinite(input.acceptorConcentrationPerCm3) ||
    input.acceptorConcentrationPerCm3 <= 0
  )
    simpleError(
      "acceptorConcentrationPerCm3",
      "Acceptor concentration must be finite and greater than zero.",
      "invalid_acceptor_concentration",
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
    -8.617333262e-5 *
    temperatureK *
    (Math.log(input.acceptorConcentrationPerCm3) - Math.log(input.niPerCm3));
  if (!Number.isFinite(fermiLevelOffsetEv))
    simpleError(
      "temperatureK",
      "The Fermi-level offset is outside the representable range.",
      "numeric_range",
    );
  return { fermiLevelOffsetEv };
};

export const fermiLevelPTypeTool = createSimpleTool({
  calculate: (input) =>
    calculateFermiLevelPType({
      acceptorConcentrationPerCm3: input.acceptorConcentrationPerCm3 as number,
      niPerCm3: input.niPerCm3 as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Compute the p-type Fermi level offset from the intrinsic level (EF − Ei) at a supplied temperature.",
  id: "semiconductor/fermi-level-p-type",
  inputs: [
    {
      description: "Acceptor concentration.",
      format: "density-per-cm3",
      id: "acceptorConcentrationPerCm3",
      kind: "number",
      label: "Acceptor doping",
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
  title: "Fermi Level P-Type Calculator",
});
export const runFermiLevelPType = fermiLevelPTypeTool.execute;
export default fermiLevelPTypeTool;
