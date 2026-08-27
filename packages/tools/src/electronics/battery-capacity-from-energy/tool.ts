import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const batteryCapacityFromEnergyExample = {
  input: { energyWh: 48, nominalVolts: 12 },
  output: { capacityAh: 4 },
} satisfies ToolExample<
  { readonly energyWh: number; readonly nominalVolts: number },
  { readonly capacityAh: number }
>;

export const batteryCapacityFromEnergyTool = createSimpleTool({
  calculate: (input) => {
    const energyWh = input.energyWh as number;
    const nominalVolts = input.nominalVolts as number;
    if (!(energyWh > 0))
      simpleError("energyWh", "Energy must be positive.", "invalid_energy");
    if (!(nominalVolts > 0))
      simpleError(
        "nominalVolts",
        "Nominal voltage must be positive.",
        "invalid_voltage",
      );
    return { capacityAh: energyWh / nominalVolts };
  },
  description:
    "Convert stored energy in watt-hours to amp-hour capacity at a nominal pack voltage.",
  id: "electronics/battery-capacity-from-energy",
  inputs: [
    { id: "energyWh", kind: "number", label: "Stored energy", unit: "Wh" },
    { id: "nominalVolts", kind: "number", label: "Nominal voltage", unit: "V" },
  ],
  outputs: [
    { id: "capacityAh", kind: "number", label: "Capacity", unit: "Ah" },
  ],
  title: "Capacity From Energy",
});
export const runBatteryCapacityFromEnergy =
  batteryCapacityFromEnergyTool.execute;
export default batteryCapacityFromEnergyTool;
