import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuantumWellThicknessFromEnergyInput = {
  readonly effectiveMassRatio?: number;
  readonly energyLevelEv: number;
  readonly levelN: number;
};

export type QuantumWellThicknessFromEnergyOutput = {
  readonly wellWidthNm: number;
};

export const quantumWellThicknessFromEnergyExample = {
  input: { energyLevelEv: 1, levelN: 1 },
  output: { wellWidthNm: 0.6132129822859842 },
} satisfies ToolExample<
  QuantumWellThicknessFromEnergyInput,
  QuantumWellThicknessFromEnergyOutput
>;

export const quantumWellThicknessFromEnergyTool = createSimpleTool({
  calculate: (input) => {
    const level = input.levelN as number;
    const energy = input.energyLevelEv as number;
    const effectiveMassRatio = input.effectiveMassRatio as number;
    if (!(energy > 0))
      simpleError(
        "energyLevelEv",
        "Energy level must be positive.",
        "invalid_energy",
      );
    if (!Number.isInteger(level) || level < 1)
      simpleError(
        "levelN",
        "Quantum number must be a positive integer.",
        "invalid_level",
      );
    if (!(effectiveMassRatio > 0))
      simpleError(
        "effectiveMassRatio",
        "Effective mass ratio must be positive.",
        "invalid_effective_mass",
      );
    const wellWidthNm =
      (Math.sqrt(0.3760301616440707) * level) /
      Math.sqrt(effectiveMassRatio) /
      Math.sqrt(energy);
    if (!Number.isFinite(wellWidthNm) || wellWidthNm <= 0)
      simpleError(
        "energyLevelEv",
        "The well width is outside the numeric range.",
        "invalid_result",
      );
    return {
      wellWidthNm,
    };
  },
  description:
    "Infer an infinite quantum well width from a confinement energy, level index, and particle effective mass.",
  id: "semiconductor/quantum-well-thickness-from-energy",
  inputs: [
    {
      default: 1,
      description: "Particle effective mass divided by the free-electron mass.",
      id: "effectiveMassRatio",
      kind: "number",
      label: "Effective mass ratio",
    },
    { id: "levelN", kind: "integer", label: "Quantum number" },
    {
      description: "Confinement energy above the bottom of the infinite well.",
      id: "energyLevelEv",
      kind: "number",
      label: "Energy level",
      unit: "eV",
    },
  ],
  outputs: [
    { id: "wellWidthNm", kind: "number", label: "Well width", unit: "nm" },
  ],
  title: "Quantum Well Thickness from Energy",
});
export const runQuantumWellThicknessFromEnergy =
  quantumWellThicknessFromEnergyTool.execute;
export default quantumWellThicknessFromEnergyTool;
