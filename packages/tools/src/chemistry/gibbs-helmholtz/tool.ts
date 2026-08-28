import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const gibbsHelmholtzTool = createSimpleTool({
  id: "chemistry/gibbs-helmholtz",
  title: "Gibbs-Helmholtz Calculator",
  description: "Compute the Gibbs free energy change as ΔG = ΔH − T·ΔS.",
  inputs: [
    {
      description: "Reaction enthalpy change.",
      id: "enthalpyChangeKJPerMol",
      label: "ΔH",
      kind: "number",
      unit: "kJ/mol",
    },
    {
      description: "Reaction entropy change.",
      id: "entropyChangeJPerMolK",
      label: "ΔS",
      kind: "number",
      unit: "J/(mol·K)",
    },
    {
      description: "Absolute temperature; must be greater than zero.",
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Gibbs free energy change.",
      id: "gibbsFreeEnergyKJPerMol",
      label: "ΔG",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const temperature = input.temperatureK as number;
    if (temperature <= 0)
      simpleError(
        "temperatureK",
        "The temperature must be greater than zero kelvin.",
        "invalid_temperature",
      );
    return {
      gibbsFreeEnergyKJPerMol:
        (input.enthalpyChangeKJPerMol as number) -
        temperature * ((input.entropyChangeJPerMolK as number) / 1000),
    };
  },
});
export const runGibbsHelmholtz = gibbsHelmholtzTool.execute;
export default gibbsHelmholtzTool;

export type GibbsHelmholtzInput = {
  readonly enthalpyChangeKJPerMol: number;
  readonly entropyChangeJPerMolK: number;
  readonly temperatureK: number;
};

export type GibbsHelmholtzOutput = {
  readonly gibbsFreeEnergyKJPerMol: number;
};

export const gibbsHelmholtzExample = {
  input: {
    enthalpyChangeKJPerMol: 1,
    entropyChangeJPerMolK: 1,
    temperatureK: 1,
  },
  output: {
    gibbsFreeEnergyKJPerMol: 0.999,
  },
} satisfies ToolExample<GibbsHelmholtzInput, GibbsHelmholtzOutput>;
