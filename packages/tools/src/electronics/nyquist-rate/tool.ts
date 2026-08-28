import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nyquistRateExample = {
  input: { maxFrequencyHz: 20000 },
} satisfies ToolExample<{
  readonly maxFrequencyHz: number;
}>;

export const nyquistRateTool = createSimpleTool({
  id: "electronics/nyquist-rate",
  title: "Nyquist Rate",
  description:
    "Calculate the minimum sampling rate for perfect reconstruction of a bandlimited signal.",
  inputs: [
    { id: "maxFrequencyHz", label: "Maximum frequency", kind: "number" },
  ],
  outputs: [{ id: "nyquistRateHz", label: "Nyquist rate", kind: "number" }],
  calculate: (input) => {
    const maxFrequencyHz = input.maxFrequencyHz as number;
    if (maxFrequencyHz <= 0)
      simpleError("maxFrequencyHz", "Frequency must be greater than zero.");
    return { nyquistRateHz: 2 * maxFrequencyHz };
  },
});
export const runNyquistRate = nyquistRateTool.execute;
export default nyquistRateTool;
