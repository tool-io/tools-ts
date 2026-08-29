import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GyroscopeVoltageOutputInput = Readonly<{
  readonly zeroRateVoltageV: number;
  readonly sensitivityVoltsPerDegreePerSecond: number;
  readonly angularRateDegreesPerSecond: number;
}>;
export type GyroscopeVoltageOutputOutput = Readonly<{ outputVoltageV: number }>;

export const calculateGyroscopeVoltageOutput = (
  i: GyroscopeVoltageOutputInput,
): GyroscopeVoltageOutputOutput => {
  const value =
    i.zeroRateVoltageV +
    i.sensitivityVoltsPerDegreePerSecond * i.angularRateDegreesPerSecond;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    zeroRateVoltageV: 1.65,
    sensitivityVoltsPerDegreePerSecond: 0.003,
    angularRateDegreesPerSecond: 90,
  },
  output: { outputVoltageV: 1.92 },
} satisfies ToolExample<
  GyroscopeVoltageOutputInput,
  GyroscopeVoltageOutputOutput
>;

export const tool = createSimpleTool({
  id: "electronics/gyroscope-voltage-output",
  title: "Gyroscope Voltage Output",
  description:
    "Calculate linear analog gyroscope voltage from zero-rate voltage, sensitivity in volts per degree per second, and signed angular rate.",
  inputs: [
    {
      id: "zeroRateVoltageV",
      kind: "number",
      label: "Zero Rate (V)",
      unit: "V",
    },
    {
      id: "sensitivityVoltsPerDegreePerSecond",
      kind: "number",
      label: "Sensitivity (V/(°/s))",
      unit: "V/(°/s)",
    },
    {
      id: "angularRateDegreesPerSecond",
      kind: "number",
      label: "Angular Rate Degrees Per Second",
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateGyroscopeVoltageOutput({
      zeroRateVoltageV: input.zeroRateVoltageV as number,
      sensitivityVoltsPerDegreePerSecond:
        input.sensitivityVoltsPerDegreePerSecond as number,
      angularRateDegreesPerSecond: input.angularRateDegreesPerSecond as number,
    }),
});
export const gyroscopeVoltageOutputTool = tool;
export const runGyroscopeVoltageOutput = tool.execute;
export default tool;
