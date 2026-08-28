import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SignalToNoiseAndDistortionInput = {
  readonly fundamentalV: number;
  readonly distortionVSq: number;
  readonly noiseVSq: number;
};

export type SignalToNoiseAndDistortionOutput = {
  readonly sinadDb: number;
};

export const signalToNoiseAndDistortionExample = {
  input: { fundamentalV: 1, distortionVSq: 0.000001, noiseVSq: 0.000001 },
  output: { sinadDb: 56.98970004336019 },
} satisfies ToolExample<
  SignalToNoiseAndDistortionInput,
  SignalToNoiseAndDistortionOutput
>;

export const signalToNoiseAndDistortionTool = createSimpleTool({
  id: "electronics/signal-to-noise-and-distortion",
  title: "SINAD dB",
  description:
    "Compute SINAD in decibels as 20 x log10(Vfundamental / sqrt(noise^2 + distortion^2)); there must be some noise or distortion.",
  inputs: [
    { id: "fundamentalV", label: "Fundamental", kind: "number", unit: "V" },
    {
      id: "distortionVSq",
      label: "Distortion power",
      kind: "number",
      unit: "V²",
    },
    { id: "noiseVSq", label: "Noise power", kind: "number", unit: "V²" },
  ],
  outputs: [{ id: "sinadDb", label: "SINAD", kind: "number", unit: "dB" }],
  calculate: (input) => {
    const fundamentalV = input.fundamentalV as number;
    const distortionVSq = input.distortionVSq as number;
    const noiseVSq = input.noiseVSq as number;
    if (!(fundamentalV > 0))
      simpleError(
        "fundamentalV",
        "Fundamental amplitude must be positive.",
        "invalid_fundamental",
      );
    if (!(noiseVSq + distortionVSq > 0))
      simpleError(
        "noiseVSq",
        "Noise or distortion power must be positive.",
        "no_distortion_or_noise",
      );
    return {
      sinadDb:
        20 * Math.log10(fundamentalV / Math.sqrt(noiseVSq + distortionVSq)),
    };
  },
});
export const runSignalToNoiseAndDistortion =
  signalToNoiseAndDistortionTool.execute;
export default signalToNoiseAndDistortionTool;
