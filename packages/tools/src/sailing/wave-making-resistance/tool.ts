import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaveMakingResistanceInput = {
  readonly totalResistanceNewtons: number;
  readonly waveResistanceNewtons: number;
};

export type WaveMakingResistanceOutput = {
  readonly wavemakingRatioPercent: number;
};

export const waveMakingResistanceExample = {
  input: { totalResistanceNewtons: 1000, waveResistanceNewtons: 250 },
  output: { wavemakingRatioPercent: 25 },
} satisfies ToolExample<WaveMakingResistanceInput, WaveMakingResistanceOutput>;

export const waveMakingResistanceTool = createSimpleTool({
  calculate: (input) => {
    const waveResistanceNewtons = input.waveResistanceNewtons as number;
    const totalResistanceNewtons = input.totalResistanceNewtons as number;
    if (waveResistanceNewtons < 0)
      simpleError(
        "waveResistanceNewtons",
        "Wave making resistance must be non-negative.",
        "invalid_wave_resistance",
      );
    if (totalResistanceNewtons <= 0)
      simpleError(
        "totalResistanceNewtons",
        "Total resistance must be positive.",
        "invalid_total_resistance",
      );
    if (waveResistanceNewtons > totalResistanceNewtons)
      simpleError(
        "waveResistanceNewtons",
        "Wave-making resistance cannot exceed total resistance.",
        "inconsistent_components",
      );
    return {
      wavemakingRatioPercent:
        (waveResistanceNewtons / totalResistanceNewtons) * 100,
    };
  },
  description:
    "Compute the wave making share of total hull resistance using wavemakingRatioPercent = waveResistanceNewtons / totalResistanceNewtons * 100.",
  id: "sailing/wave-making-resistance",
  inputs: [
    {
      description: "Total hull resistance at the operating speed.",
      id: "totalResistanceNewtons",
      kind: "number",
      label: "Total resistance",
      minimum: 0,
      unit: "N",
    },
    {
      description: "Wave making component of the hull resistance.",
      id: "waveResistanceNewtons",
      kind: "number",
      label: "Wave making resistance",
      minimum: 0,
      unit: "N",
    },
  ],
  outputs: [
    {
      description:
        "Percentage of total resistance attributable to wave making.",
      id: "wavemakingRatioPercent",
      kind: "number",
      label: "Wavemaking ratio",
      unit: "%",
    },
  ],
  title: "Wave Making Resistance Ratio",
});
export const runWaveMakingResistance = waveMakingResistanceTool.execute;
export default waveMakingResistanceTool;
