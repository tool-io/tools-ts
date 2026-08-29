import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AccelerometerVoltageOutputInput = Readonly<{
  readonly zeroGVoltageV: number;
  readonly sensitivityVoltsPerG: number;
  readonly accelerationG: number;
}>;
export type AccelerometerVoltageOutputOutput = Readonly<{
  outputVoltageV: number;
}>;

export const calculateAccelerometerVoltageOutput = (
  i: AccelerometerVoltageOutputInput,
): AccelerometerVoltageOutputOutput => {
  const value = i.zeroGVoltageV + i.sensitivityVoltsPerG * i.accelerationG;
  if (!Number.isFinite(value))
    simpleError("outputVoltageV", "The inputs produce a non-finite result.");
  return { outputVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { zeroGVoltageV: 1.65, sensitivityVoltsPerG: 0.3, accelerationG: 2 },
  output: { outputVoltageV: 2.25 },
} satisfies ToolExample<
  AccelerometerVoltageOutputInput,
  AccelerometerVoltageOutputOutput
>;

export const tool = createSimpleTool({
  id: "electronics/accelerometer-voltage-output",
  title: "Accelerometer Voltage Output",
  description:
    "Calculate linear analog accelerometer voltage from zero-g voltage, sensitivity in volts per g, and signed acceleration in g.",
  inputs: [
    { id: "zeroGVoltageV", kind: "number", label: "Zero G (V)", unit: "V" },
    {
      id: "sensitivityVoltsPerG",
      kind: "number",
      label: "Sensitivity (V/g)",
      unit: "V/g",
    },
    {
      id: "accelerationG",
      kind: "number",
      label: "Acceleration (g)",
      unit: "g",
    },
  ],
  outputs: [
    { id: "outputVoltageV", kind: "number", label: "Output (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateAccelerometerVoltageOutput({
      zeroGVoltageV: input.zeroGVoltageV as number,
      sensitivityVoltsPerG: input.sensitivityVoltsPerG as number,
      accelerationG: input.accelerationG as number,
    }),
});
export const accelerometerVoltageOutputTool = tool;
export const runAccelerometerVoltageOutput = tool.execute;
export default tool;
