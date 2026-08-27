import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorEnergyInput = {
  readonly currentA: number;
  readonly inductanceH: number;
};

export type InductorEnergyOutput = {
  readonly energyJoules: number;
};

export const inductorEnergyExample = {
  input: {
    currentA: 2,
    inductanceH: 0.01,
  },
  output: { energyJoules: 0.02 },
} satisfies ToolExample<InductorEnergyInput, InductorEnergyOutput>;

export const calculateInductorEnergy = (
  input: InductorEnergyInput,
): InductorEnergyOutput => {
  if (input.inductanceH < 0 || input.currentA < 0)
    simpleError(
      "inductanceH",
      "Inductance and current cannot be negative.",
      "invalid_input",
    );
  return { energyJoules: 0.5 * input.inductanceH * input.currentA ** 2 };
};

export const inductorEnergyTool = createSimpleTool({
  calculate: (input) =>
    calculateInductorEnergy(input as unknown as InductorEnergyInput),
  description:
    "Compute the energy stored in an inductor carrying current, E = 0.5 * L * I^2.",
  id: "electronics/inductor-energy",
  inputs: [
    {
      description: "Current through the inductor.",
      format: "current-a",
      id: "currentA",
      kind: "number",
      label: "Current",
      unit: "A",
      minimum: 0,
    },
    {
      description: "Inductance of the coil.",
      id: "inductanceH",
      kind: "number",
      label: "Inductance",
      unit: "H",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Energy stored in the magnetic field.",
      format: "energy-j",
      id: "energyJoules",
      kind: "number",
      label: "Energy stored",
      unit: "J",
    },
  ],
  title: "Inductor Energy Calculator",
});
export const runInductorEnergy = inductorEnergyTool.execute;
export default inductorEnergyTool;
