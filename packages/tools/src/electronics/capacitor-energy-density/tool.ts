import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorEnergyDensityInput = {
  readonly capacitanceFarads: number;
  readonly voltageVolts: number;
  readonly volumeMl: number;
};

export type CapacitorEnergyDensityOutput = {
  readonly energyDensityMjPerCm3: number;
};

export const capacitorEnergyDensityExample = {
  input: { capacitanceFarads: 0.001, voltageVolts: 5, volumeMl: 2 },
  output: { energyDensityMjPerCm3: 6.25 },
} satisfies ToolExample<
  CapacitorEnergyDensityInput,
  CapacitorEnergyDensityOutput
>;

export const calculateCapacitorEnergyDensity = (
  input: CapacitorEnergyDensityInput,
): CapacitorEnergyDensityOutput => {
  if (!(input.capacitanceFarads > 0))
    simpleError(
      "capacitanceFarads",
      "Capacitance must be positive.",
      "invalid_capacitance",
    );
  if (!(input.voltageVolts > 0))
    simpleError("voltageVolts", "Voltage must be positive.", "invalid_voltage");
  if (!(input.volumeMl > 0))
    simpleError("volumeMl", "Volume must be positive.", "invalid_volume");
  return {
    energyDensityMjPerCm3:
      ((0.5 * input.capacitanceFarads * input.voltageVolts ** 2) /
        input.volumeMl) *
      1000,
  };
};

export const capacitorEnergyDensityTool = createSimpleTool({
  calculate: (input) =>
    calculateCapacitorEnergyDensity(
      input as unknown as CapacitorEnergyDensityInput,
    ),
  description:
    "Compute the electric energy density of a capacitor in millijoules per cubic centimeter from E = 0.5 * C * V^2 and a volume in milliliters, where one milliliter equals one cubic centimeter.",
  id: "electronics/capacitor-energy-density",
  inputs: [
    {
      description: "Capacitance in farads.",
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
    {
      description: "Charge voltage across the capacitor.",
      id: "voltageVolts",
      kind: "number",
      label: "Voltage",
      unit: "V",
    },
    {
      description: "Package volume in milliliters.",
      id: "volumeMl",
      kind: "number",
      label: "Volume",
      unit: "mL",
    },
  ],
  outputs: [
    {
      description: "Stored electric energy per unit volume.",
      id: "energyDensityMjPerCm3",
      kind: "number",
      label: "Energy density",
      unit: "mJ/cm³",
    },
  ],
  title: "Capacitor Energy Density",
});
export const runCapacitorEnergyDensity = capacitorEnergyDensityTool.execute;
export default capacitorEnergyDensityTool;
