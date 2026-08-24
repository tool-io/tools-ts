import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PackagingThermalResistanceInput = {
  readonly ambientTemperatureC: number;
  readonly junctionTemperatureC: number;
  readonly powerWatts: number;
};

export type PackagingThermalResistanceOutput = {
  readonly thermalResistanceCPerW: number;
};

export const packagingThermalResistanceExample = {
  input: {
    ambientTemperatureC: 25,
    junctionTemperatureC: 85,
    powerWatts: 2,
  },
  output: { thermalResistanceCPerW: 30 },
} satisfies ToolExample<
  PackagingThermalResistanceInput,
  PackagingThermalResistanceOutput
>;

export const packagingThermalResistanceTool = createSimpleTool({
  calculate: (input) => {
    if (!((input.powerWatts as number) > 0))
      simpleError(
        "powerWatts",
        "Power dissipation must be positive.",
        "invalid_power",
      );
    const temperatureRiseC =
      (input.junctionTemperatureC as number) -
      (input.ambientTemperatureC as number);
    if (!(temperatureRiseC > 0))
      simpleError(
        "junctionTemperatureC",
        "Junction temperature must exceed ambient temperature.",
        "invalid_temperature_rise",
      );
    return {
      thermalResistanceCPerW: temperatureRiseC / (input.powerWatts as number),
    };
  },
  description:
    "Derive the junction-to-ambient thermal resistance from the steady-state temperature rise over dissipated power.",
  id: "semiconductor/packaging-thermal-resistance",
  inputs: [
    {
      id: "junctionTemperatureC",
      kind: "number",
      label: "Junction temperature",
      unit: "°C",
    },
    {
      id: "ambientTemperatureC",
      kind: "number",
      label: "Ambient temperature",
      unit: "°C",
    },
    {
      id: "powerWatts",
      kind: "number",
      label: "Power dissipation",
      minimum: Number.MIN_VALUE,
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Thermal resistance",
      minimum: Number.MIN_VALUE,
      unit: "°C/W",
    },
  ],
  title: "Package Thermal Resistance Calculator",
});
export const runPackagingThermalResistance =
  packagingThermalResistanceTool.execute;
export default packagingThermalResistanceTool;
