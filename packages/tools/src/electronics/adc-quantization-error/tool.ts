import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { fullScaleSpanV: 4.096, bits: 12 },
  output: { maximumErrorV: 0.0005 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/adc-quantization-error",
  title: "ADC Quantization Error Bound",
  description:
    "Calculate the ideal rounding quantizer's maximum absolute error as half an ADC LSB. Assumes a uniform quantizer and input within the conversion range; offset, gain, and noise errors are excluded.",
  inputs: [
    {
      id: "fullScaleSpanV",
      kind: "number",
      label: "Full-scale input span (V)",
      minimum: Number.MIN_VALUE,
    },
    { id: "bits", kind: "integer", label: "Resolution (bits)", minimum: 1 },
  ],
  outputs: [{ id: "maximumErrorV", kind: "number", label: "Maximum Error V" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.bits > 52)
      simpleError(
        "bits",
        "Resolution above 52 bits exceeds useful JavaScript floating precision.",
      );
    const output = {
      maximumErrorV: i.fullScaleSpanV / Math.pow(2, i.bits + 1),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AdcQuantizationErrorInput = Readonly<typeof example.input>;
export type AdcQuantizationErrorOutput = Readonly<typeof example.output>;
export const adcQuantizationErrorTool = tool;
export const runAdcQuantizationError = tool.execute;
export default tool;
