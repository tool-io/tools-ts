import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorEnergyInput = {
  readonly capacitanceFarads: number;
  readonly voltageV: number;
};

export type CapacitorEnergyOutput = {
  readonly energyJoules: number;
};

export const capacitorEnergyExample = {
  input: {
    capacitanceFarads: 1e-4,
    voltageV: 5,
  },
  output: { energyJoules: 0.00125 },
} satisfies ToolExample<CapacitorEnergyInput, CapacitorEnergyOutput>;

export const calculateCapacitorEnergy = (
  input: CapacitorEnergyInput,
): CapacitorEnergyOutput => {
  if (input.capacitanceFarads < 0 || input.voltageV < 0)
    simpleError(
      "capacitanceFarads",
      "Capacitance and voltage cannot be negative.",
      "invalid_input",
    );
  return {
    energyJoules: 0.5 * input.capacitanceFarads * input.voltageV ** 2,
  };
};

export const capacitorEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitorEnergy(input as unknown as CapacitorEnergyInput),
  description:
    "Compute the energy stored in a charged capacitor, E = 0.5 * C * V^2; doubling the charge voltage quadruples the stored energy.",
  id: "electronics/capacitor-energy",
  inputs: [
    {
      description: "Capacitance of the component.",
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance",
      unit: "F",
      minimum: 0,
    },
    {
      description: "Voltage across the capacitor.",
      format: "voltage-v",
      id: "voltageV",
      kind: "number",
      label: "Voltage",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Energy stored in the electric field.",
      format: "energy-j",
      id: "energyJoules",
      kind: "number",
      label: "Energy stored",
      unit: "J",
    },
  ],
  title: "Capacitor Energy Calculator",
});
export const runCapacitorEnergy = capacitorEnergyTool.execute;
export default capacitorEnergyTool;
