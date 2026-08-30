import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RmsToPeakFactorAudioInput = Readonly<{
  readonly rmsAmplitude: number;
}>;
export type RmsToPeakFactorAudioOutput = Readonly<{
  readonly sinePeakAmplitude: number;
}>;

export const calculateRmsToPeakFactorAudio = (
  x: RmsToPeakFactorAudioInput,
): RmsToPeakFactorAudioOutput => {
  if (!Number.isFinite(x.rmsAmplitude) || x.rmsAmplitude < 0)
    simpleError("rmsAmplitude", "Provide a finite nonnegative number.");
  const sinePeakAmplitude = Math.SQRT2 * x.rmsAmplitude;
  if (!Number.isFinite(sinePeakAmplitude))
    simpleError(
      "sinePeakAmplitude",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    sinePeakAmplitude: Object.is(sinePeakAmplitude, -0) ? 0 : sinePeakAmplitude,
  };
};

export const example = {
  input: {
    rmsAmplitude: 1,
  },
  output: { sinePeakAmplitude: 1.4142135623730951 },
} satisfies ToolExample<RmsToPeakFactorAudioInput, RmsToPeakFactorAudioOutput>;

export const tool = createSimpleTool({
  id: "music/rms-to-peak-factor-audio",
  title: "Rms To Peak Factor Audio",
  description:
    "Peak amplitude of an ideal sine wave from its RMS amplitude (sqrt(2) factor).",
  inputs: [
    { id: "rmsAmplitude", kind: "number", label: "Rms Amplitude", minimum: 0 },
  ],
  outputs: [
    { id: "sinePeakAmplitude", kind: "number", label: "Sine Peak Amplitude" },
  ],
  calculate: (input) =>
    calculateRmsToPeakFactorAudio({
      rmsAmplitude: input.rmsAmplitude as number,
    }),
});
export const rmsToPeakFactorAudioTool = tool;
export const runRmsToPeakFactorAudio = tool.execute;
export default tool;
