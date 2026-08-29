import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { bits: 12 },
  output: { snrDb: 74.0081115499123 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/adc-snr-ideal",
  title: "Ideal ADC SNR",
  description:
    "Estimate ideal full-scale sine-wave signal-to-quantization-noise ratio as 6.02N+1.76 dB. Oversampling, thermal noise, distortion, and reduced input amplitude are not included.",
  inputs: [
    { id: "bits", kind: "integer", label: "Resolution (bits)", minimum: 1 },
  ],
  outputs: [{ id: "snrDb", kind: "number", label: "SNR dB" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.bits > 52)
      simpleError(
        "bits",
        "Resolution above 52 bits exceeds useful JavaScript floating precision.",
      );
    const output = { snrDb: 6.020599913279624 * i.bits + 1.7609125905568124 };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AdcSnrIdealInput = Readonly<typeof example.input>;
export type AdcSnrIdealOutput = Readonly<typeof example.output>;
export const adcSnrIdealTool = tool;
export const runAdcSnrIdeal = tool.execute;
export default tool;
