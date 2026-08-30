import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EnergyKwhInput = Readonly<{
  readonly powerWatts: number;
  readonly timeHours: number;
}>;
export type EnergyKwhOutput = Readonly<{
  readonly energyKilowattHours: number;
}>;

export const calculateEnergyKwh = (x: EnergyKwhInput): EnergyKwhOutput => {
  if (!Number.isFinite(x.powerWatts) || x.powerWatts < 0)
    simpleError("powerWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.timeHours) || x.timeHours < 0)
    simpleError("timeHours", "Provide a finite number at least 0.");
  const energyKilowattHours = (x.powerWatts * x.timeHours) / 1000;
  if (!Number.isFinite(energyKilowattHours))
    simpleError(
      "energyKilowattHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    energyKilowattHours: Object.is(energyKilowattHours, -0)
      ? 0
      : energyKilowattHours,
  };
};

export const example = {
  input: { powerWatts: 500, timeHours: 3 },
  output: { energyKilowattHours: 1.5 },
} satisfies ToolExample<EnergyKwhInput, EnergyKwhOutput>;

export const tool = createSimpleTool({
  id: "engineering/energy-kwh",
  title: "Energy kWh",
  description:
    "Energy consumed in kilowatt-hours from constant power and elapsed hours.",
  inputs: [
    {
      id: "powerWatts",
      kind: "number",
      label: "Power Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "timeHours",
      kind: "number",
      label: "Time Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "energyKilowattHours",
      kind: "number",
      label: "Energy Kilowatt Hours",
      unit: "kWh",
    },
  ],
  calculate: (input) =>
    calculateEnergyKwh({
      powerWatts: input.powerWatts as number,
      timeHours: input.timeHours as number,
    }),
});
export const energyKwhTool = tool;
export const runEnergyKwh = tool.execute;
export default tool;
