import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryEnergyDensityInput = Readonly<{
  readonly usableWattHours: number;
  readonly packMassKilograms: number;
}>;
export type BatteryEnergyDensityOutput = Readonly<{
  readonly wattHoursPerKilogram: number;
}>;

export const calculateBatteryEnergyDensity = (
  x: BatteryEnergyDensityInput,
): BatteryEnergyDensityOutput => {
  if (!Number.isFinite(x.usableWattHours) || x.usableWattHours < 0)
    simpleError("usableWattHours", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.packMassKilograms) || x.packMassKilograms < 0)
    simpleError("packMassKilograms", "Provide a finite number at least 0.");
  const wattHoursPerKilogram = x.usableWattHours / x.packMassKilograms;
  if (!Number.isFinite(wattHoursPerKilogram))
    simpleError(
      "wattHoursPerKilogram",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wattHoursPerKilogram: Object.is(wattHoursPerKilogram, -0)
      ? 0
      : wattHoursPerKilogram,
  };
};

export const example = {
  input: { usableWattHours: 500, packMassKilograms: 2 },
  output: { wattHoursPerKilogram: 250 },
} satisfies ToolExample<BatteryEnergyDensityInput, BatteryEnergyDensityOutput>;

export const tool = createSimpleTool({
  id: "engineering/battery-energy-density",
  title: "Battery Energy Density",
  description:
    "Gravimetric battery energy density from usable watt-hours divided by battery pack mass in kilograms.",
  inputs: [
    {
      id: "usableWattHours",
      kind: "number",
      label: "Usable Watt Hours",
      unit: "Wh",
      minimum: 0,
    },
    {
      id: "packMassKilograms",
      kind: "number",
      label: "Pack Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wattHoursPerKilogram",
      kind: "number",
      label: "Watt Hours Per Kilogram",
      unit: "Wh/kg",
    },
  ],
  calculate: (input) =>
    calculateBatteryEnergyDensity({
      usableWattHours: input.usableWattHours as number,
      packMassKilograms: input.packMassKilograms as number,
    }),
});
export const batteryEnergyDensityTool = tool;
export const runBatteryEnergyDensity = tool.execute;
export default tool;
