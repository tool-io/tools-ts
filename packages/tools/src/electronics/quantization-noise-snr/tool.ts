import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const quantizationNoiseSnrExample = {
  input: { bits: 16 },
} satisfies ToolExample<{
  readonly bits: number;
}>;

export const quantizationNoiseSnrTool = createSimpleTool({
  id: "electronics/quantization-noise-snr",
  title: "Quantization SNR",
  description:
    "Calculate the theoretical signal-to-noise ratio limit of an ideal quantizer in decibels.",
  inputs: [
    { id: "bits", label: "Bits", kind: "integer", maximum: 32, minimum: 1 },
  ],
  outputs: [
    { id: "quantizationSnrDb", label: "Quantization SNR", kind: "number" },
  ],
  calculate: (input) => {
    const bits = input.bits as number;
    return { quantizationSnrDb: 6.02 * bits + 1.76 };
  },
});
export const runQuantizationNoiseSnr = quantizationNoiseSnrTool.execute;
export default quantizationNoiseSnrTool;
