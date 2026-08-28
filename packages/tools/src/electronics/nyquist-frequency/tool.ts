import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nyquistFrequencyExample = {
  input: { sampleRateHz: 44100 },
} satisfies ToolExample<{
  readonly sampleRateHz: number;
}>;

export const nyquistFrequencyTool = createSimpleTool({
  id: "electronics/nyquist-frequency",
  title: "Nyquist Frequency",
  description:
    "Calculate the highest frequency that can be represented without aliasing at a given sample rate.",
  inputs: [{ id: "sampleRateHz", label: "Sample rate", kind: "number" }],
  outputs: [
    { id: "nyquistFrequencyHz", label: "Nyquist frequency", kind: "number" },
  ],
  calculate: (input) => {
    const sampleRateHz = input.sampleRateHz as number;
    if (sampleRateHz <= 0)
      simpleError("sampleRateHz", "Sample rate must be greater than zero.");
    return { nyquistFrequencyHz: sampleRateHz / 2 };
  },
});
export const runNyquistFrequency = nyquistFrequencyTool.execute;
export default nyquistFrequencyTool;
