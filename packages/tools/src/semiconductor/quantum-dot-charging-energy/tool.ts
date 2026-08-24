import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const HALF_ELEMENTARY_CHARGE_COULOMB = 1.602176634e-19 / 2;

export type QuantumDotChargingEnergyInput = {
  readonly totalCapacitanceFarads: number;
};

export type QuantumDotChargingEnergyOutput = {
  readonly chargingEnergyEv: number;
};

export const quantumDotChargingEnergyExample = {
  input: { totalCapacitanceFarads: 1e-18 },
  output: { chargingEnergyEv: 0.0801088317 },
} satisfies ToolExample<
  QuantumDotChargingEnergyInput,
  QuantumDotChargingEnergyOutput
>;

export const calculateQuantumDotChargingEnergy = (
  input: QuantumDotChargingEnergyInput,
): QuantumDotChargingEnergyOutput => {
  if (
    !Number.isFinite(input.totalCapacitanceFarads) ||
    input.totalCapacitanceFarads <= 0
  )
    simpleError(
      "totalCapacitanceFarads",
      "Total capacitance must be positive.",
    );
  return {
    chargingEnergyEv:
      HALF_ELEMENTARY_CHARGE_COULOMB / input.totalCapacitanceFarads,
  };
};

export const quantumDotChargingEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateQuantumDotChargingEnergy({
      totalCapacitanceFarads: input.totalCapacitanceFarads as number,
    }),
  description:
    "Compute the single-electron charging energy of a quantum dot as e squared over twice its total capacitance.",
  id: "semiconductor/quantum-dot-charging-energy",
  inputs: [
    {
      description: "Total capacitance of the dot to its surroundings.",
      format: "capacitance-f",
      id: "totalCapacitanceFarads",
      kind: "number",
      label: "Total capacitance",
      minimum: Number.MIN_VALUE,
      unit: "F",
    },
  ],
  outputs: [
    {
      description: "Single-electron charging energy.",
      format: "energy-ev",
      id: "chargingEnergyEv",
      kind: "number",
      label: "Charging energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  title: "Quantum Dot Charging Energy Calculator",
});
export const runQuantumDotChargingEnergy = quantumDotChargingEnergyTool.execute;
export default quantumDotChargingEnergyTool;
