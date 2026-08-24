import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const WELL_CONSTANT_EV_NM2 = 0.3760301616440707;

export type QuantumWellEnergyLevelInput = {
  readonly effectiveMassRatio?: number;
  readonly levelN: number;
  readonly wellWidthNm: number;
};

export type QuantumWellEnergyLevelOutput = {
  readonly energyLevelEv: number;
};

export const quantumWellEnergyLevelExample = {
  input: { levelN: 2, wellWidthNm: 5 },
  output: { energyLevelEv: 0.060164825863051316 },
} satisfies ToolExample<
  QuantumWellEnergyLevelInput,
  QuantumWellEnergyLevelOutput
>;

export const calculateQuantumWellEnergyLevel = (
  input: QuantumWellEnergyLevelInput,
): QuantumWellEnergyLevelOutput => {
  const effectiveMassRatio = input.effectiveMassRatio ?? 1;
  if (!(effectiveMassRatio > 0))
    simpleError("effectiveMassRatio", "Effective mass ratio must be positive.");
  if (!Number.isSafeInteger(input.levelN) || input.levelN < 1)
    simpleError("levelN", "Level index must be a positive integer.");
  if (input.wellWidthNm <= 0)
    simpleError("wellWidthNm", "Well width must be positive.");
  const energyLevelEv =
    (WELL_CONSTANT_EV_NM2 * input.levelN * input.levelN) /
    (effectiveMassRatio * input.wellWidthNm * input.wellWidthNm);
  if (!Number.isFinite(energyLevelEv) || energyLevelEv <= 0)
    simpleError(
      "wellWidthNm",
      "The energy level is outside the numeric range.",
    );
  return {
    energyLevelEv,
  };
};

export const quantumWellEnergyLevelTool = createSimpleTool({
  calculate: (input) =>
    calculateQuantumWellEnergyLevel({
      effectiveMassRatio: input.effectiveMassRatio as number,
      levelN: input.levelN as number,
      wellWidthNm: input.wellWidthNm as number,
    }),
  description:
    "Compute a particle's confinement energy above the bottom of an infinite quantum well from its level index, well width, and effective mass.",
  id: "semiconductor/quantum-well-energy-level",
  inputs: [
    {
      default: 1,
      description: "Particle effective mass divided by the free-electron mass.",
      id: "effectiveMassRatio",
      kind: "number",
      label: "Effective mass ratio",
    },
    {
      description: "Quantum level index.",
      id: "levelN",
      kind: "integer",
      label: "Level n",
      minimum: 1,
      unit: "index",
    },
    {
      description: "Well width.",
      id: "wellWidthNm",
      kind: "number",
      label: "Well width",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Confinement energy above the bottom of the infinite well.",
      id: "energyLevelEv",
      kind: "number",
      label: "Energy level",
      unit: "eV",
    },
  ],
  title: "Quantum Well Energy Level Calculator",
});
export const runQuantumWellEnergyLevel = quantumWellEnergyLevelTool.execute;
export default quantumWellEnergyLevelTool;
