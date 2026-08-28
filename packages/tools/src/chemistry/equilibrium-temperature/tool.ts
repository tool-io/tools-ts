import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const equilibriumTemperatureTool = createSimpleTool({
  id: "chemistry/equilibrium-temperature",
  title: "Equilibrium Temperature Calculator",
  description: "Find crossover temperature where dG = 0: T = dH/dS.",
  inputs: [
    { id: "deltaHKJPerMol", label: "dH", kind: "number", unit: "kJ/mol" },
    { id: "deltaSJPerMolK", label: "dS", kind: "number", unit: "J/(mol*K)" },
  ],
  outputs: [
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
  ],
  calculate: (input) => {
    const deltaH = input.deltaHKJPerMol as number;
    const deltaS = input.deltaSJPerMolK as number;
    if (deltaS === 0)
      simpleError(
        "deltaSJPerMolK",
        "Entropy change must be nonzero.",
        "invalid_entropy_change",
      );
    const temperatureK = (deltaH * 1000) / deltaS;
    if (!(temperatureK > 0))
      simpleError(
        "deltaSJPerMolK",
        "Enthalpy and entropy changes must give a positive crossover temperature.",
        "nonphysical_temperature",
      );
    return { temperatureK };
  },
});
export const runEquilibriumTemperature = equilibriumTemperatureTool.execute;
export default equilibriumTemperatureTool;

export type EquilibriumTemperatureInput = {
  readonly deltaHKJPerMol: number;
  readonly deltaSJPerMolK: number;
};

export type EquilibriumTemperatureOutput = {
  readonly temperatureK: number;
};

export const equilibriumTemperatureExample = {
  input: {
    deltaHKJPerMol: 1,
    deltaSJPerMolK: 1,
  },
  output: {
    temperatureK: 1000,
  },
} satisfies ToolExample<
  EquilibriumTemperatureInput,
  EquilibriumTemperatureOutput
>;
