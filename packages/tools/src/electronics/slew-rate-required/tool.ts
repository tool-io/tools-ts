import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlewRateRequiredInput = {
  readonly frequencyHz: number;
  readonly peakVolts: number;
};

export type SlewRateRequiredOutput = {
  readonly slewRateVPerMicrosecond: number;
};

export const slewRateRequiredExample = {
  input: { frequencyHz: 20000, peakVolts: 5 },
  output: { slewRateVPerMicrosecond: 0.6283185307179587 },
} satisfies ToolExample<SlewRateRequiredInput, SlewRateRequiredOutput>;

export const calculateSlewRateRequired = (
  input: SlewRateRequiredInput,
): SlewRateRequiredOutput => {
  if (!(input.frequencyHz > 0))
    simpleError(
      "frequencyHz",
      "Frequency must be positive.",
      "invalid_frequency",
    );
  if (!(input.peakVolts > 0))
    simpleError("peakVolts", "Peak voltage must be positive.", "invalid_peak");
  return {
    slewRateVPerMicrosecond:
      (2 * Math.PI * input.frequencyHz * input.peakVolts) / 1e6,
  };
};

export const slewRateRequiredTool = createSimpleTool({
  calculate: (input) =>
    calculateSlewRateRequired(input as unknown as SlewRateRequiredInput),
  description: "Calculate the slew rate required for a sinusoidal signal.",
  id: "electronics/slew-rate-required",
  inputs: [
    { id: "frequencyHz", kind: "number", label: "Frequency", unit: "Hz" },
    { id: "peakVolts", kind: "number", label: "Peak voltage", unit: "V" },
  ],
  outputs: [
    {
      id: "slewRateVPerMicrosecond",
      kind: "number",
      label: "Slew rate",
      unit: "V/us",
    },
  ],
  title: "Required Slew Rate",
});
export const runSlewRateRequired = slewRateRequiredTool.execute;
export default slewRateRequiredTool;
