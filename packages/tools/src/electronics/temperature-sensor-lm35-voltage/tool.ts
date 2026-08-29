import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TemperatureSensorLm35VoltageInput = Readonly<{
  readonly temperatureCelsius: number;
}>;
export type TemperatureSensorLm35VoltageOutput = Readonly<{
  outputVoltageV: number;
}>;

export const calculateTemperatureSensorLm35Voltage = (
  i: TemperatureSensorLm35VoltageInput,
): TemperatureSensorLm35VoltageOutput => {
  const value = i.temperatureCelsius * 0.01;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { temperatureCelsius: 37 },
  output: { outputVoltageV: 0.37 },
} satisfies ToolExample<
  TemperatureSensorLm35VoltageInput,
  TemperatureSensorLm35VoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/temperature-sensor-lm35-voltage",
  title: "Temperature Sensor LM35 Voltage",
  description:
    "Calculate nominal LM35 temperature-sensor voltage from Celsius temperature using the device's 10 mV/°C transfer factor; accuracy and supply constraints are separate.",
  inputs: [
    {
      id: "temperatureCelsius",
      kind: "number",
      label: "Temperature (°C)",
      unit: "°C",
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateTemperatureSensorLm35Voltage({
      temperatureCelsius: input.temperatureCelsius as number,
    }),
});
export const temperatureSensorLm35VoltageTool = tool;
export const runTemperatureSensorLm35Voltage = tool.execute;
export default tool;
