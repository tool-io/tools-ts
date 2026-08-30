import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorCoreTemperatureRiseInput = Readonly<{
  readonly coreLossWatts: number;
  readonly thermalResistanceKelvinPerWatt: number;
}>;
export type InductorCoreTemperatureRiseOutput = Readonly<{
  readonly temperatureRiseKelvin: number;
}>;

export const calculateInductorCoreTemperatureRise = (
  x: InductorCoreTemperatureRiseInput,
): InductorCoreTemperatureRiseOutput => {
  if (!Number.isFinite(x.coreLossWatts) || x.coreLossWatts < 0)
    simpleError("coreLossWatts", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.thermalResistanceKelvinPerWatt) ||
    x.thermalResistanceKelvinPerWatt < 0
  )
    simpleError(
      "thermalResistanceKelvinPerWatt",
      "Provide a finite number at least 0.",
    );
  const temperatureRiseKelvin =
    x.coreLossWatts * x.thermalResistanceKelvinPerWatt;
  if (!Number.isFinite(temperatureRiseKelvin))
    simpleError(
      "temperatureRiseKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    temperatureRiseKelvin: Object.is(temperatureRiseKelvin, -0)
      ? 0
      : temperatureRiseKelvin,
  };
};

export const example = {
  input: { coreLossWatts: 2, thermalResistanceKelvinPerWatt: 15 },
  output: { temperatureRiseKelvin: 30 },
} satisfies ToolExample<
  InductorCoreTemperatureRiseInput,
  InductorCoreTemperatureRiseOutput
>;

export const tool = createSimpleTool({
  id: "electronics/inductor-core-temperature-rise",
  title: "Inductor Core Temperature Rise",
  description:
    "Estimate inductor core temperature rise from measured core loss and a specified core-to-ambient thermal resistance; does not include winding hot spots.",
  inputs: [
    {
      id: "coreLossWatts",
      kind: "number",
      label: "Core Loss Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "thermalResistanceKelvinPerWatt",
      kind: "number",
      label: "Thermal Resistance Kelvin Per Watt",
      unit: "K/W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "temperatureRiseKelvin",
      kind: "number",
      label: "Temperature Rise Kelvin",
      unit: "K",
    },
  ],
  calculate: (input) =>
    calculateInductorCoreTemperatureRise({
      coreLossWatts: input.coreLossWatts as number,
      thermalResistanceKelvinPerWatt:
        input.thermalResistanceKelvinPerWatt as number,
    }),
});
export const inductorCoreTemperatureRiseTool = tool;
export const runInductorCoreTemperatureRise = tool.execute;
export default tool;
