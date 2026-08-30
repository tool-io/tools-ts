import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarEnergyYieldInput = Readonly<{
  readonly irradianceWattsPerSquareMeter: number;
  readonly areaSquareMeters: number;
  readonly systemEfficiency: number;
  readonly hours: number;
}>;
export type SolarEnergyYieldOutput = Readonly<{
  readonly electricKilowattHours: number;
}>;

export const calculateSolarEnergyYield = (
  x: SolarEnergyYieldInput,
): SolarEnergyYieldOutput => {
  if (
    !Number.isFinite(x.irradianceWattsPerSquareMeter) ||
    x.irradianceWattsPerSquareMeter < 0
  )
    simpleError(
      "irradianceWattsPerSquareMeter",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.systemEfficiency) || x.systemEfficiency < 0)
    simpleError("systemEfficiency", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hours) || x.hours < 0)
    simpleError("hours", "Provide a finite number at least 0.");
  if (x.systemEfficiency > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const electricKilowattHours =
    (x.irradianceWattsPerSquareMeter *
      x.areaSquareMeters *
      x.systemEfficiency *
      x.hours) /
    1000;
  if (!Number.isFinite(electricKilowattHours))
    simpleError(
      "electricKilowattHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    electricKilowattHours: Object.is(electricKilowattHours, -0)
      ? 0
      : electricKilowattHours,
  };
};

export const example = {
  input: {
    irradianceWattsPerSquareMeter: 1000,
    areaSquareMeters: 10,
    systemEfficiency: 0.2,
    hours: 5,
  },
  output: { electricKilowattHours: 10 },
} satisfies ToolExample<SolarEnergyYieldInput, SolarEnergyYieldOutput>;

export const tool = createSimpleTool({
  id: "engineering/solar-energy-yield",
  title: "Solar Energy Yield",
  description:
    "Expected photovoltaic energy in kWh from fixed irradiance, collector area, system efficiency and duration; excludes weather variation.",
  inputs: [
    {
      id: "irradianceWattsPerSquareMeter",
      kind: "number",
      label: "Irradiance Watts Per Square Meter",
      unit: "W/m²",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "systemEfficiency",
      kind: "number",
      label: "System Efficiency",
      minimum: 0,
    },
    { id: "hours", kind: "number", label: "Hours", unit: "h", minimum: 0 },
  ],
  outputs: [
    {
      id: "electricKilowattHours",
      kind: "number",
      label: "Electric Kilowatt Hours",
      unit: "kWh",
    },
  ],
  calculate: (input) =>
    calculateSolarEnergyYield({
      irradianceWattsPerSquareMeter:
        input.irradianceWattsPerSquareMeter as number,
      areaSquareMeters: input.areaSquareMeters as number,
      systemEfficiency: input.systemEfficiency as number,
      hours: input.hours as number,
    }),
});
export const solarEnergyYieldTool = tool;
export const runSolarEnergyYield = tool.execute;
export default tool;
