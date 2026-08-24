import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SelfHeatingTemperatureRiseInput = {
  readonly dissipatedPowerWatts: number;
  readonly thermalResistanceCPerW: number;
};

export type SelfHeatingTemperatureRiseOutput = {
  readonly temperatureRiseCelsius: number;
};

export const selfHeatingTemperatureRiseExample = {
  input: { dissipatedPowerWatts: 0.5, thermalResistanceCPerW: 40 },
  output: { temperatureRiseCelsius: 20 },
} satisfies ToolExample<
  SelfHeatingTemperatureRiseInput,
  SelfHeatingTemperatureRiseOutput
>;

export const selfHeatingTemperatureRiseTool = createSimpleTool({
  id: "semiconductor/self-heating-temperature-rise",
  title: "Self-Heating Temperature Rise Calculator",
  description:
    "Compute on-die self-heating temperature rise from dissipated power and thermal resistance.",
  inputs: [
    {
      id: "dissipatedPowerWatts",
      kind: "number",
      label: "Dissipated power",
      minimum: 0,
      unit: "W",
    },
    {
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Thermal resistance",
      minimum: 0,
      unit: "°C/W",
    },
  ],
  outputs: [
    {
      id: "temperatureRiseCelsius",
      kind: "number",
      label: "Temperature rise",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const thermalResistanceCPerW = input.thermalResistanceCPerW as number;
    if (!(thermalResistanceCPerW > 0))
      simpleError(
        "thermalResistanceCPerW",
        "Thermal resistance must be greater than zero.",
      );
    const temperatureRiseCelsius =
      (input.dissipatedPowerWatts as number) * thermalResistanceCPerW;
    if (!Number.isFinite(temperatureRiseCelsius))
      simpleError(
        "dissipatedPowerWatts",
        "Temperature rise is outside the numeric range.",
        "invalid_result",
      );
    return {
      temperatureRiseCelsius,
    };
  },
});
export const runSelfHeatingTemperatureRise =
  selfHeatingTemperatureRiseTool.execute;
export default selfHeatingTemperatureRiseTool;
