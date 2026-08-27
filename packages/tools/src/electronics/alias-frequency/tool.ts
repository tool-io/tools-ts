import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const aliasFrequencyExample = {
  input: { sampleRateHz: 6000, signalFreqHz: 7500 },
} satisfies ToolExample<{
  readonly sampleRateHz: number;
  readonly signalFreqHz: number;
}>;

export const aliasFrequencyTool = createSimpleTool({
  id: "electronics/alias-frequency",
  title: "Alias Frequency",
  description:
    "Calculate the aliased frequency produced by sampling a signal above the Nyquist limit.",
  inputs: [
    { id: "signalFreqHz", label: "Signal frequency", kind: "number" },
    { id: "sampleRateHz", label: "Sample rate", kind: "number" },
  ],
  outputs: [
    { id: "aliasFrequencyHz", label: "Alias frequency", kind: "number" },
  ],
  calculate: (input) => {
    const signalFreqHz = input.signalFreqHz as number;
    const sampleRateHz = input.sampleRateHz as number;
    if (signalFreqHz <= 0)
      simpleError(
        "signalFreqHz",
        "Signal frequency must be greater than zero.",
      );
    if (sampleRateHz <= 0)
      simpleError("sampleRateHz", "Sample rate must be greater than zero.");
    return {
      aliasFrequencyHz: Math.abs(
        signalFreqHz - Math.round(signalFreqHz / sampleRateHz) * sampleRateHz,
      ),
    };
  },
});
export const runAliasFrequency = aliasFrequencyTool.execute;
export default aliasFrequencyTool;
