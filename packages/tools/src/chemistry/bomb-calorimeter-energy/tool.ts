import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const BombCalorimeterEnergyTool = createSimpleTool({
  id: "chemistry/bomb-calorimeter-energy",
  title: "Bomb Calorimeter Energy Calculator",
  description:
    "Compute heat of combustion from bomb calorimeter as q = C_cal * dT.",
  inputs: [
    {
      id: "calorimeterCapacityJK",
      label: "C_cal",
      kind: "number",
      minimum: 0,
      unit: "J/K",
    },
    { id: "deltaTK", label: "dT", kind: "number" },
  ],
  outputs: [
    {
      id: "combustionEnergyJ",
      label: "q combustion",
      kind: "number",
      unit: "J",
    },
  ],
  calculate: (input) => {
    if (!((input.calorimeterCapacityJK as number) > 0))
      simpleError(
        "calorimeterCapacityJK",
        "Calorimeter heat capacity must be greater than zero.",
        "invalid_capacity",
      );
    return {
      combustionEnergyJ:
        (input.calorimeterCapacityJK as number) * (input.deltaTK as number),
    };
  },
});
export default BombCalorimeterEnergyTool;
export const runBombCalorimeterEnergy = BombCalorimeterEnergyTool.execute;

export type BombCalorimeterEnergyInput = {
  readonly calorimeterCapacityJK: number;
  readonly deltaTK: number;
};

export type BombCalorimeterEnergyOutput = {
  readonly combustionEnergyJ: number;
};

export const bombCalorimeterEnergyExample = {
  input: {
    calorimeterCapacityJK: 1,
    deltaTK: 1,
  },
  output: {
    combustionEnergyJ: 1,
  },
} satisfies ToolExample<
  BombCalorimeterEnergyInput,
  BombCalorimeterEnergyOutput
>;
