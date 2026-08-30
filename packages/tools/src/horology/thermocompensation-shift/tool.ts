import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermocompensationShiftInput = Readonly<{
  readonly coefficientPpmPerCelsius: number;
  readonly temperatureChangeCelsius: number;
}>;
export type ThermocompensationShiftOutput = Readonly<{
  readonly frequencyShiftPpm: number;
}>;

export const calculateThermocompensationShift = (
  x: ThermocompensationShiftInput,
): ThermocompensationShiftOutput => {
  if (!Number.isFinite(x.coefficientPpmPerCelsius))
    simpleError("coefficientPpmPerCelsius", "Provide a finite number.");
  if (!Number.isFinite(x.temperatureChangeCelsius))
    simpleError("temperatureChangeCelsius", "Provide a finite number.");
  const frequencyShiftPpm =
    x.coefficientPpmPerCelsius * x.temperatureChangeCelsius;
  if (!Number.isFinite(frequencyShiftPpm))
    simpleError(
      "frequencyShiftPpm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    frequencyShiftPpm: Object.is(frequencyShiftPpm, -0) ? 0 : frequencyShiftPpm,
  };
};

export const example = {
  input: {
    coefficientPpmPerCelsius: 0.1,
    temperatureChangeCelsius: 10,
  },
  output: { frequencyShiftPpm: 1 },
} satisfies ToolExample<
  ThermocompensationShiftInput,
  ThermocompensationShiftOutput
>;

export const tool = createSimpleTool({
  id: "horology/thermocompensation-shift",
  title: "Thermocompensation Shift",
  description:
    "First-order oscillator frequency shift in ppm from a specified ppm-per-degree coefficient and temperature change.",
  inputs: [
    {
      id: "coefficientPpmPerCelsius",
      kind: "number",
      label: "Coefficient Ppm Per Celsius",
      unit: "ppm/C",
    },
    {
      id: "temperatureChangeCelsius",
      kind: "number",
      label: "Temperature Change Celsius",
      unit: "C",
    },
  ],
  outputs: [
    {
      id: "frequencyShiftPpm",
      kind: "number",
      label: "Frequency Shift Ppm",
      unit: "ppm",
    },
  ],
  calculate: (input) =>
    calculateThermocompensationShift({
      coefficientPpmPerCelsius: input.coefficientPpmPerCelsius as number,
      temperatureChangeCelsius: input.temperatureChangeCelsius as number,
    }),
});
export const thermocompensationShiftTool = tool;
export const runThermocompensationShift = tool.execute;
export default tool;
