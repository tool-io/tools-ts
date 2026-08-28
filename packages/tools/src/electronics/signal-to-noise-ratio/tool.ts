import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const signalToNoiseRatioExample = {
  input: { noiseWatts: 2, signalWatts: 10 },
} satisfies ToolExample<{
  readonly noiseWatts: number;
  readonly signalWatts: number;
}>;

export const signalToNoiseRatioTool = createSimpleTool({
  id: "electronics/signal-to-noise-ratio",
  title: "SNR Linear",
  description:
    "Calculate the linear signal-to-noise power ratio from signal and noise powers.",
  inputs: [
    { id: "signalWatts", label: "Signal power", kind: "number" },
    { id: "noiseWatts", label: "Noise power", kind: "number" },
  ],
  outputs: [{ id: "signalToNoiseRatio", label: "SNR", kind: "number" }],
  calculate: (input) => {
    const signalWatts = input.signalWatts as number;
    const noiseWatts = input.noiseWatts as number;
    if (noiseWatts <= 0)
      simpleError("noiseWatts", "Noise power must be greater than zero.");
    if (signalWatts < 0)
      simpleError("signalWatts", "Signal power must not be negative.");
    return { signalToNoiseRatio: signalWatts / noiseWatts };
  },
});
export const runSignalToNoiseRatio = signalToNoiseRatioTool.execute;
export default signalToNoiseRatioTool;
