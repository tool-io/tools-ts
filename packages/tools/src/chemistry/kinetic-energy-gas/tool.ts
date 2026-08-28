import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const KineticEnergyGasTool = createSimpleTool({
  id: "chemistry/kinetic-energy-gas",
  title: "Kinetic Energy Gas Calculator",
  description: "Compute average kinetic energy per molecule KE = 3/2*kT.",
  inputs: [
    {
      id: "temperatureK",
      label: "Temperature",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  outputs: [{ id: "kineticEnergyJ", label: "KE", kind: "number", unit: "J" }],
  calculate: (input) => {
    const kB = 1.38065e-23;
    return { kineticEnergyJ: 1.5 * kB * (input.temperatureK as number) };
  },
});
export default KineticEnergyGasTool;
export const runKineticEnergyGas = KineticEnergyGasTool.execute;

export type KineticEnergyGasInput = {
  readonly temperatureK: number;
};

export type KineticEnergyGasOutput = {
  readonly kineticEnergyJ: number;
};

export const kineticEnergyGasExample = {
  input: {
    temperatureK: 1,
  },
  output: {
    kineticEnergyJ: 2.0709750000000002e-23,
  },
} satisfies ToolExample<KineticEnergyGasInput, KineticEnergyGasOutput>;
