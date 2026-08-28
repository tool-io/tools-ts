import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinimumDetectableSignalInput = {
  readonly bandwidthHz: number;
  readonly noiseFigureDb: number;
  readonly requiredSnrDb: number;
};

export type MinimumDetectableSignalOutput = {
  readonly minimumDetectableSignalDbm: number;
};

export const minimumDetectableSignalExample = {
  input: { bandwidthHz: 1000000, noiseFigureDb: 3, requiredSnrDb: 10 },
  output: { minimumDetectableSignalDbm: -101 },
} satisfies ToolExample<
  MinimumDetectableSignalInput,
  MinimumDetectableSignalOutput
>;

export const minimumDetectableSignalTool = createSimpleTool({
  id: "electronics/minimum-detectable-signal",
  title: "MDS Calculator",
  description:
    "Compute the minimum detectable signal as MDS(dBm) = -174 + 10 x log10(BW(Hz)) + NF(dB) + SNR(dB); bandwidth must be positive and the noise figure non-negative.",
  inputs: [
    { id: "bandwidthHz", label: "Bandwidth", kind: "number", unit: "Hz" },
    { id: "noiseFigureDb", label: "Noise figure", kind: "number", unit: "dB" },
    { id: "requiredSnrDb", label: "Required SNR", kind: "number", unit: "dB" },
  ],
  outputs: [
    {
      id: "minimumDetectableSignalDbm",
      label: "Minimum detectable signal",
      kind: "number",
      unit: "dBm",
    },
  ],
  calculate: (input) => {
    const bandwidthHz = input.bandwidthHz as number;
    const noiseFigureDb = input.noiseFigureDb as number;
    const requiredSnrDb = input.requiredSnrDb as number;
    if (!(bandwidthHz > 0))
      simpleError(
        "bandwidthHz",
        "Bandwidth must be positive.",
        "invalid_bandwidth",
      );
    if (!(noiseFigureDb >= 0))
      simpleError(
        "noiseFigureDb",
        "Noise figure must not be negative.",
        "invalid_noise_figure",
      );
    if (!Number.isFinite(requiredSnrDb))
      simpleError(
        "requiredSnrDb",
        "Required SNR must be finite.",
        "invalid_snr",
      );
    return {
      minimumDetectableSignalDbm:
        -174 + 10 * Math.log10(bandwidthHz) + noiseFigureDb + requiredSnrDb,
    };
  },
});
export const runMinimumDetectableSignal = minimumDetectableSignalTool.execute;
export default minimumDetectableSignalTool;
