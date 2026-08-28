import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SignalToNoiseInput = {
  readonly meanSignal: number;
  readonly noiseStandardDeviation: number;
};

export type SignalToNoiseOutput = {
  readonly signalToNoiseRatio: number;
};

export const signalToNoiseExample = {
  input: { meanSignal: 100, noiseStandardDeviation: 2 },
  output: { signalToNoiseRatio: 50 },
} satisfies ToolExample<SignalToNoiseInput, SignalToNoiseOutput>;

export const signalToNoiseTool = createSimpleTool({
  id: "chemistry/analytical-signal-to-noise",
  title: "Signal To Noise Ratio",
  description:
    "Compute the analytical signal to noise ratio from the mean signal and the noise standard deviation.",
  inputs: [
    {
      id: "meanSignal",
      label: "Mean signal",
      kind: "number",
      minimum: 0,
      unit: "signal",
    },
    {
      id: "noiseStandardDeviation",
      label: "Noise standard deviation",
      kind: "number",
      unit: "signal",
    },
  ],
  outputs: [
    {
      id: "signalToNoiseRatio",
      label: "Signal to noise ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const meanSignal = input.meanSignal as number;
    const noiseStandardDeviation = input.noiseStandardDeviation as number;
    if (!(noiseStandardDeviation > 0))
      simpleError(
        "noiseStandardDeviation",
        "Noise standard deviation must be positive.",
      );
    return { signalToNoiseRatio: meanSignal / noiseStandardDeviation };
  },
});
export const runSignalToNoise = signalToNoiseTool.execute;
export default signalToNoiseTool;
