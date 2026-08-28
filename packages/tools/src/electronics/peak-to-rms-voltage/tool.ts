import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeakToRmsVoltageInput = {
  readonly peakVoltageV: number;
};

export type PeakToRmsVoltageOutput = {
  readonly rmsVoltageV: number;
};

export const peakToRmsVoltageExample = {
  input: { peakVoltageV: 10 },
  output: { rmsVoltageV: 7.071067811865475 },
} satisfies ToolExample<PeakToRmsVoltageInput, PeakToRmsVoltageOutput>;

export const calculatePeakToRmsVoltage = (
  input: PeakToRmsVoltageInput,
): PeakToRmsVoltageOutput => {
  if (input.peakVoltageV < 0)
    simpleError(
      "peakVoltageV",
      "The peak amplitude cannot be negative.",
      "invalid_input",
    );
  return { rmsVoltageV: input.peakVoltageV / Math.SQRT2 };
};

export const peakToRmsVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculatePeakToRmsVoltage(input as unknown as PeakToRmsVoltageInput),
  description:
    "Convert a sinusoidal peak voltage to its root-mean-square value, Vrms = Vp / sqrt(2); the RMS value produces the same heating in a resistor as the equivalent DC voltage.",
  id: "electronics/peak-to-rms-voltage",
  inputs: [
    {
      description: "Peak amplitude of the sine wave.",
      id: "peakVoltageV",
      kind: "number",
      label: "Peak voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Root-mean-square voltage of the sine wave.",
      format: "voltage-v",
      id: "rmsVoltageV",
      kind: "number",
      label: "RMS voltage",
      unit: "V",
    },
  ],
  title: "Peak to RMS Voltage Calculator",
});
export const runPeakToRmsVoltage = peakToRmsVoltageTool.execute;
export default peakToRmsVoltageTool;
