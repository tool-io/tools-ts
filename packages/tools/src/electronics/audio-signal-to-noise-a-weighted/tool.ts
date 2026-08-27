import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const audioSignalToNoiseAWeightedExample = {
  input: { noiseFloorVrms: 1e-5, signalVrms: 1 },
} satisfies ToolExample<{
  readonly aWeightCorrectionDb?: number;
  readonly noiseFloorVrms: number;
  readonly signalVrms: number;
}>;

export const audioSignalToNoiseAWeightedTool = createSimpleTool({
  id: "electronics/audio-signal-to-noise-a-weighted",
  title: "A-Weighted SNR dB",
  description:
    "Compute A-weighted signal-to-noise ratio snrADb = 20 * log10(signalVrms / noiseFloorVrms) + aWeightCorrectionDb, with the correction defaulting to zero.",
  inputs: [
    {
      description: "RMS signal level.",
      id: "signalVrms",
      kind: "number",
      label: "Signal",
      unit: "V RMS",
    },
    {
      description: "Integrated noise floor.",
      id: "noiseFloorVrms",
      kind: "number",
      label: "Noise Floor",
      unit: "V RMS",
    },
    {
      default: 0,
      description: "A-weighting correction applied to the broadband ratio.",
      id: "aWeightCorrectionDb",
      kind: "number",
      label: "A-Weight Correction",
      maximum: 50,
      minimum: -50,
      required: false,
      unit: "dB",
    },
  ],
  outputs: [
    {
      description: "A-weighted signal-to-noise ratio.",
      id: "snrAWeightedDb",
      kind: "number",
      label: "SNR",
      unit: "dB",
    },
  ],
  calculate: (input) => {
    const signalVrms = input.signalVrms as number;
    const noiseFloorVrms = input.noiseFloorVrms as number;
    if (!(signalVrms > 0) || !(noiseFloorVrms > 0))
      simpleError("signalVrms", "Signal and noise levels must be positive.");
    return {
      snrAWeightedDb:
        20 * Math.log10(signalVrms / noiseFloorVrms) +
        (input.aWeightCorrectionDb as number),
    };
  },
});
export const runAudioSignalToNoiseAWeighted =
  audioSignalToNoiseAWeightedTool.execute;
export default audioSignalToNoiseAWeightedTool;
