import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermoelectricPowerFactorInput = Readonly<{
  readonly seebeckVoltsPerKelvin: number;
  readonly electricalSiemensPerMeter: number;
}>;
export type ThermoelectricPowerFactorOutput = Readonly<{
  readonly wattsPerMeterKelvinSquared: number;
}>;

export const calculateThermoelectricPowerFactor = (
  x: ThermoelectricPowerFactorInput,
): ThermoelectricPowerFactorOutput => {
  if (!Number.isFinite(x.seebeckVoltsPerKelvin))
    simpleError("seebeckVoltsPerKelvin", "Provide a finite number.");
  if (
    !Number.isFinite(x.electricalSiemensPerMeter) ||
    x.electricalSiemensPerMeter < 0
  )
    simpleError(
      "electricalSiemensPerMeter",
      "Provide a finite number at least 0.",
    );
  const wattsPerMeterKelvinSquared =
    x.seebeckVoltsPerKelvin ** 2 * x.electricalSiemensPerMeter;
  if (!Number.isFinite(wattsPerMeterKelvinSquared))
    simpleError(
      "wattsPerMeterKelvinSquared",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wattsPerMeterKelvinSquared: Object.is(wattsPerMeterKelvinSquared, -0)
      ? 0
      : wattsPerMeterKelvinSquared,
  };
};

export const example = {
  input: { seebeckVoltsPerKelvin: 0.0002, electricalSiemensPerMeter: 100000 },
  output: { wattsPerMeterKelvinSquared: 0.004 },
} satisfies ToolExample<
  ThermoelectricPowerFactorInput,
  ThermoelectricPowerFactorOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/thermoelectric-power-factor",
  title: "Thermoelectric Power Factor",
  description:
    "Thermoelectric power factor S²σ from Seebeck coefficient and electrical conductivity in SI units.",
  inputs: [
    {
      id: "seebeckVoltsPerKelvin",
      kind: "number",
      label: "Seebeck Volts Per Kelvin",
      unit: "V/K",
    },
    {
      id: "electricalSiemensPerMeter",
      kind: "number",
      label: "Electrical Siemens Per Meter",
      unit: "S/m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wattsPerMeterKelvinSquared",
      kind: "number",
      label: "Watts Per Meter Kelvin Squared",
      unit: "W/(m·K²)",
    },
  ],
  calculate: (input) =>
    calculateThermoelectricPowerFactor({
      seebeckVoltsPerKelvin: input.seebeckVoltsPerKelvin as number,
      electricalSiemensPerMeter: input.electricalSiemensPerMeter as number,
    }),
});
export const thermoelectricPowerFactorTool = tool;
export const runThermoelectricPowerFactor = tool.execute;
export default tool;
