import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PressureSensorVoltageOutputInput = Readonly<{
  readonly zeroPressureVoltageV: number;
  readonly sensitivityVoltsPerKpa: number;
  readonly pressureKpa: number;
}>;
export type PressureSensorVoltageOutputOutput = Readonly<{
  outputVoltageV: number;
}>;

export const calculatePressureSensorVoltageOutput = (
  i: PressureSensorVoltageOutputInput,
): PressureSensorVoltageOutputOutput => {
  const value =
    i.zeroPressureVoltageV + i.sensitivityVoltsPerKpa * i.pressureKpa;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    zeroPressureVoltageV: 0.5,
    sensitivityVoltsPerKpa: 0.01,
    pressureKpa: 100,
  },
  output: { outputVoltageV: 1.5 },
} satisfies ToolExample<
  PressureSensorVoltageOutputInput,
  PressureSensorVoltageOutputOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pressure-sensor-voltage-output",
  title: "Pressure Sensor Voltage Output",
  description:
    "Calculate a calibrated linear pressure sensor's output voltage from zero-pressure voltage, sensitivity per kilopascal, and applied pressure.",
  inputs: [
    {
      id: "zeroPressureVoltageV",
      kind: "number",
      label: "Zero Pressure (V)",
      unit: "V",
    },
    {
      id: "sensitivityVoltsPerKpa",
      kind: "number",
      label: "Sensitivity (V/kPa)",
      unit: "V/kPa",
    },
    {
      id: "pressureKpa",
      kind: "number",
      label: "Pressure (kPa)",
      unit: "kPa",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculatePressureSensorVoltageOutput({
      zeroPressureVoltageV: input.zeroPressureVoltageV as number,
      sensitivityVoltsPerKpa: input.sensitivityVoltsPerKpa as number,
      pressureKpa: input.pressureKpa as number,
    }),
});
export const pressureSensorVoltageOutputTool = tool;
export const runPressureSensorVoltageOutput = tool.execute;
export default tool;
