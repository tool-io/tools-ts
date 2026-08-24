import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaveguideLossInput = {
  readonly lengthCm: number;
  readonly lossDbPerCm: number;
};

export type WaveguideLossOutput = {
  readonly totalLossDb: number;
};

export const waveguideLossExample = {
  input: { lengthCm: 4, lossDbPerCm: 0.5 },
  output: { totalLossDb: 2 },
} satisfies ToolExample<WaveguideLossInput, WaveguideLossOutput>;

export const waveguideLossTool = createSimpleTool({
  calculate: (input) => {
    const length = input.lengthCm as number;
    const loss = input.lossDbPerCm as number;
    if (!(loss >= 0))
      simpleError(
        "lossDbPerCm",
        "Attenuation per centimeter must not be negative.",
        "invalid_loss_per_cm",
      );
    if (!(length >= 0))
      simpleError(
        "lengthCm",
        "Waveguide length must not be negative.",
        "invalid_length",
      );
    return { totalLossDb: loss * length };
  },
  description:
    "Compute the total insertion loss of an optical waveguide from its attenuation per centimeter and physical length.",
  id: "semiconductor/photonic-waveguide-loss",
  inputs: [
    {
      id: "lengthCm",
      kind: "number",
      label: "Waveguide length",
      minimum: 0,
      unit: "cm",
    },
    {
      id: "lossDbPerCm",
      kind: "number",
      label: "Attenuation",
      minimum: 0,
      unit: "dB/cm",
    },
  ],
  outputs: [
    {
      id: "totalLossDb",
      kind: "number",
      label: "Total loss",
      minimum: 0,
      unit: "dB",
    },
  ],
  title: "Waveguide Loss Calculator",
});
export const runWaveguideLoss = waveguideLossTool.execute;
export default waveguideLossTool;
