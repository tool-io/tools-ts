import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LidarSignalToNoiseInput = Readonly<{
  readonly signalAmplitude: number;
  readonly noiseRmsAmplitude: number;
}>;
export type LidarSignalToNoiseOutput = Readonly<{
  readonly snrDecibels: number;
}>;

export const calculateLidarSignalToNoise = (
  x: LidarSignalToNoiseInput,
): LidarSignalToNoiseOutput => {
  if (!Number.isFinite(x.signalAmplitude) || x.signalAmplitude < 0)
    simpleError("signalAmplitude", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.noiseRmsAmplitude) || x.noiseRmsAmplitude < 0)
    simpleError("noiseRmsAmplitude", "Provide a finite number at least 0.");
  const snrDecibels = 20 * Math.log10(x.signalAmplitude / x.noiseRmsAmplitude);
  if (!Number.isFinite(snrDecibels))
    simpleError(
      "snrDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return { snrDecibels: Object.is(snrDecibels, -0) ? 0 : snrDecibels };
};

export const example = {
  input: { signalAmplitude: 100, noiseRmsAmplitude: 1 },
  output: { snrDecibels: 40 },
} satisfies ToolExample<LidarSignalToNoiseInput, LidarSignalToNoiseOutput>;

export const tool = createSimpleTool({
  id: "electronics/lidar-signal-to-noise",
  title: "LIDAR Signal To Noise",
  description:
    "Detected LiDAR signal-to-noise ratio in decibels from matched-unit RMS signal and noise amplitudes.",
  inputs: [
    {
      id: "signalAmplitude",
      kind: "number",
      label: "Signal Amplitude",
      minimum: 0,
    },
    {
      id: "noiseRmsAmplitude",
      kind: "number",
      label: "Noise Rms Amplitude",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "snrDecibels", kind: "number", label: "Snr Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateLidarSignalToNoise({
      signalAmplitude: input.signalAmplitude as number,
      noiseRmsAmplitude: input.noiseRmsAmplitude as number,
    }),
});
export const lidarSignalToNoiseTool = tool;
export const runLidarSignalToNoise = tool.execute;
export default tool;
