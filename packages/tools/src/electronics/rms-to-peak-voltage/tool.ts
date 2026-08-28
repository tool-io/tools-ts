import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RmsToPeakVoltageInput = {
  readonly rmsVoltageV: number;
};

export type RmsToPeakVoltageOutput = {
  readonly peakVoltageV: number;
};

export const rmsToPeakVoltageExample = {
  input: { rmsVoltageV: 230 },
  output: { peakVoltageV: 325.2691193458119 },
} satisfies ToolExample<RmsToPeakVoltageInput, RmsToPeakVoltageOutput>;

export const calculateRmsToPeakVoltage = (
  input: RmsToPeakVoltageInput,
): RmsToPeakVoltageOutput => {
  if (input.rmsVoltageV < 0)
    simpleError(
      "rmsVoltageV",
      "The RMS voltage cannot be negative.",
      "invalid_input",
    );
  return { peakVoltageV: input.rmsVoltageV * Math.SQRT2 };
};

export const rmsToPeakVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateRmsToPeakVoltage(input as unknown as RmsToPeakVoltageInput),
  description:
    "Convert a sinusoidal RMS voltage to its peak amplitude, Vp = Vrms * sqrt(2), for example to size insulation from a mains RMS rating.",
  id: "electronics/rms-to-peak-voltage",
  inputs: [
    {
      description: "Root-mean-square value of the sine wave.",
      id: "rmsVoltageV",
      kind: "number",
      label: "RMS voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Peak amplitude of the sine wave.",
      format: "voltage-v",
      id: "peakVoltageV",
      kind: "number",
      label: "Peak voltage",
      unit: "V",
    },
  ],
  title: "RMS to Peak Voltage Calculator",
});
export const runRmsToPeakVoltage = rmsToPeakVoltageTool.execute;
export default rmsToPeakVoltageTool;
