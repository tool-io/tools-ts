import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecibelVoltageRatioInput = {
  readonly measuredVoltageV: number;
  readonly referenceVoltageV: number;
};

export type DecibelVoltageRatioOutput = {
  readonly decibelsDb: number;
};

export const decibelVoltageRatioExample = {
  input: {
    measuredVoltageV: 10,
    referenceVoltageV: 1,
  },
  output: { decibelsDb: 20 },
} satisfies ToolExample<DecibelVoltageRatioInput, DecibelVoltageRatioOutput>;

export const calculateDecibelVoltageRatio = (
  input: DecibelVoltageRatioInput,
): DecibelVoltageRatioOutput => {
  if (input.referenceVoltageV <= 0 || input.measuredVoltageV <= 0)
    simpleError(
      "referenceVoltageV",
      "Both voltage amplitudes must be positive for a logarithmic ratio.",
      "invalid_input",
    );
  return {
    decibelsDb:
      20 * Math.log10(input.measuredVoltageV / input.referenceVoltageV),
  };
};

export const decibelVoltageRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateDecibelVoltageRatio(input as unknown as DecibelVoltageRatioInput),
  description:
    "Compute an amplitude ratio in decibels across equal impedances, dB = 20 * log10(V2 / V1); a tenfold voltage increase is +20 dB.",
  id: "electronics/decibel-voltage-ratio",
  inputs: [
    {
      description: "Measured or output voltage amplitude.",
      format: "voltage-v",
      id: "measuredVoltageV",
      kind: "number",
      label: "Measured voltage",
      unit: "V",
    },
    {
      description: "Reference or input voltage amplitude.",
      format: "voltage-v",
      id: "referenceVoltageV",
      kind: "number",
      label: "Reference voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Level of the measured voltage relative to the reference.",
      format: "decibel-db",
      id: "decibelsDb",
      kind: "number",
      label: "Voltage ratio",
      unit: "dB",
    },
  ],
  title: "Decibel Voltage Ratio Calculator",
});
export const runDecibelVoltageRatio = decibelVoltageRatioTool.execute;
export default decibelVoltageRatioTool;
