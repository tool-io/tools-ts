import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TvsPeakPulsePowerInput = Readonly<{
  readonly clampingVoltageV: number;
  readonly peakPulseCurrentAmperes: number;
}>;
export type TvsPeakPulsePowerOutput = Readonly<{ peakPulsePowerW: number }>;

export const calculateTvsPeakPulsePower = (
  i: TvsPeakPulsePowerInput,
): TvsPeakPulsePowerOutput => {
  const value = i.clampingVoltageV * i.peakPulseCurrentAmperes;
  if (!Number.isFinite(value))
    simpleError("peakPulsePowerW", "The inputs produce a non-finite result.");
  return { peakPulsePowerW: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { clampingVoltageV: 40, peakPulseCurrentAmperes: 25 },
  output: { peakPulsePowerW: 1000 },
} satisfies ToolExample<TvsPeakPulsePowerInput, TvsPeakPulsePowerOutput>;

export const tool = createSimpleTool({
  id: "electronics/tvs-peak-pulse-power",
  title: "TVS Peak Pulse Power",
  description:
    "Calculate peak transient-voltage-suppressor pulse power as clamping voltage multiplied by peak pulse current at the same point on the device curve.",
  inputs: [
    {
      id: "clampingVoltageV",
      kind: "number",
      label: "Clamping (V)",
      unit: "V",
      minimum: 0,
    },
    {
      id: "peakPulseCurrentAmperes",
      kind: "number",
      label: "Peak Pulse Current (A)",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "peakPulsePowerW",
      kind: "number",
      label: "Peak Pulse Power (W)",
      unit: "W",
    },
  ],
  calculate: (input) =>
    calculateTvsPeakPulsePower({
      clampingVoltageV: input.clampingVoltageV as number,
      peakPulseCurrentAmperes: input.peakPulseCurrentAmperes as number,
    }),
});
export const tvsPeakPulsePowerTool = tool;
export const runTvsPeakPulsePower = tool.execute;
export default tool;
