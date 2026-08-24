import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuantumCapacitanceInput = {
  readonly effectiveMassKg: number;
};

export type QuantumCapacitanceOutput = {
  readonly quantumCapacitanceFemtoFaradsPerUm2: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const REDUCED_PLANCK_J_S = 1.054571817e-34;

export const quantumCapacitanceExample = {
  input: { effectiveMassKg: 9.1093837015e-31 },
  output: { quantumCapacitanceFemtoFaradsPerUm2: 669.2796017039095 },
} satisfies ToolExample<QuantumCapacitanceInput, QuantumCapacitanceOutput>;

export const quantumCapacitanceTool = createSimpleTool({
  calculate: (input) => {
    const effectiveMassKg = input.effectiveMassKg as number;
    if (!(effectiveMassKg > 0))
      simpleError(
        "effectiveMassKg",
        "Effective mass must be positive.",
        "invalid_effective_mass",
      );
    const faradsPerM2 =
      (effectiveMassKg * ELEMENTARY_CHARGE_C * ELEMENTARY_CHARGE_C) /
      (Math.PI * REDUCED_PLANCK_J_S * REDUCED_PLANCK_J_S);
    return { quantumCapacitanceFemtoFaradsPerUm2: faradsPerM2 * 1e15 * 1e-12 };
  },
  description:
    "Compute the two-dimensional electron gas quantum capacitance per unit area from an effective mass.",
  id: "semiconductor/quantum-capacitance",
  inputs: [
    {
      description: "Carrier effective mass.",
      format: "mass",
      id: "effectiveMassKg",
      kind: "number",
      label: "Effective mass",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Quantum capacitance per unit area.",
      format: "capacitance-per-area",
      id: "quantumCapacitanceFemtoFaradsPerUm2",
      kind: "number",
      label: "Quantum capacitance",
      unit: "fF/um^2",
    },
  ],
  title: "Quantum Capacitance Calculator",
});
export const runQuantumCapacitance = quantumCapacitanceTool.execute;
export default quantumCapacitanceTool;
