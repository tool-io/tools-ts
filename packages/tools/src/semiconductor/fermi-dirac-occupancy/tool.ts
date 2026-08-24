import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FermiDiracOccupancyInput = {
  readonly energyEv: number;
  readonly fermiLevelEv: number;
  readonly temperatureK?: number;
};

export type FermiDiracOccupancyOutput = {
  readonly occupancy: number;
};

export const KB_EV_PER_K = 8.617333262e-5;

export const fermiDiracOccupancyExample = {
  input: { energyEv: 0, fermiLevelEv: 0.5, temperatureK: 300 },
  output: { occupancy: 0.9999999960155379 },
} satisfies ToolExample<FermiDiracOccupancyInput, FermiDiracOccupancyOutput>;

export const calculateFermiDiracOccupancy = (
  input: FermiDiracOccupancyInput,
): FermiDiracOccupancyOutput => {
  const temperatureK = input.temperatureK ?? 300;
  if (!Number.isFinite(input.energyEv))
    simpleError("energyEv", "State energy must be finite.", "invalid_energy");
  if (!Number.isFinite(input.fermiLevelEv))
    simpleError(
      "fermiLevelEv",
      "Fermi level must be finite.",
      "invalid_fermi_level",
    );
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be finite and greater than zero.",
      "invalid_temperature",
    );
  const exponent =
    (input.energyEv - input.fermiLevelEv) / (KB_EV_PER_K * temperatureK);
  if (exponent >= 0) {
    const expNegative = Math.exp(-exponent);
    return { occupancy: expNegative / (1 + expNegative) };
  }
  return { occupancy: 1 / (1 + Math.exp(exponent)) };
};

export const fermiDiracOccupancyTool = createSimpleTool({
  calculate: (input) =>
    calculateFermiDiracOccupancy({
      energyEv: input.energyEv as number,
      fermiLevelEv: input.fermiLevelEv as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Evaluate the Fermi–Dirac distribution for the probability that a state at energy E is occupied.",
  id: "semiconductor/fermi-dirac-occupancy",
  inputs: [
    {
      description:
        "State energy on the same reference scale as the Fermi level.",
      format: "energy-ev",
      id: "energyEv",
      kind: "number",
      label: "State energy",
      unit: "eV",
    },
    {
      description: "Fermi level energy.",
      format: "energy-ev",
      id: "fermiLevelEv",
      kind: "number",
      label: "Fermi level",
      unit: "eV",
    },
    {
      default: 300,
      description: "Lattice temperature.",
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
        "Occupation probability between zero and one; exactly one half at the Fermi level.",
      format: "probability",
      id: "occupancy",
      kind: "number",
      label: "Occupancy",
      maximum: 1,
      minimum: 0,
    },
  ],
  title: "Fermi-Dirac Occupancy Calculator",
});
export const runFermiDiracOccupancy = fermiDiracOccupancyTool.execute;
export default fermiDiracOccupancyTool;
