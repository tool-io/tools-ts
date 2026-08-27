import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EnergyInBatteryInput = {
  readonly capacityAh: number;
  readonly nominalVoltageV: number;
};

export type EnergyInBatteryOutput = {
  readonly energyWh: number;
};

export const energyInBatteryExample = {
  input: {
    capacityAh: 2,
    nominalVoltageV: 3.7,
  },
  output: { energyWh: 7.4 },
} satisfies ToolExample<EnergyInBatteryInput, EnergyInBatteryOutput>;

export const calculateEnergyInBattery = (
  input: EnergyInBatteryInput,
): EnergyInBatteryOutput => {
  if (input.capacityAh < 0 || input.nominalVoltageV < 0)
    simpleError(
      "capacityAh",
      "Capacity and voltage cannot be negative.",
      "invalid_input",
    );
  return { energyWh: input.nominalVoltageV * input.capacityAh };
};

export const energyInBatteryTool = createSimpleTool({
  calculate: (input) =>
    calculateEnergyInBattery(input as unknown as EnergyInBatteryInput),
  description:
    "Convert a battery charge rating into stored energy, Wh = V * Ah, so packs of different voltages can be compared on equal footing.",
  id: "electronics/energy-in-battery",
  inputs: [
    {
      description: "Rated charge capacity of the battery.",
      id: "capacityAh",
      kind: "number",
      label: "Capacity",
      unit: "Ah",
      minimum: 0,
    },
    {
      description: "Nominal cell or pack voltage.",
      format: "voltage-v",
      id: "nominalVoltageV",
      kind: "number",
      label: "Nominal voltage",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Energy available from the full charge.",
      id: "energyWh",
      kind: "number",
      label: "Stored energy",
      unit: "Wh",
    },
  ],
  title: "Battery Stored Energy Calculator",
});
export const runEnergyInBattery = energyInBatteryTool.execute;
export default energyInBatteryTool;
