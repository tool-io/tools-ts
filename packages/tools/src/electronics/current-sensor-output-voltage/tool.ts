import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentSensorOutputVoltageInput = Readonly<{
  readonly zeroCurrentVoltageV: number;
  readonly sensitivityVoltsPerAmpere: number;
  readonly currentAmperes: number;
}>;
export type CurrentSensorOutputVoltageOutput = Readonly<{
  outputVoltageV: number;
}>;

export const calculateCurrentSensorOutputVoltage = (
  i: CurrentSensorOutputVoltageInput,
): CurrentSensorOutputVoltageOutput => {
  const value =
    i.zeroCurrentVoltageV + i.sensitivityVoltsPerAmpere * i.currentAmperes;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    zeroCurrentVoltageV: 2.5,
    sensitivityVoltsPerAmpere: 0.066,
    currentAmperes: 10,
  },
  output: { outputVoltageV: 3.16 },
} satisfies ToolExample<
  CurrentSensorOutputVoltageInput,
  CurrentSensorOutputVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/current-sensor-output-voltage",
  title: "Current Sensor Output Voltage",
  description:
    "Calculate linear current-sensor output voltage from zero-current offset, volts-per-ampere sensitivity, and signed current.",
  inputs: [
    {
      id: "zeroCurrentVoltageV",
      kind: "number",
      label: "Zero Current (V)",
      unit: "V",
    },
    {
      id: "sensitivityVoltsPerAmpere",
      kind: "number",
      label: "Sensitivity (V/A)",
      unit: "V/A",
    },
    { id: "currentAmperes", kind: "number", label: "Current (A)", unit: "A" },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateCurrentSensorOutputVoltage({
      zeroCurrentVoltageV: input.zeroCurrentVoltageV as number,
      sensitivityVoltsPerAmpere: input.sensitivityVoltsPerAmpere as number,
      currentAmperes: input.currentAmperes as number,
    }),
});
export const currentSensorOutputVoltageTool = tool;
export const runCurrentSensorOutputVoltage = tool.execute;
export default tool;
