import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermoelectricSeebeckCoefficientInput = Readonly<{
  readonly voltageChangeVolts: number;
  readonly temperatureChangeKelvin: number;
}>;
export type ThermoelectricSeebeckCoefficientOutput = Readonly<{
  readonly seebeckVoltsPerKelvin: number;
}>;

export const calculateThermoelectricSeebeckCoefficient = (
  x: ThermoelectricSeebeckCoefficientInput,
): ThermoelectricSeebeckCoefficientOutput => {
  if (!Number.isFinite(x.voltageChangeVolts))
    simpleError("voltageChangeVolts", "Provide a finite number.");
  if (!Number.isFinite(x.temperatureChangeKelvin))
    simpleError("temperatureChangeKelvin", "Provide a finite number.");
  const seebeckVoltsPerKelvin =
    -x.voltageChangeVolts / x.temperatureChangeKelvin;
  if (!Number.isFinite(seebeckVoltsPerKelvin))
    simpleError(
      "seebeckVoltsPerKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    seebeckVoltsPerKelvin: Object.is(seebeckVoltsPerKelvin, -0)
      ? 0
      : seebeckVoltsPerKelvin,
  };
};

export const example = {
  input: { voltageChangeVolts: -0.002, temperatureChangeKelvin: 10 },
  output: { seebeckVoltsPerKelvin: 0.0002 },
} satisfies ToolExample<
  ThermoelectricSeebeckCoefficientInput,
  ThermoelectricSeebeckCoefficientOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/thermoelectric-seebeck-coefficient",
  title: "Thermoelectric Seebeck Coefficient",
  description:
    "Seebeck coefficient from open-circuit voltage change and temperature difference using S=−ΔV/ΔT for the selected polarity convention.",
  inputs: [
    {
      id: "voltageChangeVolts",
      kind: "number",
      label: "Voltage Change Volts",
      unit: "V",
    },
    {
      id: "temperatureChangeKelvin",
      kind: "number",
      label: "Temperature Change Kelvin",
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "seebeckVoltsPerKelvin",
      kind: "number",
      label: "Seebeck Volts Per Kelvin",
      unit: "V/K",
    },
  ],
  calculate: (input) =>
    calculateThermoelectricSeebeckCoefficient({
      voltageChangeVolts: input.voltageChangeVolts as number,
      temperatureChangeKelvin: input.temperatureChangeKelvin as number,
    }),
});
export const thermoelectricSeebeckCoefficientTool = tool;
export const runThermoelectricSeebeckCoefficient = tool.execute;
export default tool;
