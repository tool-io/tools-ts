import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SlewRateBandwidthLimitInput = {
  readonly slewRateVPerSecond: number;
  readonly peakVolts: number;
};

export type SlewRateBandwidthLimitOutput = {
  readonly maxFrequencyHz: number;
};

export const slewRateBandwidthLimitExample = {
  input: { slewRateVPerSecond: 1000000, peakVolts: 5 },
  output: { maxFrequencyHz: 31830.98861837907 },
} satisfies ToolExample<
  SlewRateBandwidthLimitInput,
  SlewRateBandwidthLimitOutput
>;

export const slewRateBandwidthLimitTool = createSimpleTool({
  id: "electronics/slew-rate-bandwidth-limit",
  title: "Slew Limited Bandwidth",
  description:
    "Compute the maximum full-amplitude sine frequency as slew rate / (2 x PI x peak voltage).",
  inputs: [
    {
      id: "slewRateVPerSecond",
      label: "Slew rate",
      kind: "number",
      unit: "V/s",
    },
    { id: "peakVolts", label: "Peak voltage", kind: "number", unit: "V" },
  ],
  outputs: [
    {
      id: "maxFrequencyHz",
      label: "Max frequency",
      kind: "number",
      unit: "Hz",
    },
  ],
  calculate: (input) => {
    const slewRateVPerSecond = input.slewRateVPerSecond as number;
    const peakVolts = input.peakVolts as number;
    if (!(slewRateVPerSecond > 0))
      simpleError(
        "slewRateVPerSecond",
        "Slew rate must be positive.",
        "invalid_slew_rate",
      );
    if (!(peakVolts > 0))
      simpleError(
        "peakVolts",
        "Peak voltage must be positive.",
        "invalid_voltage",
      );
    return {
      maxFrequencyHz: slewRateVPerSecond / (2 * Math.PI * peakVolts),
    };
  },
});
export const runSlewRateBandwidthLimit = slewRateBandwidthLimitTool.execute;
export default slewRateBandwidthLimitTool;
