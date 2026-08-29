import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { fundamentalRms: 1, harmonicRms: [0.01, 0.02] },
  output: {
    thdPercent: Math.sqrt(0.0005) * 100,
    thdDb: 20 * Math.log10(Math.sqrt(0.0005)),
  },
} satisfies ToolExample<
  { readonly fundamentalRms: number; readonly harmonicRms: number[] },
  { readonly thdPercent: number; readonly thdDb: number }
>;
export const tool = createSimpleTool({
  id: "electronics/adc-thd-calculation",
  title: "ADC Total Harmonic Distortion",
  description:
    "Calculate THD from RMS harmonic amplitudes relative to the fundamental: sqrt(sum of harmonic squares)/fundamental. Output is percent and dBc; include only the harmonics specified by the measurement method, excluding noise and DC.",
  inputs: [
    {
      id: "fundamentalRms",
      kind: "number",
      label: "Fundamental RMS amplitude",
      minimum: Number.MIN_VALUE,
    },
    { id: "harmonicRms", kind: "numberList", label: "Harmonic RMS amplitudes" },
  ],
  outputs: [
    { id: "thdPercent", kind: "number", label: "THD (%)" },
    { id: "thdDb", kind: "number", label: "THD (dBc)" },
  ],
  calculate: (input) => {
    const fundamental = input.fundamentalRms as number;
    const harmonics = input.harmonicRms as number[];
    if (!harmonics.length || harmonics.some((value) => value < 0))
      simpleError(
        "harmonicRms",
        "Supply at least one nonnegative harmonic amplitude.",
      );
    const ratio = Math.hypot(...harmonics) / fundamental;
    if (ratio === 0)
      simpleError(
        "harmonicRms",
        "Zero distortion has a THD of negative infinity dBc and cannot be represented as a finite dB value.",
      );
    return { thdPercent: ratio * 100, thdDb: 20 * Math.log10(ratio) };
  },
});
export type AdcThdCalculationInput = Readonly<typeof example.input>;
export type AdcThdCalculationOutput = Readonly<typeof example.output>;
export const adcThdCalculationTool = tool;
export const runAdcThdCalculation = tool.execute;
export default tool;
