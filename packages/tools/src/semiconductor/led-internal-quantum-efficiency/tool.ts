import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedInternalQuantumEfficiencyInput = {
  readonly nonRadiativeLifetimeNs: number;
  readonly radiativeLifetimeNs: number;
};

export type LedInternalQuantumEfficiencyOutput = {
  readonly internalQuantumEfficiencyPercent: number;
};

export const ledInternalQuantumEfficiencyExample = {
  input: {
    nonRadiativeLifetimeNs: 40,
    radiativeLifetimeNs: 10,
  },
  output: { internalQuantumEfficiencyPercent: 80 },
} satisfies ToolExample<
  LedInternalQuantumEfficiencyInput,
  LedInternalQuantumEfficiencyOutput
>;

export const ledInternalQuantumEfficiencyTool = createSimpleTool({
  id: "semiconductor/led-internal-quantum-efficiency",
  title: "LED Internal Quantum Efficiency Calculator",
  description:
    "Compute LED internal quantum efficiency from the radiative and non-radiative carrier lifetimes.",
  inputs: [
    {
      description: "Radiative recombination lifetime.",
      id: "radiativeLifetimeNs",
      kind: "number",
      label: "Radiative lifetime",
      minimum: Number.MIN_VALUE,
      unit: "ns",
    },
    {
      description: "Non-radiative recombination lifetime.",
      id: "nonRadiativeLifetimeNs",
      kind: "number",
      label: "Non-radiative lifetime",
      minimum: Number.MIN_VALUE,
      unit: "ns",
    },
  ],
  outputs: [
    {
      description: "Fraction of injected carriers that recombine radiatively.",
      format: "percent",
      id: "internalQuantumEfficiencyPercent",
      kind: "number",
      label: "Internal quantum efficiency",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) => {
    const radiative = input.radiativeLifetimeNs as number;
    const nonRadiative = input.nonRadiativeLifetimeNs as number;
    if (!(radiative > 0))
      simpleError(
        "radiativeLifetimeNs",
        "Radiative lifetime must be positive.",
        "invalid_radiative_lifetime",
      );
    if (!(nonRadiative > 0))
      simpleError(
        "nonRadiativeLifetimeNs",
        "Non-radiative lifetime must be positive.",
        "invalid_non_radiative_lifetime",
      );
    const lifetimeSum = radiative + nonRadiative;
    const ratio = radiative / nonRadiative;
    return {
      internalQuantumEfficiencyPercent: Number.isFinite(lifetimeSum)
        ? (100 * nonRadiative) / lifetimeSum
        : ratio <= 1
          ? 100 / (1 + ratio)
          : 100 / ratio / (1 + 1 / ratio),
    };
  },
});
export const runLedInternalQuantumEfficiency =
  ledInternalQuantumEfficiencyTool.execute;
export default ledInternalQuantumEfficiencyTool;
