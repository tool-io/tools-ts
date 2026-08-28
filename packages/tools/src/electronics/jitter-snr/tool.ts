import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const jitterSnrExample = {
  input: { jitterSecondsRms: 1e-12, signalFreqHz: 1000000 },
} satisfies ToolExample<{
  readonly jitterSecondsRms: number;
  readonly signalFreqHz: number;
}>;

export const jitterSnrTool = createSimpleTool({
  id: "electronics/jitter-snr",
  title: "Jitter SNR Limit",
  description:
    "Calculate the signal-to-noise ratio ceiling imposed by sampling clock aperture jitter.",
  inputs: [
    { id: "signalFreqHz", label: "Signal frequency", kind: "number" },
    { id: "jitterSecondsRms", label: "Jitter RMS", kind: "number" },
  ],
  outputs: [
    {
      id: "jitterLimitedSnrDb",
      label: "Jitter-limited SNR",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const signalFreqHz = input.signalFreqHz as number;
    const jitterSecondsRms = input.jitterSecondsRms as number;
    if (signalFreqHz <= 0)
      simpleError(
        "signalFreqHz",
        "Signal frequency must be greater than zero.",
      );
    if (jitterSecondsRms <= 0)
      simpleError("jitterSecondsRms", "Jitter must be greater than zero.");
    return {
      jitterLimitedSnrDb:
        -20 * Math.log10(2 * Math.PI * signalFreqHz * jitterSecondsRms),
    };
  },
});
export const runJitterSnr = jitterSnrTool.execute;
export default jitterSnrTool;
