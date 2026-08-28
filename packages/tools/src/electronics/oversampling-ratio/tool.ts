import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const oversamplingRatioExample = {
  input: { actualSampleRateHz: 48000, nyquistRequiredHz: 24000 },
} satisfies ToolExample<{
  readonly actualSampleRateHz: number;
  readonly nyquistRequiredHz: number;
}>;

export const oversamplingRatioTool = createSimpleTool({
  id: "electronics/oversampling-ratio",
  title: "Oversampling Ratio",
  description:
    "Calculate how much faster a system samples compared with the minimum Nyquist requirement.",
  inputs: [
    { id: "actualSampleRateHz", label: "Actual sample rate", kind: "number" },
    { id: "nyquistRequiredHz", label: "Nyquist rate", kind: "number" },
  ],
  outputs: [
    { id: "oversamplingRatio", label: "Oversampling ratio", kind: "number" },
  ],
  calculate: (input) => {
    const actualSampleRateHz = input.actualSampleRateHz as number;
    const nyquistRequiredHz = input.nyquistRequiredHz as number;
    if (actualSampleRateHz <= 0)
      simpleError(
        "actualSampleRateHz",
        "Actual sample rate must be greater than zero.",
      );
    if (nyquistRequiredHz <= 0)
      simpleError(
        "nyquistRequiredHz",
        "Nyquist rate must be greater than zero.",
      );
    return { oversamplingRatio: actualSampleRateHz / nyquistRequiredHz };
  },
});
export const runOversamplingRatio = oversamplingRatioTool.execute;
export default oversamplingRatioTool;
