import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermocoupleVoltageInput = {
  readonly sensitivityUvPerC?: number;
  readonly temperatureDeltaC: number;
};

export type ThermocoupleVoltageOutput = {
  readonly thermocoupleVoltageMv: number;
};

export const thermocoupleVoltageExample = {
  input: { temperatureDeltaC: 100 },
  output: { thermocoupleVoltageMv: 4.1 },
} satisfies ToolExample<ThermocoupleVoltageInput, ThermocoupleVoltageOutput>;

export const calculateThermocoupleVoltage = (
  input: ThermocoupleVoltageInput,
): ThermocoupleVoltageOutput => {
  if (!Number.isFinite(input.temperatureDeltaC))
    simpleError(
      "temperatureDeltaC",
      "Temperature difference must be finite.",
      "invalid_temperature",
    );
  const sensitivity = input.sensitivityUvPerC ?? 41;
  if (!(sensitivity > 0))
    simpleError(
      "sensitivityUvPerC",
      "Seebeck sensitivity must be positive.",
      "invalid_sensitivity",
    );
  return {
    thermocoupleVoltageMv: (sensitivity * input.temperatureDeltaC) / 1000,
  };
};

export const thermocoupleVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateThermocoupleVoltage(input as unknown as ThermocoupleVoltageInput),
  description:
    "Estimate the voltage produced by a Type K thermocouple from the temperature difference and Seebeck sensitivity.",
  id: "electronics/thermocouple-voltage",
  inputs: [
    {
      description:
        "Temperature difference between the hot and cold junctions; may be negative.",
      id: "temperatureDeltaC",
      kind: "number",
      label: "Temperature difference",
      unit: "°C",
    },
    {
      default: 41,
      description: "Seebeck coefficient of the thermocouple pair.",
      id: "sensitivityUvPerC",
      kind: "number",
      label: "Sensitivity",
      unit: "µV/°C",
    },
  ],
  outputs: [
    {
      description: "Signed thermocouple EMF.",
      format: "voltage",
      id: "thermocoupleVoltageMv",
      kind: "number",
      label: "Thermocouple voltage",
      unit: "mV",
    },
  ],
  title: "Type K Thermocouple",
});
export const runThermocoupleVoltage = thermocoupleVoltageTool.execute;
export default thermocoupleVoltageTool;
